import '../setup'

/* Internal Imports */
import {
  generateNTransitions,
  ZERO_BYTES32,
  getAddress,
  getSignature,
  getStateRoot,
} from '../helpers'

/* External Imports */
import { createMockProvider, deployContract, getWallets } from 'ethereum-waffle'
import MemDown from 'memdown'
import {
  hexStrToBuf,
  bufToHexString,
  BigNumber,
  BaseDB,
  SparseMerkleTreeImpl,
  DefaultSignatureProvider,
} from '@pigi/core'
import {
  DefaultRollupBlock,
} from '@pigi/wallet'

/* Logging */
import debug from 'debug'
const log = debug('test:info:rollup-chain-manager')

/* Contract Imports */
import * as RollupChain from '../../build/RollupChain.json'
import * as PlugableTransitionEvaluator from '../../build/PlugableTransitionEvaluator.json'
import * as RollupMerkleUtils from '../../build/RollupMerkleUtils.json'
import { Contract, ContractFactory, Wallet } from 'ethers'
import { assertThrowsAsync } from '@pigi/wallet/build/test/helpers'

/* Begin tests */
describe('RollupChain', () => {
  const provider = createMockProvider()
  const [wallet1, wallet2] = getWallets(provider)
  let rollupChain
  let rollupMerkleUtils
  let unipigEvaluator
  let rollupCtLogFilter

  /* Link libraries before tests */
  before(async () => {
    unipigEvaluator = await deployContract(
      wallet1,
      PlugableTransitionEvaluator,
      [],
      {
        gasLimit: 6700000,
      }
    )
    rollupMerkleUtils = await deployContract(wallet1, RollupMerkleUtils, [], {
      gasLimit: 6700000,
    })
  })

  /* Deploy a new RollupChain before each test */
  beforeEach(async () => {
    rollupChain = await deployContract(
      wallet1,
      RollupChain,
      [unipigEvaluator.address, rollupMerkleUtils.address],
      {
        gasLimit: 6700000,
      }
    )
    rollupCtLogFilter = {
      address: rollupChain.address,
      fromBlock: 0,
      toBlock: 'latest',
    }
  })

  /*
   * Test submitBlock()
   */
  describe('submitBlock() ', async () => {
    it('should not throw as long as it gets a bytes array (even if its invalid)', async () => {
      await rollupChain.submitBlock(['0x1234', '0x1234']) // Did not throw... success!
    })
  })

  /*
   * Test verifySequentialTransitions()
   */
  describe('verifySequentialTransitions()', async () => {
    let blocks
    // Before each test let's submit a couple blocks
    beforeEach(async () => {
      // Create two blocks from some default transitions
      blocks = [
        new DefaultRollupBlock(generateNTransitions(10), 0),
        new DefaultRollupBlock(generateNTransitions(10), 1),
      ]
      for (const block of blocks) {
        await block.generateTree()
      }
      // Submit the blocks
      await rollupChain.submitBlock(blocks[0].encodedTransitions)
      await rollupChain.submitBlock(blocks[1].encodedTransitions)
    })

    describe('same block', async () => {
      it('should NOT throw if the transitions are sequential in the same block', async () => {
        const includedTransitions = [
          await blocks[0].getIncludedTransition(0),
          await blocks[0].getIncludedTransition(1),
        ]
        await rollupChain.verifySequentialTransitions(
          includedTransitions[0],
          includedTransitions[1]
        )
      })

      it('should throw if they are not sequential in the same block', async () => {
        const includedTransitions = [
          await blocks[0].getIncludedTransition(0),
          await blocks[0].getIncludedTransition(2),
        ]
        try {
          await rollupChain.verifySequentialTransitions(
            includedTransitions[0],
            includedTransitions[1]
          )
        } catch (err) {
          // Success we threw an error!
          return
        }
        throw new Error('Verify sequential should throw when not sequential!')
      })
    })

    describe('different blocks', async () => {
      it('should NOT throw if the transitions are last of prev block & first of next block', async () => {
        const includedTransitions = [
          // Last transition of the first block
          await blocks[0].getIncludedTransition(
            blocks[0].transitions.length - 1
          ),
          // First transition of the next block
          await blocks[1].getIncludedTransition(0),
        ]
        await rollupChain.verifySequentialTransitions(
          includedTransitions[0],
          includedTransitions[1]
        )
      })

      it('should throw if the transitions are NOT last of prev block & first of next block', async () => {
        const includedTransitions = [
          await blocks[0].getIncludedTransition(0),
          await blocks[1].getIncludedTransition(0),
        ]
        try {
          await rollupChain.verifySequentialTransitions(
            includedTransitions[0],
            includedTransitions[1]
          )
        } catch (err) {
          // Success we threw an error!
          return
        }
        throw new Error('Verify sequential should throw when not sequential!')
      })
    })
  })

  /*
   * Test verifySequentialTransitions()
   */
  describe('checkTransitionIncluded()', async () => {
    it('should verify n included transitions for the first block', async () => {
      // Create a block from some default transitions
      const block = new DefaultRollupBlock(generateNTransitions(10), 0)
      await block.generateTree()
      // Actually submit the block
      await rollupChain.submitBlock(block.encodedTransitions)
      // Now check that each one was included
      for (let i = 0; i < block.transitions.length; i++) {
        const inclusionProof = await block.getInclusionProof(i)
        const isIncluded = await rollupChain.checkTransitionInclusion({
          transition: block.encodedTransitions[i],
          inclusionProof,
        })
        // Make sure it was included!
        isIncluded.should.equal(true)
      }
    })

    it('should verify n included transitions for the second block', async () => {
      // Create two blocks from some default transitions
      const block0 = new DefaultRollupBlock(generateNTransitions(5), 0)
      const block1 = new DefaultRollupBlock(generateNTransitions(5), 1)
      await block0.generateTree()
      await block1.generateTree()
      // Submit the blocks
      await rollupChain.submitBlock(block0.encodedTransitions)
      await rollupChain.submitBlock(block1.encodedTransitions)
      // Now check that all transitions for the 2nd block were included
      for (let i = 0; i < block1.transitions.length; i++) {
        const inclusionProof = await block1.getInclusionProof(i)
        const isIncluded = await rollupChain.checkTransitionInclusion({
          transition: block1.encodedTransitions[i],
          inclusionProof,
        })
        // Make sure it was included!
        isIncluded.should.equal(true)
      }
    })

    it('should fail to verify inclusion for a transition which is not included', async () => {
      // Create a block from some default transitions
      const block0 = new DefaultRollupBlock(generateNTransitions(5), 0)
      await block0.generateTree()
      // Submit the blocks
      await rollupChain.submitBlock(block0.encodedTransitions)
      // Now check that we don't return true if a transition shouldn't have been included
      const notIncluded = '0xdeadbeefdeadbeefdeadbeef'
      const res = await rollupChain.checkTransitionInclusion({
        transition: notIncluded,
        inclusionProof: {
          blockNumber: 0,
          transitionIndex: 0,
          path: 0,
          siblings: [ZERO_BYTES32],
        },
      })
      res.should.equal(false)
    })
  })
})
