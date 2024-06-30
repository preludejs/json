import type * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export type t = number

export const constructor = Number

export const name = 'Number'

const known = [
  'Infinity',
  '-Infinity',
  'NaN',
  '-0'
]

export const encode =
  (value: number, _encoder: Encoder.t) => {
    if (Number.isNaN(value)) {
      return { ['^Number$']: 'NaN' }
    }
    if (value === Infinity) {
      return { ['^Number$']: 'Infinity' }
    }
    if (value === -Infinity) {
      return { ['^Number$']: '-Infinity' }
    }
    if (Object.is(value, -0)) {
      return { ['^Number$']: '-0' }
    }
    return value
  }

export const decode =
  (value: unknown, _decoder: Decoder.t): t => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    if (!known.includes(value)) {
      throw new Error(`Expected Infinity, -Infinity, Nan or -0 value, got ${value}.`)
    }
    return Number(value)
  }
