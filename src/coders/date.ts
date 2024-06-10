import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<Date, 'Date'> =
  value =>
    ({ '^Date$': value.toISOString() })

export const decode: Decoder.Decode<Date> =
  value => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return new Date(value)
  }
