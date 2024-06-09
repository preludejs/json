export type Encode<T = unknown, U = never> =
  (value: T, encoder: t) =>
    | Record<`^${string}$`, unknown>
    | U

export type t = {
  typeofEncoders: Record<string, undefined | Encode<any, any>>,
  constructorEncoders: Map<Function, Encode<any>>
}

function array(input: unknown[], encoder: t) {
  let output: unknown[] = input
  for (let i = 0; i < input.length; i++) {
    const value = encode(input[i], encoder)
    if (input[i] === value) {
      continue
    }
    if (output === input) {
      output = input.slice()
    }
    output[i] = value
  }
  return output
}

function object(input: object, encoder: t) {
  let output: object = input
  for (const key in input) {
    const value = encode(input[key], encoder)
    if (input[key] === value) {
      continue
    }
    if (output === input) {
      output = { ...input }
    }
    output[key] = value
  }
  return output
}

export function encode(value: unknown, encoder: t) {
  if (value === null) {
    return value
  }
  if (typeof value !== 'object') {
    return encoder.typeofEncoders[typeof value]?.(value, encoder) ?? value
  }
  if (value.constructor === Object) {
    return object(value, encoder)
  }
  if (value.constructor === Array) {
    return array(value, encoder)
  }
  const constructorEncoder = encoder.constructorEncoders.get(value.constructor)
  return constructorEncoder ?
    constructorEncoder(value, encoder) :
    value
}

export const stringify =
  (value: unknown, encoder: t) =>
    JSON.stringify(encode(value, encoder))
