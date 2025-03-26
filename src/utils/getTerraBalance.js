
import axios from 'axios'
import BigNumber from 'bignumber.js'

const getTerraBalanceHandle = async function(coin,address){
    let balance = 0
    //主币余额
    if(coin.contact === ''){
        const bankBalanceQuery = `query($address: String) {
            BankBalancesAddress(Address: $address) {
              Result {
                Amount
                Denom
              }
            }
          }
        `
        const res = await axios.post('https://mantle.terra.dev',{
            query:bankBalanceQuery,
            variables:JSON.stringify({address: address})
          })
        if(res.data){
            const result = res.data.BankBalancesAddress ? res.data.BankBalancesAddress.Result : []
            if(result.length > 0){
                balance = (result[0].Amount/1000000).toFixed(6, BigNumber.ROUND_DOWN)
            }
        }else{
            balance = 0
        }
        return balance
    }
   
}
export default getTerraBalanceHandle