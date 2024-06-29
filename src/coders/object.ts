import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<object, 'object'> =
  (input, encoder) => {
    let output: object = input
    for (const key in input) {
      const value = Encoder.encode(input[key], encoder)
      if (input[key] === value) {
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
    let k = key
    let v = value
    let i = index
    while (true) {
      const type = k.slice(i + 1, -1)
      const d = decoder.decoders.get(type)
      if (!d) {
        throw new Error(`Expected decoder to be registered for type ${type} to decode property ${key}.`)
      }
      const v2 = v !== null ? d(v, decoder) : null
      const k2 = k.slice(0, i)
      k = k2
      v = v2
      if (k[i - 1] !== '$') {
        break
      }
      i = k.lastIndexOf('^')
      if (i === -1) {
        break
      }
    }
    return [ k, v ]
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

export const decode: Decoder.Decode<object> =
  (mutableInput, decoder) => {
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
