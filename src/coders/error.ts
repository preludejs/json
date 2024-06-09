import * as $ from '@prelude/refute'
import * as Encoder from '../encoder.js'
import type * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<Error> =
  (value, encoder) => {
    const { name, message, cause } = value
    if (value instanceof AggregateError) {
      const { errors } = value
      return {
        ['^Error$']: {
          name,
          message,
          errors: errors.map(error => Encoder.encode(error, encoder)),
          cause
        }
      }
    }
    return {
      ['^Error$']: {
        name,
        message,
        cause
      }
    }
  }

export const decode: Decoder.Decode<Error> =
  value => {
    const refute = $.object({
      name: $.string,
      message: $.string,
      cause: $.unknown,
      errors: $.undefinedOr($.array($.unknown))
    })(value)
    if ($.failed(refute)) {
      throw new Error($.reasonWithoutReceived(refute))
    }
    const { name, message, cause, errors } = refute.value
    switch (name) {
      case 'AggregateError':
        return new AggregateError(errors ?? [], message, { cause })
      case 'EvalError':
        return new EvalError(message, { cause })
      case 'RangeError':
        return new RangeError(message, { cause })
      case 'ReferenceError':
        return new ReferenceError(message, { cause })
      case 'SyntaxError':
        return new SyntaxError(message, { cause })
      case 'TypeError':
        return new TypeError(message, { cause })
      case 'URIError':
        return new URIError(message, { cause })
      default:
        return Object.assign(
          new Error(message, { cause }),
          { name, errors }
        )
    }
  }
