import '../setup'

/* Internal Imports */
import { test } from '../../src/defrag-simulator/defrag-sim'

/* External Imports */
import debug from 'debug'
const log = debug('test:info:state-manager')

describe('Miscellanous Utils', () => {
  describe('init', () => {
    it('should import', async () => {
      log('test123', test)
    })
  })
})
