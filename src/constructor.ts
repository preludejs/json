export const Null = {
  name: 'Null'
} as const

export const Undefined = {
  name: 'Undefined'
} as const

export const NullPrototype = {
  name: 'NullPrototype'
} as const

export const NullishConstructor = {
  name: 'NullishConstructor'
} as const

export const of =
  (value: unknown) => {
    if (value === null) {
      return Null
    }
    if (value === undefined) {
      return Undefined
    }
    const prototype = Object.getPrototypeOf(value)
    if (prototype == null) {
      return NullPrototype
    }
    return prototype.constructor ?? NullishConstructor
  }
