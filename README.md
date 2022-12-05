# Lens Post Delegation

Lens Post Delegation allows Lens Profiles to bestow [publication](https://docs.lens.xyz/docs/publication) creation access to other Polygon addresses (but not comment, mirror, collect, nor follow access). When enabled, addresses can have shared group access to post on a behalf of a Lens Profile. For example, an organization's Lens Profile can now be shared by a number of its contributors.

## How It Works

The [Lens Hub](https://docs.lens.xyz/docs/lenshub) has a `setDispatcher` function that allows another address to be able to publish and set the URI on behalf of the profile.

Lens Post Delegation uses a Delegator Contract that acts as the Dispatcher for a Lens Profile. In turn, the Delegator Contract points to another contract, called the Verifier Contract, that sets the rules for which addresses can post on behalf of the Lens Profile.

Anyone can make a Verifier Contract to allow for the arbitrary delegation of publishing ability of a Lens Profile. To start, we made a reference implementation that you can read more about below.

![Group 9](https://user-images.githubusercontent.com/84038320/199519548-73bb8380-c633-4a07-9f56-e5682af02392.png)

Lens Delegator Contract: [0x46fAf146C4683663667af868dFc2F98ADc27fBd6](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6)

## How To Enable Lens Post Delegation for a Lens Profile

Owner of the desired Lens profile will need to perform 2 calls:

`lensHub.setDispatcher(profileId, address(delegator));`

Call `setDispatcher` on the [Lens Hub](https://polygonscan.com/address/0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d) with your profileId in decimal form (e.g., `63491` instead of `0xf803`) and the address of the [Lens Delegator](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6).

`delegator.registerProfile(profileId, address(verifier));`

Call `registerProfile` on the [Lens Delegator](https://polygonscan.com/address/0x46faf146c4683663667af868dfc2f98adc27fbd6) with the profileId in decimal form and the address of the Verifier Contract.

In our case, we have the [Whitelist Verifier Contract](https://polygonscan.com/address/0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1).

## Reference Implementation of Verifier Contract

Newt team has created a simple reference contract: an allow list on addresses that can post on behalf of a Lens Profile.

The owner of the contract (read from the `owner` function) can add additional addresses using the `addWhitelist` function.

Whitelist Verifier Contract: [0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1](https://polygonscan.com/address/0x6c57944c1c7C09D8eA91Ed47FBbfd7F4e387E0E1)

## Front End to Post on Lens

Currently, a UI to interact with the reference implementation is under development. When completed, the UI will allow delegated Polygon addresses to post on behalf of wearenewt.lens and other Lens Profiles using the reference implementation contract.

Note that the UI will not be able to read from other Verifier Contracts, only from the reference implementation. However, you may fork the frontend and point it to any Verifier Contract.

[See The Front End](https://lenspostdelegation.vercel.app/)

## License

[Link to code license](LICENSE.md)
