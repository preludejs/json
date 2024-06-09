import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const decode: Decoder.Decode<Set<unknown>> =
  (value, decoder) => {
    if (!Array.isArray(value)) {
      throw new Error('Expected array.')
    }
    return new Set(Decoder.decode(value, decoder))
  }

export const encode: Encoder.Encode<Set<unknown>> =
  (value, encoder) =>
    ({ ['^Set$']: Encoder.encode(Array.from(value), encoder) })
