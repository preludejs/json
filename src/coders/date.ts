export type t = Date
export const constructor = Date
export const name = 'Date'

export const encode =
  (value: t) =>
    ({ '^Date$': value.toISOString() })

export const decode =
  (value: unknown): t => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return new Date(value)
  }
