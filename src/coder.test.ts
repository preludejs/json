import * as Json from './index.js'

const t =
  (value: unknown) =>
    expect(Json.parse(Json.stringify(value))).toEqual(value)

test('basic', () => {
  t(1)
  t('foo')
  t(true)
  t(false)
  t(null)
  t([])
  t({})
  t([ 1, 'foo', true, false, null, [], {} ])
})

test('non json serializable', () => {
  t(new Date())
  t(new Error('foo'))
  t(/foo/)
  t(new Set([ 1, 2, 3 ]))
  t(new Map([ [ 'foo', 'bar' ], [ 'baz', 'qux' ] ]))
  t(new Set([ new Map([ [ 'foo', 'bar' ], [ 'baz', 'qux' ] ]) ]))
  t(new Map([ [ 'foo', new Set([ 1, 2, 3 ]) ] ]))
  t(new Uint8Array([ 1, 2, 3 ]))
})
