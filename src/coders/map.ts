import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<Map<unknown, unknown>, 'Map'> =
  (value, encoder) =>
    ({ ['^Map$']: Encoder.encode(Object.fromEntries(value), encoder) })

export const decode: Decoder.Decode<Map<unknown, unknown>> =
  (value, decoder) => {
    if (value === null) {
      return null
    }
    if (typeof value !== 'object') {
      throw new Error(`Expected object, got ${typeof value}.`)
    }
    return new Map(Object.entries(Decoder.decode(value, decoder) as object))
  }
