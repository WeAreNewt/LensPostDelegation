// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "../interfaces/IVerificator.sol";
import "@openzeppelin/interfaces/IERC721.sol";
import "@solmate/auth/Owned.sol";

contract NFTVerificator is IVerificator, Owned {
    IERC721 nftCollection;

    constructor(address _nftCollectionAddress) Owned(msg.sender) {
        nftCollection = IERC721(_nftCollectionAddress);
    }

    function verify(address _address) external view returns (bool) {
        return (nftCollection.balanceOf(_address) > 0);
    }
    function changeCollectionAddress(address _collectionAddress) public onlyOwner {
        nftCollection = IERC721(_collectionAddress);
    }
}