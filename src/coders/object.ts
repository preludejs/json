import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = unknown

export const constructor = Object

export const name = null

export const encode =
  (input: t, encoder: Encoder.t) => {
    if (typeof input !== 'object' || input === null) {
      throw new Error(`Expected object, got ${typeof input}.`)
    }
    let output: object = input
    for (const key in input) {
      const inputValue = input[key]
      const value = Encoder.encode(inputValue, encoder)
      if (inputValue === value) {
        continue
      }
      if (output === input) {
        output = { ...input }
      }
      output[key] = value
    }
    return output
  }

/** Decodes key-value pair recursively. */
const decodeProperty =
  (decoder: Decoder.t, key: string, index: number, value: unknown): [string, unknown] => {
    let currentKey = key
    let currentValue = value
    let currentIndex = index
    while (true) {
      const type = currentKey.slice(currentIndex + 1, -1)
      const decodeType = decoder.decoders.get(type)
      if (!decodeType) {
        throw new Error(`Expected decoder to be registered for ${type} type while trying trying to decode ${key} property.`)
      }

      // Null is always decoded as null.
      currentValue = currentValue !== null ? decodeType(currentValue, decoder) : null

      currentKey = currentKey.slice(0, currentIndex)
      if (currentKey[currentIndex - 1] !== '$') {
        break
      }
      currentIndex = currentKey.lastIndexOf('^')
      if (currentIndex === -1) {
        break
      }
    }
    return [ currentKey, currentValue ]
  }

const replaceProperty =
  (mutableInput: object, oldKey: string, newKey: string, value: unknown) => {

    // Sanity check.
    if (newKey in mutableInput) {
      throw new Error(`Expected decoded property ${newKey} not to exist on object when trying to decode property ${oldKey}.`)
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete mutableInput[oldKey]

    mutableInput[newKey] = value
  }

export const decode =
  (mutableInput: unknown, decoder: Decoder.t): t => {
    let count = 0
    let key: null | string = null
    let value: unknown = null
    for (const inputKey in mutableInput as object) {
      count++

      const lastChar = inputKey[inputKey.length - 1]

      // Normal key.
      if (lastChar !== '$') {

        // Legacy Json suffix.
        if (decoder.legacyDecoder && lastChar === 'n' && inputKey.endsWith('Json')) {

          // Map legacy key and index to new format.
          const fakeKey = inputKey.slice(0, -4) + '^Json$'
          const fakeIndex = inputKey.length - 4

          // Replacement.
          ;[ key, value ] = decodeProperty(decoder, fakeKey, fakeIndex, (mutableInput as object)[inputKey])
          replaceProperty(mutableInput as object, inputKey, key, value)

          continue
        }

        key = inputKey
        ;(mutableInput as object)[key] = Decoder.decode((mutableInput as object)[inputKey], decoder)
        continue
      }

      // Also normal key.
      const index = inputKey.lastIndexOf('^')
      if (index === -1) {
        key = inputKey
        ;(mutableInput as object)[key] = Decoder.decode((mutableInput as object)[inputKey], decoder)
        continue
      }

      // Replacement.
      ;[ key, value ] = decodeProperty(decoder, inputKey, index, (mutableInput as object)[inputKey])
      replaceProperty(mutableInput as object, inputKey, key, value)

    }

    // Maybe unnest.
    if (count === 1 && (key === '' || (decoder.legacyDecoder && key === '$'))) {
      return (mutableInput as object)[key]
    }

    return mutableInput
  }
