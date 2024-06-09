import * as Json from './index.js'

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
  expect(Json.stringify(NaN)).toBe('{"^number$":"NaN"}')
  expect(Json.stringify(Infinity)).toBe('{"^number$":"Infinity"}')
  expect(Json.stringify(-Infinity)).toBe('{"^number$":"-Infinity"}')
  expect(Json.stringify(-0)).toBe('{"^number$":"-0"}')
})

test('nested', () => {
  expect(Json.stringify(new Map([ [ 'foo', new Set([ 1, 2, 3 ]) ] ]))).toBe('{"^Map$":{"foo":{"^Set$":[1,2,3]}}}')
})
