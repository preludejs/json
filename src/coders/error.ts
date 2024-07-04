import * as $ from '@prelude/refute'
import * as Encoder from '../encoder.js'

export type t = Error

export const constructor = Error

export const name = 'Error'

export const encode =
  (value: t, encoder: Encoder.t) => {
    const { name: name_, message, cause, stack } = value
    if (value instanceof AggregateError) {
      const { errors } = value
      return {
        ['^Error$']: {
          name: name_,
          message,
          errors: errors.map(error => Encoder.encode(error, encoder)),
          cause,
          stack
        }
      }
    }
    return {
      ['^Error$']: {
        name: name_,
        message,
        cause,
        stack
      }
    }
  }

export const decode =
  (value: unknown): t => {
    const refute = $.object({
      name: $.string,
      message: $.string,
      cause: $.unknown,
      errors: $.undefinedOr($.array($.unknown)),
      stack: $.undefinedOr($.string)
    })(value)
    if ($.failed(refute)) {
      throw new Error($.reasonWithoutReceived(refute))
    }
    const { name: name_, message, cause, errors, stack } = refute.value
    switch (name_) {
      case 'AggregateError':
        return Object.assign(new AggregateError(errors ?? [], message, { cause }), { stack })
      case 'EvalError':
        return Object.assign(new EvalError(message, { cause }), { stack })
      case 'RangeError':
        return Object.assign(new RangeError(message, { cause }), { stack })
      case 'ReferenceError':
        return Object.assign(new ReferenceError(message, { cause }), { stack })
      case 'SyntaxError':
        return Object.assign(new SyntaxError(message, { cause }), { stack })
      case 'TypeError':
        return Object.assign(new TypeError(message, { cause }), { stack })
      case 'URIError':
        return Object.assign(new URIError(message, { cause }), { stack })
      default:
        return Object.assign(
          new Error(message, { cause }),
          { name: name_, errors, stack }
        )
    }
  }
