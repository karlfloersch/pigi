import { dbRootPath } from '../setup'

/* Internal Imports */
import { DefragSim } from '../../src/defrag-simulator/defrag-sim'

/* External Imports */
import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
import { randomUniform, randomNormal } from 'd3-random'
import level = require('level')
import BigNum = require('bn.js')

/* Logging Imports */
import debug from 'debug'
const log = debug('test:info:defrag-sim')

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

describe('RangeDB', () => {
  const db = level(dbRootPath + 'rangeTest', { keyEncoding: 'binary', valueEncoding: 'binary' })
  let prefixCounter = 0
  let rangeDB

  beforeEach(async () => {
    rangeDB = new LevelRangeStore(db, Buffer.from([prefixCounter++]))
  })

  describe('RangeDB', () => {
    it('Allows us to create a defrag sim', async() => {
      const sim = new DefragSim(rangeDB, 10, 'test123', {
        depositRangeLength: (): number => Math.floor(randomUniform(100, 200)()),
        shouldDeposit: (): boolean => (Math.round(randomUniform(0, 1)()) === 0) ? true : false,
        sendRangeLength: (): number => Math.floor(randomUniform(100, 200)()),
        recipient: (): number => randomNormal()(),
      }, () => { log('Not implemented') })
      sim.tick(100)
    })
  })
})
