import type { AppProps } from 'next/app'
import '../styles/globals.css'
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { ALCHEMY_KEY } from '../constants/constants'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const { chains, provider } = configureChains(
  [chain.polygon],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })],
)

const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </WagmiConfig>
  )
}
