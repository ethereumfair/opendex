import BigNumber from 'bignumber.js'
import { Client } from '@liquality/client'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'
import { BitcoinWalletApiProvider } from '@liquality/bitcoin-wallet-api-provider'
import { BitcoinFeeApiProvider } from '@liquality/bitcoin-fee-api-provider'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
let tp = null
let isTP = false
try {
  tp = require('tp-js-sdk')
  isTP = tp.isConnected()
} catch (error) {
  console.log(error)
}
const btcConfig = {
    api: {
    url: 'https://liquality.io/electrs'
    },
    batchApi: {
    url: 'https://liquality.io/electrs-batch'
    },
    feeNumberOfBlocks: 2,
    network: 'bitcoin',
    explorerPath: 'https://blockstream.info/tx/'
}
async function getBtcBalanceHandle(){
    if(isTP){
        const Balance = await tp.getCurrentBalance()
        return Balance.data.balance
    }
    const network =  await bitcoin.request({ method: 'wallet_getConnectedNetwork', params: [] })
    const btcClient = new Client()
    btcClient.addProvider(getBitcoinDataProvider(btcConfig))
    btcClient.addProvider(new BitcoinWalletApiProvider({ network, addressType: 'bech32' }))
    btcClient.addProvider(new BitcoinEsploraSwapFindProvider(btcConfig.api.url))
    btcClient.addProvider(new BitcoinFeeApiProvider('https://liquality.io/swap/mempool/v1/fees/recommended'))


    const addressesPerCall = 100
    const unusedAddress = await btcClient.wallet.getUnusedAddress()
    let allAddresses = await btcClient.wallet.getUsedAddresses(addressesPerCall)
    allAddresses = [ ...new Set([ unusedAddress, ...allAddresses ].map(a => a.address)) ]
    //allAddresses = allAddresses.map(address => chain.formatAddress(address))
    const result = await btcClient.chain.getBalance(allAddresses)
    const balance  = result ? result.dividedBy(new BigNumber('100000000')).toFixed(6, BigNumber.ROUND_DOWN) : 0
    return balance - 0
}
function getBitcoinDataProvider (btcConfig) {
    return new BitcoinEsploraBatchApiProvider({ url: btcConfig.api.url, batchUrl: btcConfig.batchApi.url, network: BitcoinNetworks[btcConfig.network], numberOfBlockConfirmation: btcConfig.feeNumberOfBlocks })
  }
const BtcExchangeHandle = {
    getBtcBalanceHandle: getBtcBalanceHandle
}
export default BtcExchangeHandle
