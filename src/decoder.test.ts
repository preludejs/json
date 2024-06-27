import * as Json from './index.js'

test('^Undefined$', () => {

  expect(Json.parse(JSON.stringify({
    '^Undefined$': true
  }))).toBeUndefined()

  expect(Json.parse(JSON.stringify({
    'foo^Undefined$': true
  }))).toEqual({
    foo: undefined
  })

})

test('^Json$', () => {

  expect(Json.parse(JSON.stringify({
    '^Json$': JSON.stringify({ bar: 'baz' })
  }))).toEqual({
    bar: 'baz'
  })

  expect(Json.parse(JSON.stringify({
    'foo^Json$': JSON.stringify({ bar: 'baz' })
  }))).toEqual({
    foo: { bar: 'baz' }
  })

})

test('Json (legacy)', () => {
  expect(Json.parse(JSON.stringify({
    'Json': JSON.stringify({ bar: 'baz' })
  }))).toEqual({
    bar: 'baz'
  })
  expect(Json.parse(JSON.stringify({
    'fooJson': JSON.stringify({ bar: 'baz' })
  }))).toEqual({
    foo: { bar: 'baz' }
  })
})

test('^RegExp$', () => {

  expect(Json.parse(JSON.stringify({
    '^RegExp$': { source: 'foo', flags: 'g' }
  }))).toEqual(/foo/g)

  expect(Json.parse(JSON.stringify({
    're^RegExp$': { source: 'foo', flags: 'g' }
  }))).toEqual({
    re: /foo/g
  })

  expect(Json.parse(JSON.stringify([
    { '^RegExp$': { source: 'foo', flags: 'g' } },
    { '^RegExp$': { source: 'bar', flags: 'i' } }
  ]))).toEqual([
    /foo/g,
    /bar/i
  ])

})

test('^Set$', () => {

  expect(Json.parse(JSON.stringify({
    '^Set$': [ 1, 2, 3 ]
  }))).toEqual(new Set([ 1, 2, 3 ]))

  expect(Json.parse(JSON.stringify({
    'set^Set$': [ 1, 2, 3 ]
  }))).toEqual({
    set: new Set([ 1, 2, 3 ])
  })

})

test('^Map$', () => {

  expect(Json.parse(JSON.stringify({
    '^Map$': { foo: 'bar', baz: 'qux' }
  }))).toEqual(new Map([ [ 'foo', 'bar' ], [ 'baz', 'qux' ] ]))

  expect(Json.parse(JSON.stringify({
    'map^Map$': { foo: 'bar', baz: 'qux' }
  }))).toEqual({
    map: new Map([ [ 'foo', 'bar' ], [ 'baz', 'qux' ] ])
  })

})

test('nested', () => {
  expect(Json.parse('{"foo^Set$":[1,2,3]}')).toEqual({ foo: new Set([ 1, 2, 3 ]) })
  expect(Json.parse('{"^Map$":{"foo^Set$":[1,2,3]}}')).toEqual(new Map([ [ 'foo', new Set([ 1, 2, 3 ]) ] ]))
  expect(Json.parse('{"foo":{"^Set$":[1,2,3]}}')).toEqual({ foo: new Set([ 1, 2, 3 ]) })
  expect(Json.parse('{"^Map$":{"foo":{"^Set$":[1,2,3]}}}')).toEqual(new Map([ [ 'foo', new Set([ 1, 2, 3 ]) ] ]))
})
