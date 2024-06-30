import * as Codecs from './coders.js'
import * as Coder from './coder.js'

export const global = Coder.of()
Coder.register(global, Codecs.Array)
Coder.register<bigint>(global, Codecs.BigInt)
Coder.register(global, Codecs.Date)
Coder.register(global, Codecs.Error)
Coder.register(global, Codecs.Map)
Coder.register(global, Codecs.RegExp)
Coder.register(global, Codecs.Set)
Coder.register(global, Codecs.Uint8Array)

// Other
global.encoders.set(Object, Codecs.Object.encode)
global.decoders.set('Json', Codecs.Json.decode)

export const parse =
  (value: string, reviver?: (this: unknown, key: string, value_: unknown) => unknown) =>
    Coder.decode(JSON.parse(value, reviver), global)

export const stringify =
  (value: unknown, replacer?: (this: unknown, key: string, value_: unknown) => unknown, space?: number | string) =>
    JSON.stringify(Coder.encode(value, global), replacer, space)
