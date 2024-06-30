import * as Json from './index.js'

const custom = Json.of({
  ...Json.global,
  legacyDecoder: true
})
Json.register(custom, Json.Codecs.Undefined)
Json.register(custom, Json.Codecs.Number)

test('bigint', () => {
  expect(Json.stringify(1n)).toBe('{"^bigint$":"1"}')
})

test('Date', () => {
  expect(Json.stringify(new Date('2020-01-01T00:00:00.000Z'))).toBe('{"^Date$":"2020-01-01T00:00:00.000Z"}')
})

test('Error', () => {
  expect(Json.stringify(new Error('foo'))).toBe('{"^Error$":{"name":"Error","message":"foo"}}')
})

test('Map', () => {
  expect(Json.stringify(new Map([ [ 'foo', 'bar' ], [ 'baz', 'qux' ] ]))).toBe('{"^Map$":{"foo":"bar","baz":"qux"}}')
})

test('number', () => {
  expect(Json.stringify(4.2)).toBe('4.2')
  expect(custom.stringify(NaN)).toBe('{"^Number$":"NaN"}')
  expect(custom.stringify(Infinity)).toBe('{"^Number$":"Infinity"}')
  expect(custom.stringify(-Infinity)).toBe('{"^Number$":"-Infinity"}')
  expect(custom.stringify(-0)).toBe('{"^Number$":"-0"}')
})

test('nested', () => {
  expect(Json.stringify(new Map([ [ 'foo', new Set([ 1, 2, 3 ]) ] ]))).toBe('{"^Map$":{"foo":{"^Set$":[1,2,3]}}}')
})

test('Undefined', () => {
  expect(custom.stringify(undefined)).toBe('{"^Undefined$":true}')
  expect(custom.stringify({ foo: undefined })).toBe('{"foo":{"^Undefined$":true}}')
  expect(custom.stringify([ null, undefined, NaN ])).toBe('[null,{"^Undefined$":true},{"^Number$":"NaN"}]')
})

test('weirdos', () => {
  expect(custom.stringify([
    undefined,
    null,
    NaN,
    Infinity,
    -Infinity,
    -0,
    0
  ])).toBe('[{"^Undefined$":true},null,{"^Number$":"NaN"},{"^Number$":"Infinity"},{"^Number$":"-Infinity"},{"^Number$":"-0"},0]')
})
