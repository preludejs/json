import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = unknown

export const constructor = undefined

export const name = 'Json'

export const encode =
  (value: unknown, encoder: Encoder.t) =>
    ({ ['^Json$']: JSON.stringify(Encoder.encode(value, encoder)) })

export const decode =
  (value: unknown, decoder: Decoder.t) => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return Decoder.decode(JSON.parse(value), decoder)
  }
