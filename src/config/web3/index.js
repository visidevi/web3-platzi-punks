import Web3 from 'web3'
import { InjectedConnector } from '@web3-react/injected-connector'

const getLibrary = (provider, connector) => {
    return new Web3(provider) // this will vary according to whether you use e.g. ethers or web3.js
  }
const connector = new InjectedConnector({ supportedChainIds: [
    5, // Goerli
 ] })
export {
    getLibrary,
    connector
}