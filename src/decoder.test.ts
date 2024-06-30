import * as Json from './index.js'

describe('custom coder with Undefined, Number and legacy decoder', () => {

  const custom = Json.of({
    ...Json.global,
    legacyDecoder: true
  })
  Json.register(custom, Json.Codecs.Undefined)
  Json.register(custom, Json.Codecs.Number)

  test('^Undefined$', () => {

    expect(custom.parse(JSON.stringify({
      '^Undefined$': true
    }))).toBeUndefined()

    expect(custom.parse(JSON.stringify({
      'foo^Undefined$': true
    }))).toEqual({
      foo: undefined
    })

  })

  test('Number', () => {

    expect(custom.parse(JSON.stringify({
      '^Number$': 'NaN'
    }))).toBeNaN()

    expect(custom.parse(JSON.stringify({
      'foo^Number$': 'NaN'
    }))).toEqual({
      foo: NaN
    })

    expect(custom.parse(JSON.stringify({
      '^Number$': 'Infinity'
    }))).toBe(Infinity)

    expect(custom.parse(JSON.stringify({
      'foo^Number$': 'Infinity'
    }))).toEqual({
      foo: Infinity
    })

    expect(custom.parse(JSON.stringify({
      '^Number$': '-Infinity'
    }))).toBe(-Infinity)

    expect(custom.parse(JSON.stringify({
      'foo^Number$': '-Infinity'
    }))).toEqual({
      foo: -Infinity
    })

    expect(custom.parse(JSON.stringify({
      '^Number$': '-0'
    }))).toBe(-0)

    expect(custom.parse(JSON.stringify({
      'foo^Number$': '-0'
    }))).toEqual({
      foo: -0
    })

  })

  test('Json (legacy)', () => {
    expect(custom.parse(JSON.stringify({
      'Json': JSON.stringify({ bar: 'baz' })
    }))).toEqual({
      bar: 'baz'
    })
    expect(custom.parse(JSON.stringify({
      'fooJson': JSON.stringify({ bar: 'baz' })
    }))).toEqual({
      foo: { bar: 'baz' }
    })
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
