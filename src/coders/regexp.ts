import * as $ from '@prelude/refute'
import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export type t = RegExp

export const constructor = RegExp

export const name = 'RegExp'

const refute =
  $.exact({
    source: $.string,
    flags: $.string
  })

export const encode =
  ({ source, flags }: RegExp, _encoder: Encoder.t) =>
    ({ '^RegExp$': { source, flags } })

export const decode =
  (value: unknown, _decoder: Decoder.t): t => {
    const refuted = refute(value)
    if ($.failed(refuted)) {
      throw new Error($.reasonWithoutReceived(refuted))
    }
    const { source, flags } = refuted.value
    return new RegExp(source, flags)
  }
