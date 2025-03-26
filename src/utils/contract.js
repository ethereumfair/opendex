// export default
import { ethers } from 'ethers'
import store from '../store'
import abi from './abi'
import Web3 from 'web3'
let provider, windowPlguin
const contractList = {}

export default async function getContractAll(symbol, checkApprove) {
  let connectType = store.state.wallet.connectType
  if (connectType === 'Nabox') {
    windowPlguin = NaboxWallet
  } else if (connectType === 'MetaXWallet') {
    windowPlguin = okexchain
  } else if (connectType === 'ONTO') {
    windowPlguin = window.onto
  } else if (connectType === 'oneKey') {
    windowPlguin = window.$onekey.ethereum
  } else if (connectType === 'Halo') {
    windowPlguin = window.kucoin
  } else if (connectType === 'OKExWallet') {
    windowPlguin = window.okexchain
  } else if (connectType === 'OpenBlock') {
    windowPlguin = window.openblock
  } else if (connectType === 'CLVWallet') {
    windowPlguin = window.clover
  } else if (connectType === 'Crypto') {
    windowPlguin = window.deficonnectProvider
  } else if (connectType === 'Bitget') {
    windowPlguin = window.bitkeep.ethereum
  } else if (connectType === 'Patex') {
    windowPlguin = window.patex.ethereum
  } else if (connectType === 'FoxWallet') {
    windowPlguin = window.foxwallet.ethereum
  } else if (connectType === 'EchoooWallet') {
    windowPlguin = window.echoooEth
  } else {
    windowPlguin = window.ethereum
  }
  let MyContract
  if (checkApprove) {
    const web3 = new Web3(windowPlguin)
    MyContract = await new web3.eth.Contract(abi, symbol)
    return MyContract
  }
  provider = new ethers.providers.Web3Provider(windowPlguin, 'any')

  if (symbol in contractList) {
    return contractList[symbol]
  } else {
    const contract = new ethers.Contract(symbol, abi, provider)
    contractList[symbol] = contract
    return contract
  }
}
