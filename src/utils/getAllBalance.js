import store from '../store/index'
import BigNumber from 'bignumber.js'
import axios from 'axios'
// import Web3 from 'web3'
import ETH_erc20 from '../utils/eth-erc20'
import { supportNetWork } from '../config/index'
const wallet = store.state.wallet
const isArray = (something) => {
  return Object.prototype.toString.call(something) === '[object Array]'
}
export default async function getAllBalance(list, key) {
  if (wallet.address === '') return
  const netWork = supportNetWork.find((e) => {
    return e.netWork === key
  })
  if (netWork === undefined) return
  if (list[0].mainNetwork == 'EOS(EVM)') {
    let result = []
    const Web3 = require('web3')
    const rpcApi = new Web3(netWork.rpcUrl)
    const balance = await rpcApi.eth.getBalance(wallet.address)
    result.push({
      result: balance,
    })
    return result
  }
  if (list[0].mainNetwork == 'CFX') {
    const resultCFX = await axios.get('https://evmapi.confluxscan.net/api?module=account&action=balance&address=' + wallet.address + '&tag=latest_state')
    const balanceCFX = Number(resultCFX.result)
    if (balanceCFX == '0x0') {
      return 0
    } else {
      return (balanceCFX / 10 ** list[0].coinDecimal).toFixed(6) - 0
    }

  }
  const api =
    store.state.rpcObject[netWork.netWork] &&
      store.state.rpcObject[netWork.netWork][0]
      ? store.state.rpcObject[netWork.netWork][0]
      : netWork.rpcUrl
  const params = await getParams(list) //请求参数
  if (params.length < 100) {
    const result = await new Promise(function (resolve, reject) {
      axios.post(api, params).then((response) => {
        // 列表插入余额
        resolve(response)
      })
    })
    return isArray(result) ? result : [result]
  } else {
    const params1 = params.slice(0, 100)
    const params2 = params.slice(100)
    const resut1 = await axios.post(api, params1)
    const resut2 = await axios.post(api, params2)
    return [...resut1, ...resut2]
  }
}
function setBalance(key, list, response) {
  list.forEach((element, index) => {
    let balance = new BigNumber(response[index].result)
      .shiftedBy(-element.decimals)
      .toFixed()
    //balance > 0 && (balance = Number(balance).toFixed(8))
    element.balance = balance
  })

  store.state.coinList[key] = list
}
async function getParams(list) {
  const module = await import('web3')
  const Web3 = module.default
  const web3 = new Web3()
  let params = new Array(list.length)
  list.forEach(async (coin, index) => {
    let methodNameEvm = 'eth_getBalance'
    let methodNameEvmDaibi = 'eth_call'
    if (list[0].mainNetwork == 'KLAY') {
      methodNameEvm = 'klay_getBalance'
      methodNameEvmDaibi = 'klay_call'
    }

    // 获取主链余额
    //AME 主网币合约地址 0x26d5ca2dE2005F42A8B0C785c723E3e286b77cDF
    //KCC 主网币KCS合约地址 "0xc333b0fe43e642b770c54438a967a5f9e084edee"
    if (
      coin.contact === '' ||
      (list[0].mainNetwork == 'AME' &&
        coin.contact === '0x26d5ca2dE2005F42A8B0C785c723E3e286b77cDF') ||
      (list[0].mainNetwork == 'KCC' &&
        coin.contact === '0xc333b0fe43e642b770c54438a967a5f9e084edee')
    ) {
      params[index] = {
        id: 1,
        jsonrpc: '2.0',
        method: methodNameEvm,
        params: [wallet.address, 'latest'],
      }
    }
    if (coin.mainNetwork == 'XDC') {
      //xdc 替换合约地址前缀
      coin.contact = coin.contact.replace(/xdc/, '0x')
    }

    if (
      coin.contact !== '' &&
      coin.contact !== '0x26d5ca2dE2005F42A8B0C785c723E3e286b77cDF' &&
      coin.contact !== '0xc333b0fe43e642b770c54438a967a5f9e084edee'
    ) {
      const ethErc20Contract = new web3.eth.Contract(ETH_erc20, coin.contact)
      const data = await ethErc20Contract.methods
        .balanceOf(wallet.address)
        .encodeABI()

      params[index] = {
        id:
          coin.mainNetwork === 'FTM' ||
            coin.mainNetwork === 'Optimism' ||
            coin.mainNetwork === 'POLYGON' ||
            coin.mainNetwork === 'BSC' ||
            coin.mainNetwork === 'AVAXC' ||
            coin.mainNetwork === 'ARB'
            ? '1' + index
            : 1,
        jsonrpc: '2.0',
        method: methodNameEvmDaibi,
        params: [
          {
            data: data,
            from: wallet.address,
            to: coin.contact,
          },
          'latest',
        ],
      }
    }
  })
  return params
}
