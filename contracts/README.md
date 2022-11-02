# LensPostDelegation

Lens Post Delegation allows Lens Profiles to bestow [publication](https://docs.lens.xyz/docs/publication) creation access to other Polygon addresses (but not comment, mirror, collect, nor follow access). When enabled, addresses can have shared group access to post on a behalf of a Lens Profile. 

Lens Delegator Contract: [0x46fAf146C4683663667af868dFc2F98ADc27fBd6](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6)

## How To Set Up Contracts

Owner of the desired Lens profile will need to perform 2 calls:

`lensHub.setDispatcher(profileId, address(delegator));` 
Call `setDispatcher` on the [Lens Hub](https://polygonscan.com/address/0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d) with your profileId in decimal form (e.g., `63491` instead of `0xf803`) and the address of the [Lens Delegator](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6).

`delegator.registerProfile(profileId, address(verifier));`
Call `registerProfile` on the [Lens Delegator](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6) with the profileId in decimal form and the address of the verifier contract.

In our case, we have the [Whitelist Verifier Contract](https://polygonscan.com/address/0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1).

## Reference Implementation of Verifier Contract

Newt team has created a simple reference contract: an allow list on addresses that can post on behalf of a Lens Profile.

The owner of the contract (read from the `owner` function) can add additional addresses using the `addWhitelist` function.

Whitelist Verifier Contract: [0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1](https://polygonscan.com/address/0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1)

## Front End to Post on Lens

Currently, a UI to interact with the reference implementation is under development. When completed, the UI will allow delegated Polygon addresses to post on behalf of wearenewt.lens and other Lens Profiles using the reference implementation contract.

## License

[Link to code license](LICENSE.md)
