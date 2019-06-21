import { dbRootPath } from '../setup'

/* External Imports */
import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
import { randomUniform, randomNormal } from 'd3-random'
import level = require('level')
import BigNum = require('bn.js')

/* Logging Imports */
import debug from 'debug'
const log = debug('test:info:defrag-sim')

/* Internal Imports */
import { DefragSim, User } from '../../src/defrag-simulator/defrag-sim'


class StringRangeEntry {
  public stringRangeEntry
  constructor (
    rangeEntry: RangeEntry,
  ) {
    this.stringRangeEntry = {
      start: rangeEntry.start.toString('hex'),
      end: rangeEntry.end.toString('hex'),
      value: rangeEntry.value.toString()
    }
  }
}

// Simple random number generators to be used for now
const simpleDepositRangeLength = (): number => Math.floor(randomUniform(100, 200)())
const simpleShouldDeposit = (): boolean => (Math.round(randomUniform(0, 1)()) === 0) ? true : false
const simpleSendRangeLength = (): number => Math.floor(randomUniform(100, 200)())
const simpleRecipient = (): number => randomNormal()()

describe('Defrag Simulator', () => {
  const db = level(dbRootPath + 'rangeTest', { keyEncoding: 'binary', valueEncoding: 'binary' })
  let prefixCounter = 0
  let rangeDB

  beforeEach(async () => {
    rangeDB = new LevelRangeStore(db, Buffer.from([prefixCounter++]))
  })

  describe('DefragSim', () => {
    it('Allows us to create a defrag sim', async() => {
      const sim = new DefragSim(rangeDB, () => { log('Not implemented') })
      const numUsers = 100
      // Register 100 simple users
      for (let i = 0; i < numUsers; i++) {
        const user = new User(simpleDepositRangeLength, simpleShouldDeposit, simpleSendRangeLength, simpleRecipient)
        sim.registerUser(user)
      }
      // Run the test 100 ticks
      sim.tick(100)
    })
  })
})
