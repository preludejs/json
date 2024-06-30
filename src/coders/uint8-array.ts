import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = Uint8Array

export const constructor = Uint8Array

export const name = 'Uint8Array'

export const encode =
  (value: Uint8Array, _encoder: Encoder.t) =>
    ({ '^Uint8Array$': btoa(String.fromCharCode(...value)) })

export const decode =
  (value: unknown, _decoder: Decoder.t): t => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    const decoded = atob(value)
    const array = new Uint8Array(decoded.length)
    for (let i = 0; i < decoded.length; i++) {
      array[i] = decoded.charCodeAt(i)
    }
    return array
  }
