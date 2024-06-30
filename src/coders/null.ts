import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'
import * as Constructor from '../constructor.js'

export type t = null

export const constructor = Constructor.Null

export const name = 'Null'

export const encode =
  (_value: null, _encoder: Encoder.t) =>
    ({ '^Null$': true })

export const decode =
  (value: unknown, _decoder: Decoder.t): t => {
    if (value !== true) {
      throw new Error(`Expected true, got ${typeof value}.`)
    }
    return null
  }
