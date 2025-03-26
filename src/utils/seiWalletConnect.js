import { Notify } from 'vant'
import store from '../store/index'
import { COMPASS_WALLET,getQueryClient } from "@sei-js/core"
const chainIdSEI = 'pacific-1'
const seiConnectHandle =async($scope) => {
  
  if (!window.compass) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'Compass Wallet',
      }),
    })
  }
  
  const connectReslut =   await COMPASS_WALLET.connect(chainIdSEI);

  const accounts = await COMPASS_WALLET.getAccounts(chainIdSEI);
    if(accounts.length>0){
      $scope.wallet = 'Compass'
      store.commit('setChainId', '1333')
      store.commit('setWalletAddress', accounts[0].address)
      store.commit('setWalletName', 'Compass')
      store.commit('setWalletConnectType', 'Compass')
      $scope.$refs.dialog.show = false
      localStorage.setItem('connectorId', 'Compass')
    }
}
const getSEIBalance =async()=>{
  
  const REST_URL ='https://celatone-api.alleslabs.dev/rest/sei/pacific-1/'
  const address = store.state.wallet.address
  const queryClient = await getQueryClient(REST_URL);
  const balances = await queryClient.cosmos.bank.v1beta1.allBalances({ address });
  console.log(balances)
  return balances.balances[0].amount

}

export default {
  seiConnectHandle,
  getSEIBalance
} 
