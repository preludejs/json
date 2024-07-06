[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=bugs)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=coverage)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=preludejs_json)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=preludejs_json&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=preludejs_json)

---

# Json

Json package aims at providing concise solution to the problem of encoding and decoding non JSON native data types.

For example:

```ts
import * as Json from '@prelude/json'
const encoded = Json.stringify({ xs: new Set([ 3, 5, 7 ]) }) // {"xs":{"^Set$":[3,5,7]}}
const decoded = Json.parse(encoded) // { xs: Set { 3, 5, 7 } }
```

Default coder supports [types supported by structured clone](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) ie. types for which it makes sense to serialize and deserialize.

Custom coders can be created by registering their prototype's constructor function (ie. classes) for encoder and name based decoder.

```ts
import * as Json from '@prelude/json'

class Foo {}

// Clone global config.
const custom = Json.of(Json.global)

// Register custom codec for Foo.
Json.register(custom, {
  constructor: Foo,
  name: 'Foo',
  encode: () => ({ '^Foo$': true }),
  decode: (value: unknown) => {
    if (value !== true) {
      throw new Error('Expected true')
    }
    return new Foo()
  }
})

// Serialize Foo.
const encoded = custom.stringify({ foo: new Foo() }) // {"foo":{"^Foo$":true}}

// Deserialize Foo.
const decoded = custom.parse(encoded) // { foo: Foo {} }
```

Encoding scheme is called _recoder_.

## Recoder coding

JSON types are encoded as is.

Non JSON types are encoded using property name suffix `^Foo$`.

Decoding decodes value and strips suffix.

Objects with single empty property name are promoted up.

```json
{"foo":{"":"bar"}}
```

...becomes:

```json
{"foo":"bar"}
```

Encoded types can be arbitrarily nested, ie:

```json
{"foo":{"^Set$":[{"^Date$":"2024-07-05T07:11:49.811Z"}]}}
```

Above example encodes a set with a single date element and is equivalent to:

```json
{"foo^Set$":[{"^Date$":"2024-07-05T07:11:49.811Z"}]}
```

In general `{"foo":{"^Foo$":{"^Bar$":...}}}` is equivalent to `{"foo^Foo$^Bar$":...}`.

### Nulls

Custom encoding always supports `null` value:

```json
{"^Set$":null}
```

...will always decode to `null`.

# Usage

```bash
pnpm i -E @prelude/json
```

```ts
import * as Json from '@prelude/json'
const encoded = Json.stringify({ xs: new Set([ 3, 5, 7 ]) })) // {"xs":{"^Set$":[3,5,7]}}
const decoded = Json.parse(encoded) // { xs: Set { 3, 5, 7 } }
```

# License

```
MIT License

Copyright 2024 Mirek Rusin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
