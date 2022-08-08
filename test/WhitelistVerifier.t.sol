// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/examples/WhitelistVerifier.sol";
import "../src/LensPostDelegation.sol";
import "@lens/interfaces/ILensHub.sol";

contract WhitelistVerifierTest is Test {
    uint256 profileId = 17046;
    WhitelistVerifier verifier;
    LensPostDelegation delegator;

    address user1 = address(1); // This user will be on whitelist
    address user2 = address(2); // This user WON'T be on whitelist
    address profileOwner = 0x14306f86629E6bc885375a1f81611a4208316B2b;
    address lensHubAddress = 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82;
    ILensHub lensHub = ILensHub(lensHubAddress);

    function setUp(

    ) public {
        vm.startPrank(profileOwner);

        verifier = new WhitelistVerifier();
        delegator = new LensPostDelegation(lensHubAddress);

        lensHub.setDispatcher(profileId, address(delegator));
        delegator.registerProfile(profileId, address(verifier));
        vm.stopPrank();
    }
    
    function testPostIfOwner() public {
        vm.prank(profileOwner);
        verifier.addWhitelist(user1);
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

    function testPostIfNotOwner() public {
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

     function testAddWhitelist() public {
        vm.startPrank(profileOwner);

        verifier.addWhitelist(user1);
        bool whitelisted = verifier.isWhitelisted(user1);

        vm.stopPrank();
        assertEq(whitelisted, true);
    }

    function testRemoveWhitelist() public {
        vm.startPrank(profileOwner);

        verifier.addWhitelist(user1);

        vm.stopPrank();
        assertEq(verifier.isWhitelisted(user1), true);
    }

    function testRemoveWhitelistIfNotInWhitelist() public {
        vm.startPrank(profileOwner);

        vm.expectRevert(abi.encodeWithSignature("NotWhitelisted()"));
        verifier.removeWhitelist(user1);

        vm.stopPrank();
    }

    function testAddWhitelistIfAlreadyInWhitelist() public {
        vm.startPrank(profileOwner);

        verifier.addWhitelist(user1);
        vm.expectRevert(abi.encodeWithSignature("AlreadyWhitelisted()"));
        verifier.addWhitelist(user1);

        vm.stopPrank();
    }

}
