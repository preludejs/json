import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'
import * as Constructor from '../constructor.js'

export type t = undefined

export const constructor = Constructor.Undefined

export const name = 'Undefined'

export const encode =
  (_value: t, _encoder: Encoder.t) =>
    ({ '^Undefined$': true })

export const decode =
  (value: unknown, _decoder: Decoder.t): t => {
    if (value !== true) {
      throw new Error(`Expected true, got ${typeof value}.`)
    }
    return undefined
  }
