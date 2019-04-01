import { should } from '../../../setup'

/* External Imports */
import BigNum = require('bn.js')

/* Internal Imports */
import { StateObject, StateUpdate, Signature, decodeStateUpdate } from '../../../../src/services/state-manager/data-structures'
import { bufToHexString, hexStringToBuf } from '../../../../src/utils'

describe('StateUpdate', () => {
  const testAddr = '0x5D1d54ced0377dfDf696EC7bFf72f4c5009c0b59'
  const zero32Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const fakeSignature = new Signature(
    Buffer.from([1]),
    Buffer.from(hexStringToBuf(zero32Bytes)),
    Buffer.from(hexStringToBuf(zero32Bytes)),
  )

  it('should be able to encode', async () => {
    const stateObject = new StateObject(hexStringToBuf(testAddr), Buffer.from('baddeadbeefbaddeadbeef', 'hex'))
    const stateUpdate = new StateUpdate(
      stateObject,
      new BigNum(0),
      new BigNum(10),
      new BigNum(1),
      fakeSignature
    )
    console.log(stateUpdate.encoded())
    const decodedStateUpdate = decodeStateUpdate(hexStringToBuf(stateUpdate.encoded()))
    console.log(decodedStateUpdate)
  })
})
