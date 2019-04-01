/* External Imports */
import BigNum = require('bn.js')

export const bufToHexString = (buf: Buffer): string => {
  return '0x' + buf.toString('hex')
}

export const bnToHexString = (bn: BigNum): string => {
  return '0x' + bn.toString('hex')
}

export const hexStringify = (value: BigNum | Buffer): string => {
  if (value instanceof BigNum) {
    return bnToHexString(value)
  } else {
    return bufToHexString(value)
  }
}

export const hexStringToBuf = (hexString: string): Buffer => {
  return Buffer.from(hexString.slice(2), 'hex')
}
