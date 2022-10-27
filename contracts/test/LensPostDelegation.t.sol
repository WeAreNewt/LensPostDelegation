// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "@lens/interfaces/ILensHub.sol";
import "../src/LensPostDelegation.sol";
import "../src/mocks/MockVerifier.sol";

contract LensPostDelegationTest is Test {

    uint256 profileId = 17046;

    LensPostDelegation delegator;
    
    TrueVerifierMock trueVerifier = new TrueVerifierMock();
    FalseVerifierMock falseVerifier = new FalseVerifierMock();

    address user1 = address(1);
    address user2 = address(2);
    address profileOwner = 0x14306f86629E6bc885375a1f81611a4208316B2b;

    address lensHubAddress = 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82;
    ILensHub lensHub; 

    function setUp(

    ) public {
        lensHub = ILensHub(lensHubAddress);
        delegator = new LensPostDelegation(lensHubAddress);

        vm.prank(profileOwner);
        lensHub.setDispatcher(profileId, address(delegator));
    }

    function testRegisteredProfileIfNotRegistered() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        assertEq(delegator.verifierFromProfileId(profileId), address(trueVerifier));
    }
    function testRegisteredProfileIfAlreadyRegistered() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        vm.expectRevert(abi.encodeWithSignature("AlreadyRegistered()"));
        delegator.registerProfile(profileId, address(trueVerifier));
    }

    function testUnregisterProfileIfOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        delegator.unregisterProfile(profileId);
        assertEq(delegator.profileOwner(profileId), address(0));
    }
    
    function testUnregisterProfileIfNotOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("NotYourProfile()"));
        delegator.unregisterProfile(profileId);     
    }

    function testChangeOwnerOfProfileIfOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        delegator.changeOwnerOfProfile(profileId, address(user2));
        assertEq(delegator.profileOwner(profileId), address(user2));
    }


    function testChangeOwnerOfProfileIfNotOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSignature("NotYourProfile()"));
        delegator.changeOwnerOfProfile(profileId, address(user2));
    }

    function testChangeVerifierIfOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        delegator.changeVerifier(profileId, address(falseVerifier));
        assertEq(delegator.verifierFromProfileId(profileId), address(falseVerifier));
    }


    function testChangeVerifierIfNotOwner() public {
        delegator.registerProfile(profileId, address(trueVerifier));
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSignature("NotYourProfile()"));
        delegator.changeVerifier(profileId, address(falseVerifier));
    }
}
