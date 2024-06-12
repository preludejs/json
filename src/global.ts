import * as Coder from './coder.js'
import * as Codecs from './coders.js'

export const global: Coder.t = {
  legacyDecoder: true,
  decoders: new Map(),
  encoders: new Map()
}

global.decoders.set('BigInt', Codecs.BigInt.decode)
global.decoders.set('Date', Codecs.Date.decode)
global.decoders.set('Error', Codecs.Error.decode)
global.decoders.set('Json', Codecs.Json.decode)
global.decoders.set('Map', Codecs.Map.decode)
global.decoders.set('Number', Codecs.Number.decode)
global.decoders.set('RegExp', Codecs.RegExp.decode)
global.decoders.set('Set', Codecs.Set.decode)
global.decoders.set('Uint8Array', Codecs.Uint8Array.decode)
global.decoders.set('Undefined', Codecs.Undefined.decode)

global.encoders.set(Codecs.Undefined.constructor, Codecs.Undefined.encode)
global.encoders.set(Array, Codecs.Array.encode)
global.encoders.set(BigInt, Codecs.BigInt.encode)
global.encoders.set(Date, Codecs.Date.encode)
global.encoders.set(Error, Codecs.Error.encode)
global.encoders.set(Map, Codecs.Map.encode)
global.encoders.set(Number, Codecs.Number.encode)
global.encoders.set(Object, Codecs.Object.encode)
global.encoders.set(RegExp, Codecs.RegExp.encode)
global.encoders.set(Set, Codecs.Set.encode)
global.encoders.set(Uint8Array, Codecs.Uint8Array.encode)

export const parse =
  (value: string, reviver?: (this: unknown, key: string, value_: unknown) => unknown) =>
    Coder.decode(JSON.parse(value, reviver), global)

export const stringify =
  (value: unknown, replacer?: (this: unknown, key: string, value_: unknown) => unknown, space?: number | string) =>
    JSON.stringify(Coder.encode(value, global), replacer, space)
