// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "../interfaces/IVerifier.sol";

contract TrueVerifierMock is IVerifier {

    function verify(address _address) external pure returns (bool) {
        _address; // To remove warning
        return true;
    }

}

contract FalseVerifierMock is IVerifier {

    function verify(address _address) external pure returns (bool) {
        _address; // To remove warning
        return false;
    }

}