import { Notify } from 'vant'
import store from '../store/index'
const PetraConnectHandle = ($scope) => {
  if (!window.aptos) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'Petra',
      }),
    })
  }
  connect($scope)
}
async function connect($scope) {
  const wallet = window.aptos;
  try {
      const response = await wallet.connect();

      const account = await wallet.account();
      if(account){
        $scope.wallet = 'Petra'
        store.commit('setChainId', '072611')
        store.commit('setWalletAddress', account.address)
        store.commit('setWalletName', 'Petra')
        store.commit('setWalletConnectType', 'Petra')
        $scope.$refs.dialog.show = false
        //存储钱包已连接
        localStorage.setItem('connectorId', 'Petra')
      }
    
  } catch (error) {
     
  }
}
export default PetraConnectHandle
