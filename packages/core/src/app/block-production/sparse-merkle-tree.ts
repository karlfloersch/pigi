/* External Imports */
import debug from 'debug'
const log = debug('info:sparse-merkle-tree')

/* Internal Imports */
import { reverse, keccak256, BigNumber, ZERO } from '../'
import {
  DB,
  Bucket,
  SparseMerkleTreeNode,
  SparseMerkleTree,
  SparseMerkleTreeDataBlock,
  SparseMerkleTreeInclusionProof,
} from '../../types'

/**
 * Computes the index of the sibling of a node in some level.
 * @param index Index of a node.
 * @returns the index of the sibling of that node.
 */
const getSiblingIndex = (index: number): number => {
  return index + (index % 2 === 0 ? 1 : -1)
}

/**
 * Computes the index of the parent of a node at the level above.
 * @param index Index of a node.
 * @returns the index of the parent of that node.
 */
const getParentIndex = (index: number): number => {
  return index === 0 ? 0 : Math.floor(index / 2)
}

export class GenericSparseMerkleTree implements SparseMerkleTree {
  private readonly treeBucket: Bucket

  constructor(readonly db: DB) {
    this.treeBucket = db.bucket(Buffer.from('TODO'))
  }

  public root(): SparseMerkleTreeNode {
    return Buffer.from('TODO')
  }

  public static hash(value: Buffer): Buffer {
    return keccak256(value)
  }

  /**
   * Computes the parent of two SparseMerkleTreeNode siblings in a tree.
   * @param left The left sibling to compute the parent of.
   * @param right The right sibling to compute the parent of.
   */
  public static parent(
    left: SparseMerkleTreeNode,
    right: SparseMerkleTreeNode
  ): SparseMerkleTreeNode {
    const concatenated = Buffer.concat([left, right])
    return GenericSparseMerkleTree.hash(concatenated)
  }

  /**
   * Calculates the leaf SparseMerkleTreeNode for a given data block.
   */
  public generateLeafNode(dataBlock: any): SparseMerkleTreeNode {
    return dataBlock
  }

  /**
   * Updates the tree, adding a new element.
   */
  public async update(leafPosition: BigNumber, value: SparseMerkleTreeDataBlock): Promise<void> {
    return
  }

  /**
   * Gets an inclusion proof for the merkle interval tree.
   * @param leafPosition the index in the tree of the leaf we are generating a merkle proof for.
   */
  public async getInclusionProof(leafPosition: BigNumber): Promise<SparseMerkleTreeInclusionProof> {
    // Check that the leaf position is in this tree

    // Generate Inclusion Proof
    const inclusionProof: SparseMerkleTreeNode[] = []
    return {
      siblings: inclusionProof,
      leafPosition: new BigNumber(leafPosition),
    }
  }

  /**
   * Gets the contents of a data block.
   * @param leafPosition the position in the tree of the leaf we are getting.
   */
  public async getDataBlock(leafPosition: BigNumber): Promise<SparseMerkleTreeDataBlock> {
    return 'TODO'
  }

  /**
   * Checks a Merkle proof.
   * @param leafNode Leaf node to check.
   * @param leafPosition Position of the leaf in the tree.
   * @param inclusionProof Inclusion proof for that transaction.
   * @param root The root node of the tree to check.
   * @returns the implicit bounds covered by the leaf if the proof is valid.
   */
  public static verify(
    leafNode: SparseMerkleTreeNode,
    inclusionProof: SparseMerkleTreeInclusionProof,
    rootHash: Buffer
  ): boolean {
    // TODO: Implement!
    return false
  }
}
