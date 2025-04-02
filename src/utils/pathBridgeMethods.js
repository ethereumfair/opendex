import store from '../store'
import BigNumber from 'bignumber.js'
import baseApi from '../api/baseApi'
import getContractAll from '../utils/contract'
import { ethers } from 'ethers'
import { Notify, Dialog } from 'vant'
import getAllBalance from './getAllBalance'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import failureExchange from '../utils/failureExchange'
import tronAbi from '../utils/tronAbi'
import { MsafeWallet } from 'msafe-wallet'
import suiWalletMethods from '../utils/suiWalletConnect'
import suiOKXWalletMethods from '../utils/suiOKXWalletConnect'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import joyIdMethids from '../utils/joyID/swapMethods'

import ETH_erc20 from './eth-erc20'
import md5Handle from './hexmd5'
let state, provider, signer, scope, stateToToken, stateFromToken, mainNetwork //全局state
let cBridgeInfo, transferData // cBridge 兑换参数
let WalletConnectProvider = null
const pathBridgeExchange = async function ($scope) {
  state = store.state
  scope = $scope
  if (state.isWalletConnect || (scope.connectType == "imToken" && scope.isPC)) {
    WalletConnectProvider = await EthereumProvider.init(

      scope.connectType == "imToken"
        ? store.getters.EthereumProviderInitImtoken
        : store.getters.EthereumProviderInit,
    )
  }
  stateToToken =
    state.tabActive == 'bridge' ? state.bridgeToTokenchain : state.tabActive == 'gasSwap' ? state.gasToToken : state.toToken
  stateFromToken =
    state.tabActive == 'bridge' ? state.bridgeFromTokenchain : state.tabActive == 'gasSwap' ? state.gasFromToken : state.fromToken

  //判断
  if (state.info.dex === 'CBridge') {
    cBridgeInfo = state.info.cBridgeInfo
  }
  // 得到的兑换数量加滑点
  const amount = new BigNumber(
    state.info.toTokenAmount * (1 - state.slidingPoint / 100),
  ).multipliedBy(BigNumber(10).pow(stateToToken.coinDecimal))
  let params = {
    //请求参数
    fromTokenAddress:
      stateFromToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateFromToken.contact,
    toTokenAddress:
      stateToToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateToToken.contact,
    fromAddress: state.wallet.address,
    toAddress: state.address,
    amountOutMin: toNonExponential(amount, 'parseInt'),
    routerPath: state.info.path
      ? JSON.parse(JSON.stringify(state.info.path))
      : '',
    amounts: [], //跨链
    dex: state.info.dex,
    aggregator: '', //跨链
    fromTokenChain: changeNetWork(stateFromToken.mainNetwork),
    toTokenChain: changeNetWork(stateToToken.mainNetwork),
    fromTokenAmount: state.info.fromTokenAmount,
    slippage: state.slidingPoint, //滑点
    //"deadline": 15
  }
  if (state.wallet.connectType === 'OKExWallet') {
    mainNetwork = okexchain
    provider = new ethers.providers.Web3Provider(okexchain, 'any')
  } else if (state.wallet.connectType === 'ONTO') {
    mainNetwork = onto
    provider = new ethers.providers.Web3Provider(window.onto, 'any')
  } else if (state.wallet.connectType === 'OpenBlock') {
    mainNetwork = openblock
    provider = new ethers.providers.Web3Provider(window.openblock, 'any')
  }  else if (state.wallet.connectType === 'EchoooWallet') {
    mainNetwork = echoooEth
    provider = new ethers.providers.Web3Provider(window.echoooEth, 'any')
  } else if (state.wallet.connectType === 'oneKey') {
    mainNetwork = $onekey.ethereum
    provider = new ethers.providers.Web3Provider(window.$onekey.ethereum, 'any')
  } else if (state.wallet.connectType === 'CLVWallet') {
    mainNetwork = window.clover
    provider = new ethers.providers.Web3Provider(window.clover, 'any')
  } else if (state.wallet.connectType === 'Halo') {
    mainNetwork = window.kucoin
    provider = new ethers.providers.Web3Provider(window.kucoin, 'any')
  } else if (state.wallet.connectType === 'Crypto') {
    mainNetwork = window.deficonnectProvider
    provider = new ethers.providers.Web3Provider(
      window.deficonnectProvider,
      'any',
    )
  } else if (state.wallet.connectType === 'Bitget') {
    mainNetwork = window.bitkeep.ethereum
    provider = new ethers.providers.Web3Provider(window.bitkeep.ethereum, 'any')
  } else if (state.wallet.connectType === 'Patex') {
    mainNetwork = window.patex.ethereum
    provider = new ethers.providers.Web3Provider(window.patex.ethereum, 'any')
  } else {
    mainNetwork = window.ethereum
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    }
  }
  const isWalletConnect = state.isWalletConnect
  if (isWalletConnect) {
    // signer = new WalletConnect({
    //   bridge: 'https://bridge.walletconnect.org', // Required
    //   qrcodeModal: QRCodeModal,
    // })
  } else {
    signer = provider ? provider.getSigner() : null
  }

  //判断dex 是否维护
  if (state.info.dexStatus === 'MAINTAIN') {
    $scope.submitStatus = false
    return Dialog.alert({
      message: scope.$t('maintain', {
        dex: state.info.dex,
      }),
      theme: 'round-button',
      messageAlign: 'left',
      confirmButtonColor: '#0A4F93',
    })
  }
  //o3拦截手续费是否充足
  if (state.info.dex === 'O3Swap') {
    let fee = state.info.fee //需要手续费
    const tokenChain = stateFromToken.mainNetwork //链
    const coin = {
      contact: '',
    }
    //判断是否主币
    const address = stateFromToken.contact
    if (address === '') {
      fee = new BigNumber(state.fromNumber).plus(new BigNumber(fee)).toString()
    }
    //计算主币余额
    const data = await getAllBalance([coin], tokenChain)
    const balance = new BigNumber(data[0].result)
      .shiftedBy(-18)
      .toFixed(6, BigNumber.ROUND_DOWN)
    let symbol = ''
    if (tokenChain === 'BSC') {
      symbol = 'BNB'
    } else if (tokenChain === 'ETH') {
      symbol = 'ETH'
    } else if (tokenChain === 'HECO') {
      symbol = 'HT'
    } else if (tokenChain === 'POLYGON') {
      symbol = 'MATIC'
    }
    let tip = scope.$t('feeInsufficient', { coin: symbol })
    if (address === '') {
      tip = scope.$t('ownFeeInsufficient', { coin: symbol })
    }
    if (balance < fee) {
      Notify({
        message: tip,
        color: '#ad0000',
        background: '#ffe1e1',
      })
      $scope.submitStatus = false
      return
    }
  }
  //O3 跨链
  if (
    stateFromToken.mainNetwork != stateToToken.mainNetwork &&
    state.info.dex === 'O3Swap'
  ) {
    params.amounts = state.info.chooseSwapPath.amount
    params.aggregator = state.info.chooseSwapPath.aggregator
  }
  //bridgers1 拦截
  if (scope.info.dex === 'bridgers1') {
    const amountOutMin = new BigNumber(state.info.amountOutMin)
    let data = {
      fromTokenAddress:
        stateFromToken.contact === ''
          ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          : stateFromToken.contact,
      toTokenAddress:
        stateToToken.contact === ''
          ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          : stateToToken.contact,
      fromAddress:
        changeNetWork(stateFromToken.mainNetwork) === 'TRX'
          ? state.walletTRON
          : state.wallet.address,
      toAddress: state.address,
      fromTokenChain: changeNetWork(stateFromToken.mainNetwork),
      toTokenChain: changeNetWork(stateToToken.mainNetwork),
      fromTokenAmount: state.info.fromTokenAmount,
      amountOutMin:
        toNonExponential(amountOutMin).toString() > 0
          ? toNonExponential(amountOutMin, 'parseInt')
          : toNonExponential(amountOutMin),
      fromCoinCode: stateFromToken.coinCode,
      toCoinCode: stateToToken.coinCode,
    }
    baseApi
      .sSwapswap(data)
      .then((res) => {
        if (res.resCode == 100) {
          isApproved(res)
        } else {
          $scope.submitStatus = false
          Notify({
            message: $scope.$t(res.resCode),
            color: '#ad0000',
            background: '#ffe1e1',
          })
          failureExchange({
            orderId: '',
            fromAmount: state.info.fromTokenAmount,
            fromCoinCode: stateFromToken.coinCode,
            toAmount: state.toNumber,
            toCoinCode: stateToToken.coinCode,
            hash: '',
            fromAddress:
              changeNetWork(stateFromToken.mainNetwork) === 'TRX'
                ? state.walletTRON
                : state.wallet.address,
            fromTokenAddress:
              stateFromToken.contact === ''
                ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                : stateFromToken.contact,
            toTokenAddress:
              stateToToken.contact === ''
                ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                : stateToToken.contact,
            fromChain: changeNetWork(stateFromToken.mainNetwork),
            toChain: changeNetWork(stateToToken.mainNetwork),
            failedReason: $scope.$t(res.resCode),
            platform: location.host,
            currentNode: scope.$store.state.rpcObject[
              stateFromToken.mainNetwork
            ]
              ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
              : '',
          })
        }
      })
      .catch((error) => {
        $scope.submitStatus = false
        failureExchange({
          orderId: '',
          fromAmount: state.info.fromTokenAmount,
          fromCoinCode: stateFromToken.coinCode,
          toAmount: state.toNumber,
          toCoinCode: stateToToken.coinCode,
          hash: '',
          fromAddress:
            changeNetWork(stateFromToken.mainNetwork) === 'TRX'
              ? state.walletTRON
              : state.wallet.address,
          fromTokenAddress:
            stateFromToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateFromToken.contact,
          toTokenAddress:
            stateToToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateToToken.contact,
          fromChain: changeNetWork(stateFromToken.mainNetwork),
          toChain: changeNetWork(stateToToken.mainNetwork),
          failedReason: error,
          platform: location.host,
          currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
            ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
            : '',
        })
      })
    return
  }
  //bridgers2 拦截
  if (scope.info.dex === 'bridgers2') {
    const amountOutMin = new BigNumber(state.info.amountOutMin)
    let data = {
      fromTokenAddress:
        stateFromToken.contact === ''
          ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          : stateFromToken.contact,
      toTokenAddress:
        stateToToken.contact === ''
          ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          : stateToToken.contact,
      fromAddress: state.wallet.address,
      toAddress: state.address,
      fromTokenChain: changeNetWork(stateFromToken.mainNetwork),
      toTokenChain: changeNetWork(stateToToken.mainNetwork),
      fromTokenAmount: state.info.fromTokenAmount,
      amountOutMin:
        toNonExponential(amountOutMin).toString() > 0
          ? toNonExponential(amountOutMin, 'parseInt')
          : toNonExponential(amountOutMin),
      fromCoinCode: stateFromToken.coinCode,
      toCoinCode: stateToToken.coinCode,
      slippage: state.slidingPoint, //滑点
    }
    baseApi
      .Bridgers2swap(data)
      .then((res) => {
        if (res.resCode == 100) {
          isApproved(res)
        } else {
          $scope.submitStatus = false
          Notify({
            message: $scope.$t(res.resCode),
            color: '#ad0000',
            background: '#ffe1e1',
          })
        }
      })
      .catch((error) => {
        $scope.submitStatus = false
      })
    return
  }
  //请求兑换接口
  baseApi
    .commonSwap(params)
    .then((res) => {
      if (res.resCode == 100) {
        //cBridge 兑换
        transferData = res.data.txData.transferData
        //币安跨链桥
        if (state.info.dex === 'BinanceBridge') {
          BinanceBridgeExchange(res)
        } else {
          //验证是否需要授权
          isApproved(res)
        }
      } else {
        if (state.info.dex === 'BinanceBridge') {
          Notify({
            message: res.resMsg,
            color: '#ad0000',
            background: '#ffe1e1',
          })
        }
        $scope.submitStatus = false
        if (
          res.resCode == '916' ||
          res.resCode == '1145' ||
          res.resCode == '1146'
        ) {
          Notify({
            color: '#ad0000',
            background: '#ffe1e1',
            message: scope.$t(res.resCode),
          })
        } else {
          Notify({
            color: '#ad0000',
            background: '#ffe1e1',
            message: scope.$t('1001', {
              code: res.resCode,
            }),
          })
        }
        failureExchange({
          orderId: '',
          fromAmount: state.info.fromTokenAmount,
          fromCoinCode: stateFromToken.coinCode,
          toAmount: state.toNumber,
          toCoinCode: stateToToken.coinCode,
          hash: '',
          fromAddress:
            changeNetWork(stateFromToken.mainNetwork) === 'TRX'
              ? state.walletTRON
              : state.wallet.address,
          fromTokenAddress:
            stateFromToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateFromToken.contact,
          toTokenAddress:
            stateToToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateToToken.contact,
          fromChain: changeNetWork(stateFromToken.mainNetwork),
          toChain: changeNetWork(stateToToken.mainNetwork),
          failedReason: [state.info.dex, $scope.$t(res.resCode)].toString(),
          platform: location.host,
          currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
            ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
            : '',
        })
      }
    })
    .catch((error) => {
      $scope.submitStatus = false
      failureExchange({
        orderId: '',
        fromAmount: state.info.fromTokenAmount,
        fromCoinCode: stateFromToken.coinCode,
        toAmount: state.toNumber,
        toCoinCode: stateToToken.coinCode,
        hash: '',
        fromAddress:
          changeNetWork(stateFromToken.mainNetwork) === 'TRX'
            ? state.walletTRON
            : state.wallet.address,
        fromTokenAddress:
          stateFromToken.contact === ''
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : stateFromToken.contact,
        toTokenAddress:
          stateToToken.contact === ''
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : stateToToken.contact,
        fromChain: changeNetWork(stateFromToken.mainNetwork),
        toChain: changeNetWork(stateToToken.mainNetwork),
        failedReason: error,
        platform: location.host,
        currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
          ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
          : '',
      })
    })
}

