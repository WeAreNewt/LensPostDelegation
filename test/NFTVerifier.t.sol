// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/examples/NFTVerifier.sol";
import "../src/mocks/MockNFT.sol";
import "../src/LensPostDelegation.sol";
import "@lens/interfaces/ILensHub.sol";

contract NFTVerifierTest is Test {
    uint256 profileId = 17046;
    NFTVerifier verifier;
    MockNFT nftCollection1;
    MockNFT nftCollection2;
    LensPostDelegation delegator;

    address user1 = address(1); // This user will have NFT's
    address user2 = address(2); // This user WON'T have NFT's
    address profileOwner = 0x14306f86629E6bc885375a1f81611a4208316B2b;
    address lensHubAddress = 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82;
    ILensHub lensHub = ILensHub(lensHubAddress);

    function setUp(

    ) public {
        vm.startPrank(profileOwner);

        nftCollection1 = new MockNFT("TEST1", "TST1");
        nftCollection2 = new MockNFT("TEST2", "TST2");

        verifier = new NFTVerifier(address(nftCollection1));
        delegator = new LensPostDelegation(lensHubAddress);

        nftCollection1.mint(user1, 10);
        nftCollection2.mint(user1, 10);

        lensHub.setDispatcher(profileId, address(delegator));
        delegator.registerProfile(profileId, address(verifier));

        vm.stopPrank();
    }
    
    function testPostIfVerified() public {
        DataTypes.ProfileStruct memory profile =  lensHub.getProfile(profileId);
        vm.startPrank(user1);
        delegator.post
        (
            profileId,
            'aave.com',
            0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c,
            abi.encode(false),
            address(0),
            abi.encode('')
        );
        vm.stopPrank();
        assertEq(lensHub.getContentURI(profileId, profile.pubCount+1), 'aave.com');
    }

    function testPostiIfNotVerified() public {
        vm.startPrank(user2);
        vm.expectRevert(abi.encodeWithSignature("NotVerifiedToPost()"));
        delegator.post
        (
            profileId,
            'aave.com',
            0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c,
            abi.encode(false),
            address(0),
            abi.encode('')
        );
        vm.stopPrank();
    }

    function testChangeCollection() public {
        vm.startPrank(profileOwner);
        verifier.changeCollectionAddress(address(nftCollection2));
        vm.stopPrank();
    }
}
