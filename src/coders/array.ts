import * as Encoder from '../encoder.js'
import * as Decoder from '../decoder.js'

export const encode: Encoder.Encode<unknown[], 'array'> =
  (input, encoder) => {
    let output: unknown[] = input
    for (let i = 0; i < input.length; i++) {
      const value = Encoder.encode(input[i], encoder)
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

export const decode: Decoder.Decode<unknown[]> =
  (mutable, decoder) => {
    for (let i = 0; i < (mutable as unknown[]).length; i++) {
      (mutable as unknown[])[i] = Decoder.decode((mutable as unknown[])[i], decoder)
    }
    return mutable as unknown[]
  }
