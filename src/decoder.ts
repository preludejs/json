import { decode as decodeArray } from './coders/array.js'
import { decode as decodeObject } from './coders/object.js'

export type Decode<T = unknown> =
  // eslint-disable-next-line no-use-before-define
  (value: unknown, decoder: t) =>
    null | T

export type t = {
  legacyDecoder: boolean
  decoders: Map<string, Decode>
}

export function decode(mutable: unknown, decoder: t) {
  if (typeof mutable !== 'object') {
    return mutable
  }
  if (mutable === null) {
    return mutable
  }
  const prototype = Object.getPrototypeOf(mutable) ?? Object.prototype
  if (prototype.constructor === Array) {
    return decodeArray(mutable, decoder)
  }
  return decodeObject(mutable, decoder)
}

export const parse =
  (value: string, decoder: t) =>
    decode(JSON.parse(value), decoder)
