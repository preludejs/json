import * as Encoder from './encoder.js'
import * as Decoder from './decoder.js'

export {
  Encoder,
  Decoder
}

export type t =
  Encoder.t & Decoder.t

export const encode =
  Encoder.encode

export const decode =
  Decoder.decode

export const stringify =
  Encoder.stringify

export const parse =
  Decoder.parse
