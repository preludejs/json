import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = Set<unknown>

export const constructor = Set

export const name = 'Set'

export const encode =
  (value: t, encoder: Encoder.t) =>
    ({ ['^Set$']: Encoder.encode(Array.from(value), encoder) })

export const decode =
  (value: unknown, decoder: Decoder.t): t => {
    if (!Array.isArray(value)) {
      throw new Error('Expected array.')
    }
    return new Set(Decoder.decode(value, decoder) as unknown[])
  }
