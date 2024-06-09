export type Decode<T = unknown> =
  (value: unknown, decoder: t) =>
    null | T

export type t = {
  legacyDecoder: boolean
  decoders: Map<string, Decode>
}

const unwind =
  (decoder: t, key: string, index: number, value: unknown): [string, unknown] => {
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

function object(input: object, decoder: t) {
  let count = 0
  let key: null | string = null
  let value: unknown = null
  for (const inputKey in input) {
    count++

    const lastChar = inputKey[inputKey.length - 1]

    // Normal key.
    if (lastChar !== '$') {

      // Legacy Json suffix.
      if (lastChar === 'n' && inputKey.endsWith('Json')) {
      }

      key = inputKey
      input[key] = decode(input[inputKey], decoder)
      continue
    }

    // Also normal key.
    const index = inputKey.lastIndexOf('^')
    if (index === -1) {
      key = inputKey
      input[key] = decode(input[inputKey], decoder)
      continue
    }

    // Replacement.
    [ key, value ] = unwind(decoder, inputKey, index, input[inputKey])
    if (key in input) {
      throw new Error(`Expected output key ${key} not to exist on input when decoding input key ${inputKey}.`)
    }
    delete input[inputKey]
    input[key] = value

  }

  // Maybe unnest.
  if (count === 1 && (key === '' || (decoder.legacyDecoder && key === '$'))) {
    return input[key]
  }

  return input
}

function array(mutable: unknown[], decoder: t) {
  for (let i = 0; i < mutable.length; i++) {
    mutable[i] = decode(mutable[i], decoder)
  }
  return mutable
}

export function decode(mutable: unknown, decoder: t) {
  if (mutable === null) {
    return mutable
  }
  if (typeof mutable !== 'object') {
    return mutable
  }
  if (Array.isArray(mutable)) {
    return array(mutable, decoder)
  }
  return object(mutable, decoder)
}

export const parse =
  (value: string, decoder: t) =>
    decode(JSON.parse(value), decoder)
