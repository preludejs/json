import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<bigint> =
  value =>
    ({ '^bigint$': value.toString() })

export const decode: Decoder.Decode<bigint> =
  value => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return BigInt(value)
  }