//币安跨链桥发币
async function BinanceBridgeExchange(res) {
  const module = await import('web3')
  const Web3 = module.default
  let params = null
  const fromToken = stateFromToken
  const platformAddr = res.data.txData.depositAddress //收币地址
  const fromNumber = res.data.txData.amount //兑换数量
  if (fromToken.contact === '') {
    params = [
      {
        from: state.wallet.address,
        to: platformAddr,
        //gas: '0x76c0', // 30400
        //gasPrice: '0x9184e72a000', // 10000000000000
        value: `0x${(fromNumber * 10 ** fromToken.coinDecimal).toString(16)}`, // 2441406250
      },
    ]
  } else {
    const web3 = new Web3()
    const ethErc20Contract = new web3.eth.Contract(ETH_erc20, fromToken.contact)

    const data = await ethErc20Contract.methods
      .transfer(
        platformAddr,
        `0x${(fromNumber * 10 ** fromToken.coinDecimal).toString(16)}`,
      )
      .encodeABI()
    params = [
      {
        from: state.wallet.address, // Required
        to: fromToken.contact, // Required (for non contract deployments)
        data: data, // Required
        // gasPrice: "0x02540be400", // Optional
        // gas: "0x9c40", // Optional
        //value: `0x`, // Optional
      },
    ]
  }
  if (scope.connectType === 'OKExWallet') {
    mainNetwork = okexchain
  }
  if (scope.connectType === 'OpenBlock') {
    mainNetwork = window.openblock
  } else if (scope.connectType === 'EchoooWallet') {
    mainNetwork = window.echoooEth
  } else if (scope.connectType === 'Nabox') {
    mainNetwork = NaboxWallet
  } else if (scope.connectType === 'ONTO') {
    mainNetwork = ONTO
  } else if (scope.connectType === 'oneKey') {
    mainNetwork = window.$onekey.ethereum
  } else if (scope.connectType === 'CLVWallet') {
    mainNetwork = window.clover
  } else if (scope.connectType === 'Halo') {
    mainNetwork = window.kucoin
  } else if (scope.connectType === 'Crypto') {
    mainNetwork = window.deficonnectProvider
  } else if (scope.connectType === 'Bitget') {
    mainNetwork = window.bitkeep.ethereum
  } else if (scope.connectType === 'Patex') {
    mainNetwork = window.patex.ethereum
  } else {
    mainNetwork = ethereum
  }
  mainNetwork
    .request({
      method: 'eth_sendTransaction',
      params,
    })
    .then((data) => {
      scope.submitStatus = false
      addTransData(data, res.data.txData.id)
      //scope.$store.commit('setFromNumber', '')
    })
    .catch((error) => {
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
    })
}
// 交易
async function exchange(response) {
  console.log(response)
  if (state.isWalletConnect) {
    let transactionParameters = {
      to: response.data.txData.to, // Required except during contract publications.
      from: state.wallet.address, // must match user's active address.
      data: response.data.txData.data,
      value: response.data.txData.value,
    }

    try {
      const result = await WalletConnectProvider.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })

      if (state.info.dex === 'bridgers1') {
        scope.submitStatus = false
        let hashResult = result
        if (state.isWalletConnect) {
          hashResult = {
            hash: result,
          }
        }
        addsSwapTransData(hashResult, response.data.txData.orderId)
      } else {
        scope.submitStatus = false
        scope.dex = 'OmniBridge'
        addTransData(result)
      }
    } catch (error) {
      if (error.code == -32051) {
        Notify({
          message: scope.$t('feeInsufficient', {
            coin: stateFromToken.coinCode,
          }),
          color: '#ad0000',
          background: '#ffe1e1',
        })
      } else {
        Notify({
          message: scope.$t("rejectExchange"),
          color: '#ad0000',
          background: '#ffe1e1',
        })
      }
      console.error('发送代币时出错:', error)
      scope.submitStatus = false
    }
    // try {
    //   const result = await walletConnectprovider.request({
    //     method: 'eth_signTransaction',
    //     params: transactionParameters,
    //   })
    // } catch (error) {
    // }
    return
  }
  //tron 链发币拦截
  if (stateFromToken.mainNetwork === 'TRX' && state.info.dex === 'bridgers1') {
    const tronWeb = window.tronWeb
    let parameter = response.data.txData.parameter
    let options = response.data.txData.options
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
      response.data.txData.tronRouterAddrees,
      response.data.txData.functionName,
      options,
      parameter,
      response.data.txData.fromAddress,
    )
    let signedTx
    try {
      signedTx = await tronWeb.trx.sign(transaction.transaction)
    } catch {
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
    }
    tronWeb.trx
      .sendRawTransaction(signedTx)
      .then((broastTx) => {
        scope.submitStatus = false
        addsSwapTransData({ hash: broastTx.txid })
        //store.commit('setFromNumber', '')
      })
      .catch((error) => {
        Notify({
          message: scope.$t('rejectExchange'),
          color: '#ad0000',
          background: '#ffe1e1',
        })
        failureExchange({
          orderId: '',
          fromAmount: state.info.fromTokenAmount,
          fromCoinCode: stateFromToken.coinCode,
          toAmount: state.toNumber,
          toCoinCode: stateToToken.coinCode,
          hash: '',
          fromAddress:
            changeNetWork(stateFromToken.mainNetwork) === 'TRX'
              ? state.walletTRON
              : state.wallet.address,
          fromTokenAddress:
            stateFromToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateFromToken.contact,
          toTokenAddress:
            stateToToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateToToken.contact,
          fromChain: changeNetWork(stateFromToken.mainNetwork),
          toChain: changeNetWork(stateToToken.mainNetwork),
          failedReason: error,
          platform: location.host,
          currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
            ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
            : '',
        })
      })
    return
  }
  if (stateFromToken.mainNetwork === 'SOL' && state.info.dex === 'bridgers1') {
    const solanaWeb3 = require('@solana/web3.js')

    const connection = new solanaWeb3.Connection(
      scope.$store.state.rpcObject.SOL[0] || 'https://rpc.ankr.com/solana',
      'confirmed',
    )
    const account = scope.connectType == "Phantom" ? await window.solana.connect() : await window.safepal.connect()
    let transaction = new solanaWeb3.Transaction()
    transaction.feePayer = account.publicKey
    let anyTransaction = transaction
    // anyTransaction.instructions = []
    let signers = []
    if (stateFromToken.coinCode == 'SOL' && response.data.txData.signer != '') {
      signers = [
        solanaWeb3.Keypair.fromSecretKey(
          new Uint8Array(response.data.txData.signer.split(',').map(Number)),
        ),
      ]
    }
    //处理数据
    let instructions = response.data.txData.tx
    instructions.forEach((item) => {
      item.keys.forEach((list) => {
        list.pubkey = new solanaWeb3.PublicKey(list.pubkey)
      })
    })
    anyTransaction.instructions = instructions
    anyTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash
    const wallet = new PhantomWalletAdapter()
    wallet._readyState = 'Installed'
    wallet.connect()
    try {
      if (scope.connectType == "Phantom") {

        if (stateFromToken.coinCode == 'SOL') {
          // let signature = await wallet.sendTransaction(anyTransaction, connection, {
          //   signers,
          //   skipPreflight: true,
          //   preflightCommitment: 'confirmed',
          // })
          let { signature } = await window.solana.signAndSendTransaction(anyTransaction)
          scope.submitStatus = false
          addsSwapTransData({ hash: signature })
        } else {
          let { signature } = await window.solana.signAndSendTransaction(anyTransaction)
          scope.submitStatus = false
          addsSwapTransData({ hash: signature })
        }
        return
      } else if (scope.connectType == 'SafePal(SOL)') {
        let { signature } = await window.safepal.signAndSendTransaction(anyTransaction);
        scope.submitStatus = false
        scope.dex = 'OmniBridge'
        addsSwapTransData({ hash: signature })
      }
    } catch (err) {
      console.log(err)
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
      failureExchange({
        orderId: '',
        fromAmount: state.info.fromTokenAmount,
        fromCoinCode: stateFromToken.coinCode,
        toAmount: state.toNumber,
        toCoinCode: stateToToken.coinCode,
        hash: '',
        fromAddress:
          changeNetWork(stateFromToken.mainNetwork) === 'TRX'
            ? state.walletTRON
            : state.wallet.address,
        fromTokenAddress:
          stateFromToken.contact === ''
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : stateFromToken.contact,
        toTokenAddress:
          stateToToken.contact === ''
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : stateToToken.contact,
        fromChain: changeNetWork(stateFromToken.mainNetwork),
        toChain: changeNetWork(stateToToken.mainNetwork),
        failedReason: err,
        platform: location.host,
        currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
          ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
          : '',
      })
    }
    return
  }
  if (
    stateFromToken.mainNetwork === 'APT' &&
    state.info.dex === 'bridgers1' &&
    state.wallet.connectType === 'Petra'
  ) {
    const payload = {
      type: response.data.txData.type,
      function: response.data.txData.function,
      type_arguments: response.data.txData.type_arguments,
      arguments: response.data.txData.arguments,
    }
    try {
      const transactionRes = await window.aptos.signAndSubmitTransaction(
        payload,
      )
      scope.submitStatus = false
      scope.dex = 'OmniBridge'
      addsSwapTransData({ hash: transactionRes.hash })
      //store.commit('setFromNumber', '')
    } catch (err) {
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
    }
    return
  }
  if (
    stateFromToken.mainNetwork === 'APT' &&
    state.info.dex === 'bridgers1' &&
    state.wallet.connectType === 'MSafe'
  ) {
    const payload = {
      type: response.data.txData.type,
      function: response.data.txData.function,
      type_arguments: response.data.txData.type_arguments,
      arguments: response.data.txData.arguments,
    }
    let msafe = null
    if (window.msafe) {
      msafe = window.msafe
    } else {
      msafe = await MsafeWallet.new('https://app.m-safe.io')
    }
    const option = {
      sender: state.wallet.address,
      sequence_number: '1',
      max_gas_amount: '4000',
      gas_unit_price: '100',
      // Unix timestamp, in seconds + 30 days
      expiration_timestamp_secs: (
        Math.floor(Date.now() / 1000) +
        30 * 24 * 3600
      ).toString(),
    }
    try {
      await msafe.signAndSubmit(payload, option)
    } catch (err) {
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
    }
    return
  }
  if (stateFromToken.mainNetwork === 'SUI' && state.info.dex === 'bridgers1') {
    let hash
    if (state.wallet.connectType == 'OKExWalletSui') {
      hash = await suiOKXWalletMethods.bridgersTransfer(response.data.txData)
    } else {
      hash = await suiWalletMethods.bridgersTransfer(response.data.txData)
    }
    if (hash) {
      scope.submitStatus = false
      let hashResult = {
        hash: hash,
      }
      addsSwapTransData(hashResult, response.data.txData.orderId)
    } else {
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
    }
    return
  }
  let transactionParameters = {
    to: response.data.txData.to, // Required except during contract publications.
    from: state.wallet.address, // must match user's active address.
    data: response.data.txData.data,
    value: response.data.txData.value,
    //gasPrice: 5000000000, // 6 gwei
    //gas: new BigNumber(1000000), // 1000000
  }
  if(state.wallet.connectType === 'JoyIDWallet' && state.info.dex === 'bridgers1'){
    const result = await joyIdMethids.send(transactionParameters)
    if(result){
      scope.submitStatus = false
      const hashResult = {
        hash: result.hash,
      }
      console.log(hashResult)
      addsSwapTransData(hashResult, response.data.txData.orderId)
    }else{
      scope.submitStatus = false
      Notify({
        message: scope.$t('rejectExchange'),
        color: '#ad0000',
        background: '#ffe1e1',
      })
      return
    }
    return 
  }
  if (response.data.txData.gas && response.data.txData.gas != '') {
    transactionParameters.gasLimit = response.data.txData.gas
  }
  if (
    stateFromToken.mainNetwork == 'HECO' ||
    stateFromToken.mainNetwork == 'POLYGON'
  ) {
    const module = await import('web3')
    const Web3 = module.default
    const web3 = new Web3(mainNetwork)
    const gasLimit = await web3.eth.estimateGas(transactionParameters)
    transactionParameters.gasLimit = gasLimit * 2

  }

  signer
    .sendTransaction(transactionParameters)
    .then((res) => {
      if (state.info.dex === 'CBridge') {
        const params = {
          amount: transferData.amount,
          token: cBridgeInfo.token,
          senderAddr: transferData.userAddr,
          transferOutId: transferData.transferOutId,
          transferInId: transferData.transferInId,
          fromChainId: cBridgeInfo.fromChainId,
          toChainId: cBridgeInfo.toChainId,
          relayNodeAddr: cBridgeInfo.relayNodeAddr,
          fee: cBridgeInfo.feeAmount,
          jwt: cBridgeInfo.jwt,
          hashlockTime: transferData.hashLockTime,
        }
        baseApi.makerTransferOut(params).then((result) => {
          scope.submitStatus = false
          addTransData(res.hash, false, transferData)
          //scope.$store.commit('setFromNumber', '')
          //scope.$store.commit('setAddress', '')
        })
      } else if (state.info.dex === 'bridgers1') {
        scope.submitStatus = false
        let hashResult = res
        if (state.isWalletConnect) {
          hashResult = {
            hash: res,
          }
        }
        addsSwapTransData(hashResult, response.data.txData.orderId)
        //store.commit('setFromNumber', '')
      } else if (state.info.dex === 'bridgers2') {
        scope.submitStatus = false
        updatebridgers2DataAndStatus(res, response.data.txData.orderId)
        //store.commit('setFromNumber', '')
      } else {
        scope.submitStatus = false
        scope.dex = 'OmniBridge'
        addTransData(res.hash)
        //store.commit('setFromNumber', '')
        //store.commit('setAddress', '')
      }
    })
    .catch((error) => {
      console.log(error)
      scope.submitStatus = false
      if (error.code === 4200) {
        failureExchange({
          orderId: '',
          fromAmount: state.info.fromTokenAmount,
          fromCoinCode: stateFromToken.coinCode,
          toAmount: state.toNumber,
          toCoinCode: stateToToken.coinCode,
          hash: '',
          fromAddress:
            changeNetWork(stateFromToken.mainNetwork) === 'TRX'
              ? state.walletTRON
              : state.wallet.address,
          fromTokenAddress:
            stateFromToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateFromToken.contact,
          toTokenAddress:
            stateToToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateToToken.contact,
          fromChain: changeNetWork(stateFromToken.mainNetwork),
          toChain: changeNetWork(stateToToken.mainNetwork),
          failedReason: error.message,
          platform: location.host,
          currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
            ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
            : '',
        })
        return Notify({
          message: error.message,
          color: '#ad0000',
          background: '#ffe1e1',
        })
      }
      const utm_source = localStorage.getItem('utm_source')
      if (utm_source == 'tokenpocket') {
        //tp 钱包报错回调
        if (error.message == 'cancel') {
          Notify({
            message: scope.$t('rejectExchange'),
            color: '#ad0000',
            background: '#ffe1e1',
          })
        } else {
          Notify({
            message: error.message,
            color: '#ad0000',
            background: '#ffe1e1',
          })
        }
        return
      }

      if (error === 'error' || error.message == 'Canceled') {
        Notify({
          message: scope.$t('rejectExchange'),
          color: '#ad0000',
          background: '#ffe1e1',
        })
        return
      }
      if (error.code === 4001 || error.code == 'ACTION_REJECTED') {
        Notify({
          message: scope.$t('rejectExchange'),
          color: '#ad0000',
          background: '#ffe1e1',
        })
        return
      }

      if (error.code === -32603) {
        failureExchange({
          orderId: '',
          fromAmount: state.info.fromTokenAmount,
          fromCoinCode: stateFromToken.coinCode,
          toAmount: state.toNumber,
          toCoinCode: stateToToken.coinCode,
          hash: '',
          fromAddress:
            changeNetWork(stateFromToken.mainNetwork) === 'TRX'
              ? state.walletTRON
              : state.wallet.address,
          fromTokenAddress:
            stateFromToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateFromToken.contact,
          toTokenAddress:
            stateToToken.contact === ''
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : stateToToken.contact,
          fromChain: changeNetWork(stateFromToken.mainNetwork),
          toChain: changeNetWork(stateToToken.mainNetwork),
          failedReason: error.message,
          platform: location.host,
          currentNode: scope.$store.state.rpcObject[stateFromToken.mainNetwork]
            ? scope.$store.state.rpcObject[stateFromToken.mainNetwork][0]
            : '',
        })
        //流动性不足
        if (error.data && error.data.code === 3) {
          Notify({
            message: scope.$t('notEnough'),
            color: '#ad0000',
            background: '#ffe1e1',
          })
          return
        }
        //gas 费不足
        if (error.data && error.data.code === -32000) {
          Notify({
            message: scope.$t('notEnoughGas'),
            color: '#ad0000',
            background: '#ffe1e1',
          })
          return
        }
      }
    })
}
//bridgers1 插入记录
function addsSwapTransData(data, orderId) {
  const amountOutMin = new BigNumber(state.info.amountOutMin)
  const utmSource = localStorage.getItem('utm_source')
  const params = {
    // orderId: orderId, //   订单号
    hash: data.hash, //  用户存币哈希
    fromTokenAddress:
      stateFromToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateFromToken.contact,
    toTokenAddress:
      stateToToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateToToken.contact,
    fromAddress:
      stateFromToken.mainNetwork === 'TRX'
        ? state.walletTRON
        : state.wallet.address,
    toAddress: state.address,
    fromTokenChain: changeNetWork(stateFromToken.mainNetwork),
    toTokenChain: changeNetWork(stateToToken.mainNetwork),
    fromTokenAmount: state.info.fromTokenAmount,
    amountOutMin:
      toNonExponential(amountOutMin).toString() > 0
        ? toNonExponential(amountOutMin, 'parseInt')
        : toNonExponential(amountOutMin),
    fromCoinCode: stateFromToken.coinCode,
    toCoinCode: stateToToken.coinCode,
    utmSource: utmSource,
  }
  baseApi.updateDataAndStatus(params).then(async (res) => {
    if (res.resCode == '100') {
      scope.$refs.dialogConfirm.show = false
      store.commit('setInfo', null)
      const orderRes = await baseApi.getTransDataById({
        orderId: res.data.orderId,
      })
      if (orderRes.resCode == '100') {
        let data = orderRes.data
        scope.$set(data, 'orderdetailStatus', orderStatus(data.status))
        scope.$set(data, 'beginDate', data.createTime)
        scope.$set(data, 'isNft', '')
        scope.$set(data, 'detailState', data.status)
        scope.$set(data, 'fromCoinAmt', data.fromTokenAmount)
        scope.$set(data, 'toCoinAmt', data.toTokenAmount)
        scope.$set(data, 'refundAddr', data.fromAddress)
        scope.$set(data, 'destinationAddr', data.toAddress)
        scope.$set(data, 'depositCoinCode', data.fromCoinCode)
        scope.$set(data, 'depositCoinAmt', data.fromCoinAmt)
        scope.$set(data, 'receiveCoinAmt', data.toCoinAmt)
        scope.$set(data, 'receiveCoinCode', data.toCoinCode)
        scope.$set(data, 'depositTxid', data.hash)
        scope.$set(data, 'transactionId', data.toHash)
        scope.$set(data, 'router', {
          router: 'bridgers1',
        })
        scope.$bus.emit('clearAddress')
        scope.$bus.emit('queryAllTradeHandle')
        store.commit('setSwapConfirm', false)
        scope.confirmHandle({ data: data })
      }
    }
  })
}
//bridgers2 插入记录
function updatebridgers2DataAndStatus(data, orderId) {
  const amountOutMin = new BigNumber(state.info.amountOutMin)
  const params = {
    // orderId: orderId, //   订单号
    hash: data.hash, //  用户存币哈希
    fromTokenAddress:
      stateFromToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateFromToken.contact,
    toTokenAddress:
      stateToToken.contact === ''
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : stateToToken.contact,
    fromAddress: state.wallet.address,
    toAddress: state.address,
    fromTokenChain: changeNetWork(stateFromToken.mainNetwork),
    toTokenChain: changeNetWork(stateToToken.mainNetwork),
    fromTokenAmount: state.info.fromTokenAmount,
    amountOutMin:
      toNonExponential(amountOutMin).toString() > 0
        ? toNonExponential(amountOutMin, 'parseInt')
        : toNonExponential(amountOutMin),
    fromCoinCode: stateFromToken.coinCode,
    toCoinCode: stateToToken.coinCode,
    slippage: state.slidingPoint, //滑点
  }
  baseApi.updatebridgers2DataAndStatus(params).then(async (res) => {
    if (res.resCode == '100') {
      scope.$refs.dialogConfirm.show = false
      store.commit('setInfo', null)
      const orderRes = await baseApi.getbridgers2TransDataById({
        orderId: res.data.orderId,
      })
      if (orderRes.resCode == '100') {
        let data = orderRes.data
        scope.$set(data, 'orderdetailStatus', orderStatus(data.status))
        scope.$set(data, 'beginDate', data.createTime)
        scope.$set(data, 'isNft', '')
        scope.$set(data, 'detailState', data.status)
        scope.$set(data, 'fromCoinAmt', data.fromTokenAmount)
        scope.$set(data, 'toCoinAmt', data.toTokenAmount)
        scope.$set(data, 'refundAddr', data.fromAddress)
        scope.$set(data, 'destinationAddr', data.toAddress)
        scope.$set(data, 'depositCoinCode', data.fromCoinCode)
        scope.$set(data, 'depositCoinAmt', data.fromCoinAmt)
        scope.$set(data, 'receiveCoinAmt', data.toCoinAmt)
        scope.$set(data, 'receiveCoinCode', data.toCoinCode)
        scope.$set(data, 'depositTxid', data.hash)
        scope.$set(data, 'transactionId', data.toHash)
        scope.$set(data, 'router', {
          router: 'bridgers2',
        })
        scope.$bus.emit('clearAddress')
        scope.$bus.emit('queryAllTradeHandle')
        store.commit('setSwapConfirm', false)
        scope.confirmHandle({ data: data })
      }
    }
  })
}

