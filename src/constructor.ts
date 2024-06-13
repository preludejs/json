export const Null =
  () =>
    null

export const Undefined =
  () =>
    undefined

export const of =
  (value: unknown) => {
    if (value === null) {
      return Null
    }
    if (value === undefined) {
      return Undefined
    }
    return Object.getPrototypeOf(value).constructor
  }
