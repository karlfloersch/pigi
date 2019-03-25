import { AbiCoder } from 'web3-eth-abi'
import AsyncLock = require('async-lock')
const log = require('debug')('info:state')

export class StateService {
  private lock = new AsyncLock()
  private abiCoder = new AbiCoder()

  constructor(db: , config) {
    log('Initialized State Service')
  }

  test() {
    return 'This is a test'
  }
}
