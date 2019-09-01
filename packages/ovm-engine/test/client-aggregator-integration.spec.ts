import './setup'

/* External Imports */
import { SimpleClient, BaseDB } from '@pigi/core'
import MemDown from 'memdown'
import * as assert from 'assert'

/* Internal Imports */
import {
  UnipigWallet,
  Address,
  UNISWAP_ADDRESS,
  MockAggregator,
  UNI_TOKEN_TYPE,
} from '../src'

/***********
 * HELPERS *
 ***********/

const genesisState = {
  [UNISWAP_ADDRESS]: {
    balances: {
      uni: 50,
      pigi: 50,
    },
  },
  alice: {
    balances: {
      uni: 50,
      pigi: 50,
    },
  },
}

/*********
 * TESTS *
 *********/

describe('Mock Client/Aggregator Integration', async () => {
  let db
  let accountAddress
  let aggregator
  let unipigWallet

  beforeEach(async () => {
    // Typings for MemDown are wrong so we need to cast to `any`.
    db = new BaseDB(new MemDown('') as any)
    unipigWallet = new UnipigWallet(db)
    // Now create a wallet account
    accountAddress = unipigWallet.createAccount('')
    // Initialize a mock aggregator
    aggregator = new MockAggregator(
      JSON.parse(JSON.stringify(genesisState)),
      'localhost',
      3000
    )
    await aggregator.listen()
    // Connect to the mock aggregator
    unipigWallet.rollup.connect(new SimpleClient('http://127.0.0.1:3000'))
  })

  afterEach(async () => {
    // Close the server
    await aggregator.close()
  })

  describe('UnipigWallet', async () => {
    it('should be able to query the aggregators balances', async () => {
      const response = await unipigWallet.getBalances('alice')
      response.should.deep.equal({ uni: 50, pigi: 50 })
    }).timeout(8000)

    it('should return an error if the wallet tries to transfer money it doesnt have', async () => {
      try {
        const response = await unipigWallet.rollup.sendTransaction(
          {
            tokenType: UNI_TOKEN_TYPE,
            recipient: 'testing123',
            amount: 10,
          },
          accountAddress
        )
      } catch (err) {
        // Success!
      }
    }).timeout(8000)

    it('should successfully transfer if alice sends money', async () => {
      // Set "sign" to instead sign for alice
      unipigWallet.rollup.sign = (not: string, used: string): string => 'alice'
      const response = await unipigWallet.rollup.sendTransaction(
        {
          tokenType: UNI_TOKEN_TYPE,
          recipient: 'testing123',
          amount: 10,
        },
        accountAddress
      )
      response.recipient.balances.uni.should.equal(10)
    }).timeout(8000)
  })
})
