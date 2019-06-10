import { dbRootPath } from '../setup'

/* Internal Imports */
import { DefragSim } from '../../src/defrag-simulator/defrag-sim'

/* External Imports */
import { LevelRangeStore, RangeEntry  } from '@pigi/operator'
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
      const sim = new DefragSim(rangeDB, 'test123', {
        depositRangeLength: undefined,
        depositRecurrence: undefined,
        sendRangeLength: undefined,
        recipient: undefined,
      }, () => { log('Not implemented') })
    })
  })
})
