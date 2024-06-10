export type Encode<T, U extends string> =

  // eslint-disable-next-line no-use-before-define
  (value: T, encoder: t) =>
    | Record<`^${U}$`, unknown>
    | T
    | unknown

export type t = {

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  encoders: Map<Function, Encode<any, string>>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefinedEncoder?: Encode<any, string>

}

export function encode(value: unknown, encoder: t) {
  if (value === undefined) {
    if (encoder.undefinedEncoder != null) {
      return encoder.undefinedEncoder(value, encoder)
    }
    return undefined
  }
  if (value === null) {
    return value
  }
  const encodeValue = encoder.encoders.get(value.constructor)
  return encodeValue ?
    encodeValue(value, encoder) :
    value
}

export const stringify =
  (value: unknown, encoder: t) =>
    JSON.stringify(encode(value, encoder))
