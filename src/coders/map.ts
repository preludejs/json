import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = Map<unknown, unknown>

export const constructor = Map

export const name = 'Map'

export const encode =
  (value: t, encoder: Encoder.t) =>
    ({ ['^Map$']: Encoder.encode(Object.fromEntries(value), encoder) })

export const decode =
  (value: unknown, decoder: Decoder.t): t => {
    if (typeof value !== 'object') {
      throw new Error(`Expected object, got ${typeof value}.`)
    }
    return new Map(Object.entries(Decoder.decode(value, decoder) as object))
  }
