import store from '../store/index'
import axios from 'axios'

async function getFILBalance() {
  const params = {
    jsonrpc: '2.0',
    id: 1,
    method: 'Filecoin.WalletBalance',
    params: [store.state.wallet.address],
  }

  const balance = await axios.post('https://filecoin.maiziqianbao.net', params)
  return balance.result
}

export default getFILBalance
