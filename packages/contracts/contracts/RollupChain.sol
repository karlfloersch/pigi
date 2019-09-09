pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

/* Internal Imports */
import {DataTypes as dt} from "./DataTypes.sol";
import {SparseMerkleTreeLib} from "./SparseMerkleTreeLib.sol";

contract RollupChain {
    /* Fields */
    dt.Block[] public blocks;
    bytes32 public ZERO_BYTES32 = 0x0000000000000000000000000000000000000000000000000000000000000000;
    bool public halted = false;
    // Transaction types
    uint NEW_ACCOUNT_TRANSFER_TYPE = 0;
    uint STORED_ACCOUNT_TRANSFER_TYPE = 1;
    uint SWAP_TYPE = 2;

    /* We need to keep a tree in storage which we will use for proving invalid transitions */
    using SparseMerkleTreeLib for SparseMerkleTreeLib.SparseMerkleTree;
    SparseMerkleTreeLib.SparseMerkleTree partialState;

    /* Methods */
    function isHalted() public view returns(bool) {
        return halted;
    }

    /**
     * Submits a new block which is then rolled up.
     */
    function submitBlock(bytes[] memory _block) public returns(bytes32) {
        bytes32 root = SparseMerkleTreeLib.getMerkleRoot(_block);
        dt.Block memory rollupBlock = dt.Block({
            rootHash: root,
            blockSize: _block.length
        });
        blocks.push(rollupBlock);
        return root;
    }

    /**
     * Helper function which checks if a given value fits in a uint8
     */
    function isUint8(bytes32 value) private pure returns(bool) {
        // To check if something is a uint8 we will just check to see that
        // it has no values past the 8th byte. Note this checks "does this value fit in a uint8"
        // not if it was intended to be a uint8 or not
        bytes32 mask = 0x0000000000000000111111111111111111111111111111111111111111111111;
        bytes32 resultingValue = value & mask;
        return resultingValue == 0;
    }

    /**
     * Cast bytes to the a specific transaction type
     */
    function inferTransactionType(
        bytes memory transaction
    ) public view returns(uint) {
        // 128 is the length of a transfer tx
        if (transaction.length == 128) {
            // We're a swap for sure
            return SWAP_TYPE;
        }
        // Otherwise we're a transfer for sure... but which kind?
        (bytes32 tokenType, bytes32 account, bytes32 amount) = abi.decode(transaction, (bytes32, bytes32, bytes32));
        // Now we need to check if the account is a uint8 or if it's a real address
        if (isUint8(account)) {
            // If it is that means we're referencing a stored value.
            // Note you can fool this check if you have an account that fit into a uint8.
            // Long term we will want to stop padding our encoded values to remove this possibility.
            return STORED_ACCOUNT_TRANSFER_TYPE;
        }
        // Otherwise we must be dealing with a new account!
        return NEW_ACCOUNT_TRANSFER_TYPE;
    }


    /**
     * Apply a transfer transaction to an already stored storage slot
     */
    function applyStoredAccountTransfer(
        uint _storageNonce,
        dt.Storage[2] memory _storage,
        dt.SignedTransaction memory _transaction
    ) public view returns(bytes32[3] memory) {
        bytes32[3] memory outputs;
        // Update the outputs

        // We already know the storage nonce value
        outputs[2] = bytes32(_storageNonce);
        return outputs;
    }

    /**
     * Mock the execution of a transaction
     */
    function mockExecuteTransaction(
        uint _storageNonce,
        dt.Storage[2] memory _storage,
        dt.SignedTransaction memory _transaction
    ) public view returns(bytes32[3] memory) {
        bytes32[3] memory outputs;
        // Set the output values. For now it's mocked & we just hash the storage slots
        outputs[0] = getStorageHash(_storage[0]);
        outputs[1] = getStorageHash(_storage[1]);
        outputs[2] = 0x0000000000000000000000000000000000000000000000000000000000000005;
        // Return the output!
        return outputs;
    }

    function verifyAndStoreStorageInclusionProof(dt.IncludedStorage memory _includedStorage) private {
        // First check if the storage is empty
        if (_includedStorage.value.pubkey == 0x0000000000000000000000000000000000000000) {
            // Verify and store an empty hash
            partialState.verifyAndStore(
                _includedStorage.inclusionProof.path,
                ZERO_BYTES32,
                _includedStorage.inclusionProof.siblings
            );
        } else {
            partialState.verifyAndStore(
                _includedStorage.inclusionProof.path,
                getStorageHash(_includedStorage.value),
                _includedStorage.inclusionProof.siblings
            );
        }
    }

    /**
     * Checks if a transition is invalid and if it is records it & halts
     * the chain.
     */
    function proveTransitionInvalid(
        dt.IncludedTransition memory _preStateTransition,
        dt.IncludedTransition memory _invalidTransition,
        dt.IncludedStorage[2] memory _inputStorage
    ) public {
        verifySequentialTransitions(_preStateTransition, _invalidTransition);
        bytes32 preStateRoot = _preStateTransition.transition.postState;
        bytes32 postStateRoot = _invalidTransition.transition.postState;
        partialState.root = preStateRoot;
        // The storage nonce is always the last sibling
        uint storageNonce = uint(_inputStorage[0].inclusionProof.siblings[_inputStorage[0].inclusionProof.siblings.length - 1]);

        // First we must verify and store the storage inclusion proofs
        for (uint i = 0; i < _inputStorage.length; i++) {
            verifyAndStoreStorageInclusionProof(_inputStorage[i]);
        }

        // Now that we've verified and stored our storage in the state tree, lets apply the transaction
        dt.Storage memory storage0 = _inputStorage[0].value;
        dt.Storage memory storage1 = _inputStorage[1].value;
        dt.Storage[2] memory storageSlots = [storage0, storage1];
        bytes32[3] memory outputs = mockExecuteTransaction(storageNonce, storageSlots, _invalidTransition.transition.signedTransaction);
        // First lets verify that the tx was successful. If it wasn't then our accountNonce will equal zero
        if (outputs[2] == ZERO_BYTES32) {
            halted = true;
            return;
        }

        // The transaction succeeded, now we need to check if the state root is incorrect
        for (uint i = 0; i < _inputStorage.length; i++) {
            partialState.update(_inputStorage[i].inclusionProof.path, outputs[i]);
        }
        // The state root MUST be incorrect for us to proceed in halting the chain!
        require(postStateRoot != partialState.root, 'postStateRoot must be different than the transaction result to be invalid.');

        // Halt the chain because we found an invalid post state root! Cryptoeconomic validity ftw!
        halted = true;
    }

    /**
     * Verifies that two transitions were included one after another.
     * This is used to make sure we are comparing the correct
     * prestate & poststate.
     */
    function verifySequentialTransitions(
        dt.IncludedTransition memory _transition0,
        dt.IncludedTransition memory _transition1
    ) public returns(bool) {
        // Verify inclusion
        require(checkTransitionInclusion(_transition0), 'The first transition must be included!');
        require(checkTransitionInclusion(_transition1), 'The second transition must be included!');

        // Verify that the two transitions are one after another

        // Start by checking if they are in the same block
        if (_transition0.inclusionProof.blockNumber == _transition1.inclusionProof.blockNumber) {
            // If the blocknumber is the same, simply check that transition0 preceeds transition1
            require(_transition0.inclusionProof.transitionIndex == _transition1.inclusionProof.transitionIndex - 1, 'Transitions must be sequential!');
            // Hurray! The transition is valid!
            return true;
        }

        // If not in the same block, we check that:
        // 0) the blocks are one after another
        require(_transition0.inclusionProof.blockNumber == _transition1.inclusionProof.blockNumber - 1, 'Blocks must be one after another or equal.');
        // 1) the transitionIndex of transition0 is the last in the block; and
        require(_transition0.inclusionProof.transitionIndex == blocks[_transition0.inclusionProof.blockNumber].blockSize - 1, '_transition0 must be last in its block.');
        // 2) the transitionIndex of transition1 is the first in the block
        require(_transition1.inclusionProof.transitionIndex == 0, '_transition0 must be first in its block.');

        // Success!
        return true;
    }

    /**
     * Check to see if a transition was indeed included.
     */
    function checkTransitionInclusion(dt.IncludedTransition memory _includedTransition) public view returns(bool) {
        // bytes32 rootHash = blocks[_includedTransition.inclusionProof.blockNumber].rootHash;
        // bytes32 transitionHash = getTransitionHash(_includedTransition.transition);
        // bool isIncluded =  SparseMerkleTreeLib.verify(
        //     rootHash,
        //     transitionHash,
        //     _includedTransition.inclusionProof.path,
        //     _includedTransition.inclusionProof.siblings
        // );
        // return isIncluded;

        // TODO: Actually check inclusion. Mock this until we build an SMT inclusion proof checker.
        return true;
    }

    /**
     * Get the hash of the transition.
     */
    function getTransitionHash(dt.Transition memory _transition) public pure returns(bytes32) {
        // Here we don't use `abi.encode([struct])` because it's not clear
        // how to generate that encoding client-side.
        return keccak256(
            abi.encode(
                _transition.signedTransaction.signature,
                _transition.signedTransaction.transaction,
                _transition.postState
            )
        );
    }

    /**
     * Get the hash of the storage value.
     */
    function getStorageHash(dt.Storage memory _storage) public pure returns(bytes32) {
        // Here we don't use `abi.encode([struct])` because it's not clear
        // how to generate that encoding client-side.
        return keccak256(abi.encode(_storage.pubkey, _storage.uniBalance, _storage.pigiBalance));
    }
}
