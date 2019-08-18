/* Internal Imports */
import { BigNumber } from '../../app'

// MerkleIntervalTreeNodes are simply the hash (as a buffer) of the two siblings.
type MerkleIntervalTreeNode = Buffer
// DataBlocks are what we are proving inclusion of, and they can be of any type.
type DataBlock = any

/*
 * The inclusion proof for a SMT
 */
export interface SparseMerkleTreeInclusionProof {
  siblings: MerkleIntervalTreeNode[] // The siblings along the merkle path leading from the leaf to the root.
  leafPosition: BigNumber // The index of the leaf we are proving inclusion of.
}

/*
 * A generic SMT which allows leaves to be updated.
 */
export interface SparseMerkleTree {
  root(): MerkleIntervalTreeNode
  update(leafPosition: BigNumber, value: DataBlock): Promise<void>
  getDataBlock(leafPosition: BigNumber): Promise<DataBlock>
  getInclusionProof(
    leafPosition: BigNumber
  ): Promise<SparseMerkleTreeInclusionProof>
}
