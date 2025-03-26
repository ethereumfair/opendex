//  获取DOT,CRU,DBC余额
import store from '../store'
import { ApiPromise, WsProvider, Uint8Array } from '@polkadot/api'
import { typesBundleForPolkadot } from '@crustio/type-definitions'
import axios from 'axios'
const getPolkadotBalance = async (coin) => {
  const account = store.state.walletPolkadot
  let wsProvider = null
  let api = null
  let dotApi = null
  let cruApi = null
  let dbcApi = null
  let freeBalance = 0
  if (coin.mainNetwork === 'CRU' && !cruApi) {
    wsProvider = new WsProvider('wss://rpc.crust.network')
    cruApi = await ApiPromise.create({
      provider: wsProvider,
      typesBundle: typesBundleForPolkadot,
    })
  }
  if (coin.mainNetwork === 'DBC' && !dbcApi) {
    wsProvider = new WsProvider('wss://info.dbcwallet.io')
    dbcApi = await ApiPromise.create({ provider: wsProvider })
  }
  if (coin.mainNetwork === 'DOT' && !dotApi) {
    wsProvider = new WsProvider('wss://rpc.polkadot.io')
    dotApi = await ApiPromise.create({ provider: wsProvider })
  }
  let acctNet = account.addrSS58
  if (coin.mainNetwork === 'CRU') {
    acctNet = account.addrSS58CRU
    api = cruApi
  } else if (coin.mainNetwork === 'DBC') {
    api = dbcApi
    acctNet = account.addrSS58DBC
  } else {
    api = dotApi
  }

  if(coin.contact==''){
    await api.query.system.account(acctNet).then((resAcct) => {
      freeBalance = resAcct.data.free.toString(10)
    })
  }else{
    const params = {
      address: acctNet,
    }
    const result = await axios.post(
      'https://polkadot.webapi.subscan.io/api/scan/multiChain/account',
      params,
    )
    let list
    if(result.data){
      list = result.data.filter(
        (item) => item.asset_id == coin.contact
      )
    }
    freeBalance = list[0].balance
  }
  return freeBalance
}
export default getPolkadotBalance
