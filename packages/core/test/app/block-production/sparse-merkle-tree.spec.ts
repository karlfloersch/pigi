import { should } from '../../setup'

/* External Imports */
import debug from 'debug'
const log = debug('test:info:sparse-merkle-tree')

/* Internal Imports */
import {
  GenericSparseMerkleTree,
  BigNumber,
  BaseDB,
} from '../../../src/app/'
import MemDown from 'memdown'

describe.only('GenericSparseMerkleTree', () => {
  describe('Constructor', () => {
    it('should initialize', async () => {
      new GenericSparseMerkleTree(
        new BaseDB(new MemDown('') as any, 256)
      )
    })
  })
})
