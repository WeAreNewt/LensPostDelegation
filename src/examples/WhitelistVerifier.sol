// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "../interfaces/IVerifier.sol";
import "@solmate/auth/Owned.sol";

contract WhitelistVerifier is IVerifier, Owned {

    address[] public whitelist;

    error NotWhitelisted();
    error AlreadyWhitelisted();
    
    event WhitelistAdded(address);
    event WhitelistRemoved(address);

    constructor() Owned(msg.sender) {}

    function verify(address _address) external view returns (bool) {
        return isWhitelisted(_address);
    }

    function addWhitelist(address _address) external onlyOwner {
        if(isWhitelisted(_address)) revert AlreadyWhitelisted();
        whitelist.push(_address);
        emit WhitelistAdded(_address);
    }

    function removeWhitelist(address _address) external onlyOwner {
         if(!isWhitelisted(_address)) revert NotWhitelisted();

         unchecked {
            for(uint256 i = 0; i < whitelist.length; i++) {
                if(_address == whitelist[i]) {
                    delete whitelist[i];
                    break;
                }
            }
        }

        emit WhitelistRemoved(_address);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        unchecked {
            for(uint256 i = 0; i < whitelist.length; i++) {
                if(_address == whitelist[i]) return true;
            }
            return false;
        }
    }
}