//解析订单状态
function orderStatus(str) {
  let statusData = [
    scope.$t('wait_deposit_send'),
    '#707B9E',
    1,
    'loading',
    false,
  ]
  switch (str) {
    case 'wait_deposits':
      statusData[0] = scope.$t('wait_deposit_send') //wait_deposit_send   等待存币
      statusData[1] = '#707B9E'
      statusData[2] = 1
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_deposit_send_fail':
      statusData[0] = scope.$t('deposit_failed') //wait_deposit_send_fail  存币失败
      statusData[1] = '#FF8484'
      statusData[2] = 1
      statusData[3] = false
      statusData[4] = true
      break
    case 'wait_deposit_send_error':
      statusData[0] = scope.$t('trade_fail') //wait_deposit_send_error   存币失败
      statusData[1] = '#FF8484'
      statusData[2] = 1
      statusData[3] = false
      statusData[4] = true //是否是最终状态
      break
    case 'wait_detect':
      statusData[0] = scope.$t('wait_deposit_send') //NFT接口  等待存币
      statusData[1] = '#707B9E'
      statusData[2] = 1
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'exchange':
      statusData[0] = scope.$t('exchangeIng') //wait_deposit_send   兑换中
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_exchange':
      statusData[0] = scope.$t('exchangeIng') //NFT接口 交换中
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'trade_fail':
      statusData[0] = scope.$t('trade_fail') //wait_deposit_send   兑换失败
      statusData[1] = '#FF8484'
      statusData[2] = 2
      statusData[3] = false
      statusData[4] = true //是否是最终状态
      break
    case 'fail':
      statusData[0] = scope.$t('trade_fail') //wait_deposit_send   兑换失败
      statusData[1] = '#FF8484'
      statusData[2] = 2
      statusData[3] = false
      statusData[4] = true //是否是最终状态
      break
    case 'wait_deposit_send':
      statusData[0] = scope.$t('wait_deposit_send') //wait_deposit_send   等待存币
      statusData[1] = '#707B9E'
      statusData[2] = 1
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_receive_send':
      statusData[0] = scope.$t('wait_receive_send') //wait_receive_send  等待发币
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_send':
      statusData[0] = scope.$t('wait_receive_send') //linknft 等待发币
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_receive_confirm':
      statusData[0] = scope.$t('wait_receive_confirm') //wait_receive_confirm  等待发币确认
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_refund_send':
      statusData[0] = scope.$t('wait_refund_send') //wait_refund_send  等待退币
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_refund':
      statusData[0] = scope.$t('wait_refund_send') //linknft 等待退币
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break

    case 'wait_exchange_return':
      statusData[0] = scope.$t('exchangeIng') //wait_exchange_return  等待交换结果
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_exchange_push':
      statusData[0] = scope.$t('exchangeIng') //wait_exchange_push  等待交换推送
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_for_information':
      statusData[0] = scope.$t('exchangeIng') // wait_for_information   等待用户联系
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'receive_complete':
      statusData[0] = scope.$t('receive_complete') // receive_complete   发币完成
      statusData[1] = '#1eb740'
      statusData[2] = 4
      statusData[3] = true
      statusData[4] = true //是否是最终状态
      break
    case 'complete':
      statusData[0] = scope.$t('receive_complete')
      statusData[1] = '#1eb740'
      statusData[2] = 4
      statusData[3] = true
      statusData[4] = true //是否是最终状态
      break
    case 'refund_complete':
      statusData[0] = scope.$t('refund_complete') // refund_complete   退币完成
      statusData[1] = '#1eb740'
      statusData[2] = 2
      statusData[3] = true
      statusData[4] = true //是否是最终状态
      break
    case 'fail':
      statusData[0] = scope.$t('refund_complete') // linknft 交易失败已退币   退币完成
      statusData[1] = '#1eb740'
      statusData[2] = 2
      statusData[3] = false
      statusData[4] = true //是否是最终状态
      break
    case 'refund_sending':
      statusData[0] = scope.$t('refund_sending') // refund_sending   即将退币
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_kyc':
      statusData[0] = scope.$t('exchangeIng') //  wait_kyc  需要kyc   WAIT_KYC
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'timeout':
      statusData[0] = scope.$t('timeout') // timeout   超时
      statusData[1] = '#FF8484'
      statusData[2] = 1
      statusData[3] = false
      statusData[4] = true //是否是最终状态
      break
    case 'wait_refund_confirm':
      statusData[0] = scope.$t('wait_refund_confirm') //wait_refund_confirm  等待退币确认
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_partial_send':
      statusData[0] = scope.$t('wait_partial_send') //部分成交发币中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_partial_send_confirm':
      statusData[0] = scope.$t('wait_partial_send_confirm') // 部分成交发币确认中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_partial_refund':
      statusData[0] = scope.$t('wait_partial_refund') //部分成交退币中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_partial_refund_confirm':
      statusData[0] = scope.$t('wait_partial_refund_confirm') //部分成交退币确认中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'partial_complete':
      statusData[0] = scope.$t('partial_complete') //完成
      statusData[1] = '#1eb740'
      statusData[2] = 4
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'complete':
      statusData[0] = scope.$t('receive_complete') //NFT接口 完成
      statusData[1] = '#1eb740'
      statusData[2] = 4
      statusData[3] = true
      statusData[4] = true //是否是最终状态
      break
    case 'wait_partial_send_confirm_error':
      statusData[0] = scope.$t('wait_partial_send_confirm_error') //部分成交发币确认中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    case 'wait_partial_refund_confirm_error':
      statusData[0] = scope.$t('wait_partial_refund_confirm_error') //部分成交退币确认中…
      statusData[1] = '#707B9E'
      statusData[2] = 3
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
      break
    default:
      statusData[0] = scope.$t('exchangeIng')
      statusData[1] = '#707B9E'
      statusData[2] = 2
      statusData[3] = 'loading'
      statusData[4] = false //是否是最终状态
  }
  return statusData
}
//插入记录
function addTransData(hash, orderId, transferData) {
  let sss = {
    depositCoinAmt:
      state.info.fromTokenAmount / 10 ** state.info.fromTokenDecimal,
    depositCoinCode: stateFromToken.coinCode,
    receiveCoinAmt: state.info.toTokenAmount,
    receiveCoinCode: stateToToken.coinCode,
    destinationAddr: state.address,
    refundAddr: state.wallet.address,
    transactionId: hash,
    router: state.info.dex,
    fromTokenChain: stateFromToken.mainNetwork,
    toTokenChain: stateToToken.mainNetwork,
    timestamp: new Date().getTime(),
    sourceType: 'H5',
    equipmentNo: getEquipmentNo(state.wallet.address),
  }
  let params = {
    depositCoinAmt:
      state.info.fromTokenAmount / 10 ** state.info.fromTokenDecimal,
    depositCoinCode: stateFromToken.coinCode,
    receiveCoinAmt: state.info.toTokenAmount,
    receiveCoinCode: stateToToken.coinCode,
    destinationAddr: state.address,
    refundAddr: state.wallet.address,
    transactionId: hash,
    router: state.info.dex,
    fromTokenChain: stateFromToken.mainNetwork,
    toTokenChain: stateToToken.mainNetwork,
    timestamp: new Date().getTime(),
    sourceType: 'H5',
    sign: md5Handle(sss),
    equipmentNo: getEquipmentNo(state.wallet.address),
  }
  baseApi.uploadPathRecord(params).then((res) => {
    scope.$refs.dialogConfirm.show = false
    store.commit('setInfo', null)
    scope.$bus.emit('clearAddress')
    scope.$bus.emit('queryAllTradeHandle')
    store.commit('setSwapConfirm', false)
    scope.confirmHandle(res)
  })
}

