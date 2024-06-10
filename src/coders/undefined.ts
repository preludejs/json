import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<undefined, 'Undefined'> =
  () =>
    ({ '^Undefined$': true })

export const decode: Decoder.Decode<undefined> =
  value => {
    if (value !== true) {
      throw new Error(`Expected true, got ${typeof value}.`)
    }
    return undefined
  }
