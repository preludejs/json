import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<null, 'Null'> =
  () =>
    ({ '^Null$': true })

export const decode: Decoder.Decode<null> =
  value => {
    if (value !== true) {
      throw new Error(`Expected true, got ${typeof value}.`)
    }
    return null
  }
