pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

/* Internal Imports */
import {DataTypes as dt} from "./DataTypes.sol";
import {TransitionEvaluator} from "./TransitionEvaluator.sol";

contract PlugableTransitionEvaluator is TransitionEvaluator {

    function getTransitionStateRootAndAccessList(
        bytes calldata _rawTransition
    ) external view returns(bytes32, uint32[2] memory) {
        bytes32 stateRoot;
        uint32[2] memory storageSlots;
        return (stateRoot, storageSlots);
    }

    function evaluateTransition(
        bytes calldata _transition,
        dt.StorageSlot[2] calldata _storageSlots
    ) external view returns(bytes32[2] memory) {
        bytes32[2] memory outputs;
        return outputs;
    }
}
