// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

interface IVerifier {
    function verify(address poster) external view returns (bool);
}