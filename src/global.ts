import * as Coder from './coder.js'
import * as Codecs from './coders.js'

export const global: Coder.t = {
  legacyDecoder: true,
  decoders: new Map(),
  typeofEncoders: {},
  constructorEncoders: new Map()
}

global.decoders.set('bigint', Codecs.bigint.decode)
global.decoders.set('Date', Codecs.Date.decode)
global.decoders.set('Error', Codecs.Error.decode)
global.decoders.set('Json', Codecs.Json.decode)
global.decoders.set('Map', Codecs.Map.decode)
global.decoders.set('number', Codecs.number.decode)
global.decoders.set('RegExp', Codecs.RegExp.decode)
global.decoders.set('Set', Codecs.Set.decode)
global.decoders.set('Uint8Array', Codecs.Uint8Array.decode)

global.typeofEncoders.bigint = Codecs.bigint.encode
global.typeofEncoders.number = Codecs.number.encode

global.constructorEncoders.set(Date, Codecs.Date.encode)
global.constructorEncoders.set(Error, Codecs.Error.encode)
global.constructorEncoders.set(Map, Codecs.Map.encode)
global.constructorEncoders.set(RegExp, Codecs.RegExp.encode)
global.constructorEncoders.set(Set, Codecs.Set.encode)
global.constructorEncoders.set(Uint8Array, Codecs.Uint8Array.encode)

export const parse =
  (value: string, reviver?: (this: any, key: string, value: any) => any) =>
    Coder.decode(JSON.parse(value, reviver), global)

export const stringify =
  (value: unknown, replacer?: (this: any, key: string, value: any) => any, space?: number | string) =>
    JSON.stringify(Coder.encode(value, global), replacer, space)
