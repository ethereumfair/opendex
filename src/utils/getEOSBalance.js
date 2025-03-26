//  获取EOS 及 代币余额
import axios from 'axios'
import store from '../store'
const getEOSBalance = async (coin) => {
    const address = store.state.wallet.address
    let balance = '0'
    let coinCode,contact
    //判断是否是代币 定义coinCode
    if(coin.contact === ''){ //主币
        contact = 'eosio.token'
        coinCode = 'EOS'
    }else {
        coinCode = coin.coinCode.replace("(EOS)","")
        contact = coin.contact
    }
    const result = await axios.post('https://eos.greymass.com/v1/chain/get_currency_balance',{
        account: address,
        code: contact,
        symbol: coinCode,
    })
    if(result.length > 0){
        balance = result[0].replace(' '+coinCode,"")
    }
    return balance
}
export default getEOSBalance