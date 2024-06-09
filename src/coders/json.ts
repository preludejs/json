import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const encode: Encoder.Encode =
  (value, encoder) =>
    ({ ['^Json$']: JSON.stringify(Encoder.encode(value, encoder)) })

export const decode: Decoder.Decode =
  (value, decoder) => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return Decoder.decode(JSON.parse(value), decoder)
  }