//设备号
function getEquipmentNo(address) {
  let equipmentNo = ''
  if (address.length <= 32) {
    let n = 32 - address.length
    for (let i = 0; i < n; i++) {
      equipmentNo += 'x'
    }
    equipmentNo += address
  } else {
    equipmentNo = address.slice(0, 32)
  }
  return equipmentNo
}
// 判断是否需要approve授权
async function isApproved(res) {
  //主币不需要授权
  if (
    stateFromToken.contact === '' ||
    stateFromToken.contact === '0x2::sui::SUI'
  ) {
    //不需要授权
    exchange(res)
  } else {
    if (stateFromToken.mainNetwork === 'TRX') {
      let tronWeb = window.tronWeb
      let contract
      if (stateFromToken.contact == 'TMz2SWatiAtZVVcH2ebpsbVtYwUPT9EdjH') {
        contract = await tronWeb.contract(tronAbi, stateFromToken.contact)
      } else {
        contract = await tronWeb.contract().at(stateFromToken.contact)
      }
      const allowance = contract.allowance(state.walletTRON, res.data.txData.to)
      const allowAmt = await allowance.call()
      const num = new BigNumber(
        ethers.utils.formatUnits(
          allowAmt.remaining || allowAmt,
          stateFromToken.coinDecimal,
        ),
      )
      const fromTokenNum = new BigNumber(state.fromNumber)
      if (num.gte(fromTokenNum)) {
        exchange(res)
      } else {
        scope.txData = res
        scope.$refs.approve.$refs.dialog.show = true
      }
      return
    }
    if (stateFromToken.mainNetwork === 'SOL') {
      exchange(res)
      return
    }
    if (stateFromToken.mainNetwork === 'SUI') {
      exchange(res)
      return
    }
    if (stateFromToken.mainNetwork === 'APT') {
      exchange(res)
      return
    }
    if(state.wallet.connectType == 'JoyIDWallet'){
      const result = await joyIdMethids.isApprove(res.data.txData.to)
      if(result){
        exchange(res)
      }else{
        scope.txData = res
        scope.$refs.approve.$refs.dialog.show = true
      }
      console.log(result)
      return
    }
    let contract
    if (state.wallet.connectType == 'walletConnect') {
      const module = await import('web3')
      const Web3 = module.default
      const web3Provider = new Web3.providers.HttpProvider(
        state.rpcObject[state.fromToken.mainNetwork][0],
      )
      const web3 = new Web3(web3Provider)
      contract = new web3.eth.Contract(ETH_erc20, state.fromToken.contact)
    } else {
      contract = await getContractAll(stateFromToken.contact, true)
    }

    const a = await contract.methods.allowance(
      state.wallet.address,
      res.data.txData.to,
    )
    a.call()
      .then((allowAmt) => {
        const num = new BigNumber(
          ethers.utils.formatUnits(allowAmt, stateFromToken.coinDecimal),
        )
        const fromTokenNum = new BigNumber(state.fromNumber)
        if (num.gte(fromTokenNum)) {
          exchange(res)
        } else {
          scope.txData = res
          scope.$refs.approve.$refs.dialog.show = true
        }
      })
      .catch((err) => {
        Notify({
          message: scope.$t('notEnough'),
          color: '#ad0000',
          background: '#ffe1e1',
        })
        scope.submitStatus = false
      })
  }
}

//科学计数法转字符串
function toNonExponential(num, type) {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  if (type === 'parseInt') {
    let str = num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    if (str.indexOf('.') === -1) {
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    } else {
      return str.substring(0, str.indexOf('.'))
    }
  } else {
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  }
}
//主网络修改
function changeNetWork(network) {
  if (network === 'AVAXC') {
    return 'AVALANCHE'
  } else if (network === 'FTM') {
    return 'FANTOM'
  } else if (network === 'ARB') {
    return 'ARBITRUM'
  } else if (network === 'SOL') {
    return 'SOLANA'
  } else if (network === 'opBNB' || network === 'zkEVM') {
    return network
  } else {
    return network.toUpperCase()
  }
}
export default { pathBridgeExchange, exchange }
