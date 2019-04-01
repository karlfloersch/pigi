/* External Imports */
import { AbiCoder } from 'web3-eth-abi'
import { BaseDBProvider, EphemDBProvider, LevelDB } from '@pigi/core'
import BigNum = require('bn.js')
import logger = require('debug')
const log = logger('info:state-manager:full-state')

/* Internal Imports */
import { TransactionLog } from './transaction-log'
import { BLOCKNUMBER_BYTE_SIZE } from '../../constants/serialization'

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export class StateService {
  private lock = {}
  public blockNumber = new BigNum(0)
  private abiCoder = new AbiCoder()

  constructor(
    private readonly db: BaseDBProvider,
    private readonly transactionLog: TransactionLog
  ) {}

  public async onStart() {
    // Get the current block number
    try {
      const blockNumberBuff = await this.db.get(Buffer.from('blockNumber'))
      this.blockNumber = new BigNum(blockNumberBuff)
      log('Block number found! Starting at: ' + this.blockNumber)
    } catch (err) {
      if (!err.notFound) {
        throw err
      }
      log('No blockNumber found! Starting from block 1.')
      this.blockNumber = new BigNum(1)
      await this.db.put(
        Buffer.from('blockNumber'),
        this.blockNumber.toBuffer('be', BLOCKNUMBER_BYTE_SIZE)
      )
    }
  }

  public test() {
    return 'This is a test'
  }
}
