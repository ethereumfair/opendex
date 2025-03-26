import store from '../store/index'
import { Notify } from 'vant'
let tp = null
let isTP = false
try {
  tp = require('tp-js-sdk')
  isTP = tp.isConnected()
} catch (error) {
  console.log(error)
}

async function getDogeBalance() {
  if (isTP) {
    const Balance = await tp.getCurrentBalance()
    return Balance.data.balance
  }
}
export default getDogeBalance
