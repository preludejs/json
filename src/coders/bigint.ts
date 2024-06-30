export type t = bigint
export const constructor = BigInt
export const name = 'BigInt'

export const encode =
  (value: t) =>
    ({ '^bigint$': value.toString() })

export const decode =
  (value: unknown): t => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    return BigInt(value)
  }
