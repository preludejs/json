import * as $ from '@prelude/refute'
import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

const refute =
  $.exact({
    source: $.string,
    flags: $.string
  })

export const encode: Encoder.Encode<RegExp> =
  ({ source, flags }: RegExp) =>
    ({ '^RegExp$': { source, flags } })

export const decode: Decoder.Decode<RegExp> =
  value => {
    const refuted = refute(value)
    if ($.failed(refuted)) {
      throw new Error($.reasonWithoutReceived(refuted))
    }
    const { source, flags } = refuted.value
    return new RegExp(source, flags)
  }
