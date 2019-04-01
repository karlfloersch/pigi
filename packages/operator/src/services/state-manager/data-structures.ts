/* External Imports */
import { AbiCoder } from 'web3-eth-abi'
import BigNum = require('bn.js')

/* Internal Imports */
import { bufToHexString, hexStringToBuf, bnToHexString, hexStringify } from '../../utils'

const abiCoder = new AbiCoder()

export class StateObject {
  constructor(
    public readonly predicate: Buffer,
    public readonly parameters: Buffer
  ) {}
}

export class Signature {
  constructor(
    public readonly v: Buffer,
    public readonly r: Buffer,
    public readonly s: Buffer,
  ) {}
}

export class StateUpdate {
  public static readonly types = ['address', 'bytes', 'bytes16', 'bytes16', 'bytes4', 'bytes1', 'bytes32', 'bytes32']

  constructor(
    public readonly stateObject: StateObject,
    public readonly start: BigNum,
    public readonly end: BigNum,
    public readonly plasmaBlockNumber: BigNum,
    public readonly confirmationSignature: Signature,
  ) {}

  public encoded() {
    const params = [
        this.stateObject.predicate,
        this.stateObject.parameters,
        this.start.toBuffer('be', 16),
        this.end.toBuffer('be', 16),
        this.plasmaBlockNumber.toBuffer('be', 4),
        this.confirmationSignature.v,
        this.confirmationSignature.r,
        this.confirmationSignature.s,
    ]
    const hexStringParams = params.map((val) => bufToHexString(val))
    return abiCoder.encodeParameters(StateUpdate.types, hexStringParams)
  }
}

export const decodeStateUpdate = (bytes: Buffer) => {
  const result = abiCoder.decodeParameters(StateUpdate.types, bufToHexString(bytes))
  // Convert from hex string to buffer
  for (const index of Object.keys(result)) {
    result[index] = hexStringToBuf(result[index])
  }
  const stateObject = new StateObject(result['0'], result['1'])
  const signature = new Signature(result['5'], result['6'], result['7'])
  const stateUpdate = new StateUpdate(
    stateObject,
    result['2'],
    result['3'],
    result['4'],
    signature
  )
  return stateUpdate
}
