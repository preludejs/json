import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<Uint8Array, 'Uint8Array'> =
  value =>
    ({ '^Uint8Array$': btoa(String.fromCharCode(...value)) })

export const decode: Decoder.Decode<Uint8Array> =
  value => {
    if (typeof value !== 'string') {
      throw new Error(`Expected string, got ${typeof value}.`)
    }
    const decoded = atob(value)
    const array = new Uint8Array(decoded.length)
    for (let i = 0; i < decoded.length; i++) {
      array[i] = decoded.charCodeAt(i)
    }
    return array
  }
