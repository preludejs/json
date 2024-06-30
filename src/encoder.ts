import * as Constructor from './constructor.js'

export type t = {
  encoders: Map<{ name: string }, (value: unknown, encoder: t) => unknown>
  stringify: (value: unknown, replacer?: (this: unknown, key: string, value_: unknown) => unknown, space?: number | string) => string
}

export type Encode<T = unknown> =
  (value: T, encoder: t) =>
    unknown

export function encode(value: unknown, encoder: t) {
  const constructor = Constructor.of(value)
  const encodeValue = encoder.encoders.get(constructor)
  return encodeValue ?
    encodeValue(value, encoder) :
    value
}

export const stringify =
  (value: unknown, encoder: t) =>
    JSON.stringify(encode(value, encoder))
