// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "../interfaces/IVerificator.sol";

contract TrueVerificatorMock is IVerificator {

    function verify(address _address) external pure returns (bool) {
        _address; // To remove warning
        return true;
    }

}

contract FalseVerificatorMock is IVerificator {

    function verify(address _address) external pure returns (bool) {
        _address; // To remove warning
        return false;
    }

}