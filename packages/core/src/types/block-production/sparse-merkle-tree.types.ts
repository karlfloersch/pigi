/* Internal Imports */
import { BigNumber } from '../../app'

// MerkleIntervalTreeNodes are simply the hash (as a buffer) of the two siblings.
export type SparseMerkleTreeNode = Buffer
// DataBlocks are what we are proving inclusion of, and they can be of any type.
export type SparseMerkleTreeDataBlock = any

/*
 * The inclusion proof for a SMT
 */
export interface SparseMerkleTreeInclusionProof {
  siblings: SparseMerkleTreeNode[] // The siblings along the merkle path leading from the leaf to the root.
  leafPosition: BigNumber // The index of the leaf we are proving inclusion of.
}

/*
 * A generic SMT which allows leaves to be updated.
 */
export interface SparseMerkleTree {
  root(): SparseMerkleTreeNode
  update(leafPosition: BigNumber, value: SparseMerkleTreeDataBlock): Promise<void>
  getDataBlock(leafPosition: BigNumber): Promise<SparseMerkleTreeDataBlock>
  getInclusionProof(
    leafPosition: BigNumber
  ): Promise<SparseMerkleTreeInclusionProof>
}
