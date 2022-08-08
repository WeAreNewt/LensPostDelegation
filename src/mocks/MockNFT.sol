// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "@solmate/tokens/ERC721.sol";
import "@openzeppelin/utils/Strings.sol";

contract MockNFT is ERC721 {
    uint256 currentSupply;
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) { 
        currentSupply = 0;
    }

    function mint(address recipient, uint256 amount) public {
        unchecked {
            for (uint16 i = 0; i < amount; i++) {
                _mint(recipient, currentSupply++);
            }
        }
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return Strings.toString(id);
    }
}
