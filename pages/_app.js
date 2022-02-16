import '../styles/globals.css'
import { chains } from '@lib/chains'

import { providers } from 'ethers'
import { Provider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

function App({ Component, pageProps }) {
  const provider = ({ chainId, connector }) => {
    console.log('getting provider', chainId)
    const chain = connector?.chains.find((x) => x.id == chainId)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain)
  }

  // Set up connectors
  const connectors = ({ chainId }) => {
    const rpcUrl = chains[chainId]
    const rpcUrls = chains.reduce(
      (obj, item) => Object.assign(obj, { [item.id]: item.rpcUrls[0] }),
      {}
    )
    return [
      new InjectedConnector({
        chains: chains,
        options: { shimDisconnect: true },
      }),
      new WalletConnectConnector({
        options: {
          qrcode: true,
          rpc: rpcUrls,
        },
      }),
      new WalletLinkConnector({
        options: {
          appName: process.env.APP_NAME,
          jsonRpcUrl: rpcUrl,
        },
      }),
    ]
  }
  return (
    <Provider autoConnect provider={provider} connectors={connectors}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App