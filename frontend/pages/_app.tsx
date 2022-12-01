import type { AppProps } from 'next/app'
import '../styles/globals.css'
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
} from 'wagmi'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'


const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()],
)

const connector = new MetaMaskConnector({
  chains: [chain.polygonMumbai],
})
const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
});


const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })],
  provider,
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
