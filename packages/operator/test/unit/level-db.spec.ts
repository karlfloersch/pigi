import '../setup'

/* External Imports */
import BigNum = require('bn.js')
import path = require('path')
const log = require('debug')('test:level-db')

/* Internal Imports */
import { LevelDB } from '../../src/db/level-db'

/* DB Service Mocker */

describe('LevelDB', () => {
  const config = {
    stateDbPath: path.join(__dirname, 'tx-log', 'test-db-dir'),
  }
  let db = new LevelDB(__dirname)
  log('Created new DB at path:', __dirname)

  it('should create the directory', () => {
    log('In test!')
  }) 
})
