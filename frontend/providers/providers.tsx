import {
    WagmiConfig,
    createClient,
    configureChains,
    chain,
    defaultChains,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.polygon],
    [alchemyProvider({ apiKey: 'yourAlchemyApiKey' })],
)
