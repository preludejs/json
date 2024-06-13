import * as Constructor from './constructor.js'

export type Encode<T, U extends string> =

  // eslint-disable-next-line no-use-before-define
  (value: T, encoder: t) =>
    | Record<`^${U}$`, unknown>
    | T
    | unknown

export type t = {

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  encoders: WeakMap<Function, Encode<any, string>>

}

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
