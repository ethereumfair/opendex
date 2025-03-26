const Tx = require('ethereumjs-tx').Transaction
import { Notify } from 'vant'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
let WalletConnectProvider
export default async function getNoGasTransData(
  $scope,
  txInfo,
  senderAddress,
  mainNetwork,
  network,
) {
  if (network == 'TRX') {
    try {
      const signedTx = await tronWeb.trx.sign(txInfo)
      return signedTx
    } catch (error) {
      Notify({
        message: $scope.$t('cancleSign'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
      $scope.submitStatus = false
      return false
    }
  }
  const Web3 = require('web3')
  const ethers = require('ethers')
  const Common = require('ethereumjs-common').default
  const web3 = new Web3(mainNetwork)
  let serializedTransaction = await ethers.utils.serializeTransaction(txInfo)
  const messageHash = web3.utils.keccak256(serializedTransaction)

  if ($scope.$store.state.isWalletConnect || ($scope.$store.state.wallet.connectType == 'imToken' && $scope.isPC)) {
    WalletConnectProvider = await EthereumProvider.init(

      $scope.$store.state.wallet.connectType == 'imToken'
        ? $scope.$store.getters.EthereumProviderInitImtoken
        : $scope.$store.getters.EthereumProviderInit
    )
  }
  try {
    let signature
    if ($scope.$store.state.isWalletConnect) {
      signature = await WalletConnectProvider.request({
        // topic: $scope.$store.state.topic,
        // chainId: 'eip155:' + $scope.$store.state.chainId + '',
        // request: {
        method: 'eth_sign',
        params: [senderAddress, messageHash],
        // },
      })
    } else {
      signature = await mainNetwork.request({
        method: 'eth_sign',
        params: [senderAddress, messageHash],
      })
    }

    const signatureBytes = web3.utils.hexToBytes(signature)
    const r =
      '0x' +
      signatureBytes
        .slice(0, 32)
        .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    const s =
      '0x' +
      signatureBytes
        .slice(32, 64)
        .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    let v = signatureBytes[64]
    if (v < 27) {
      v += 27
    }
    const rawa_data = {
      ...txInfo,
      r: r,
      s: s,
      v: '0x' + (v + 8 + txInfo.chainId * 2).toString(16),
    }
    const customCommon = Common.forCustomChain(
      'mainnet', // 指定链的名称
      {
        networkId: txInfo.chainId,
        chainId: txInfo.chainId,
      },
      'petersburg', // 指定 EIP155 兼容协议的名称
    )
    const tx = new Tx(rawa_data, { common: customCommon })
    const serializedTx = tx.serialize()
    const rawTransaction = '0x' + serializedTx.toString('hex')
    return {
      r: r,
      s: s,
      v: '0x' + (v + 8 + txInfo.chainId * 2).toString(16),
      rawTransaction: rawTransaction,
    }
  } catch (error) {
    Notify({
      message: $scope.$t('cancleSign'),
      color: '#ad0000',
      background: '#ffe1e1',
    })
    $scope.submitStatus = false
    return false
  }
}
