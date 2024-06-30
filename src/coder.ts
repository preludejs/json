import * as Encoder from './encoder.js'
import * as Decoder from './decoder.js'

export * as Encoder from './encoder.js'
export * as Decoder from './decoder.js'

export { encode, stringify } from './encoder.js'
export { decode, parse } from './decoder.js'

export type t =
  Encoder.t & Decoder.t

export const of =
  (coder?: Partial<t>): t => {
    const result: t = {
      legacyDecoder: coder?.legacyDecoder ?? false,
      encoders: new Map(coder?.encoders ?? []),
      decoders: new Map(coder?.decoders ?? []),
      parse: (value: string, reviver?: (this: unknown, key: string, value_: unknown) => unknown) =>
        Decoder.decode(JSON.parse(value, reviver), result),
      stringify: (value: unknown, replacer?: (this: unknown, key: string, value_: unknown) => unknown, space?: number | string) =>
        JSON.stringify(Encoder.encode(value, result), replacer, space)
    }
    return result
  }

export const register =
  <T>(
    coder: t,
    coding: {
      name: string,
      constructor: undefined | { name: string },
      encode: Encoder.Encode<T>,
      decode: Decoder.Decode<T>
    },
    { name = coding.name }: { name?: string } = {}
  ) => {
    coder.decoders.set(name, coding.decode)
    if (coding.constructor != null) {
      coder.encoders.set(coding.constructor, coding.encode as Encoder.Encode)
    }
  }

export const unregister =
  (coder: t, constructor: { name: string }, { name = constructor.name } = {}) => {
    coder.decoders.delete(name)
    coder.encoders.delete(constructor)
  }
