import { Notify } from 'vant'
import store from '../store/index'
const BTCUnisatConnectHandle = ($scope) => {
  //判断是否安装Unisat插件
  if (!window.unisat) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'UniSat Wallet',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'Unisat') {
    return ($scope.$refs.dialog.show = false)
  }
  connect($scope)
}
async function connect($scope) {
  let accounts = await window.unisat.requestAccounts()
  //  let resNet = await window.unisat.getNetwork()
  if (accounts) {
    $scope.wallet = 'Unisat'
    store.commit('setWalletAddress', accounts[0])
    store.commit('setWalletName', 'Unisat')
    store.commit('setWalletConnectType', 'Unisat')
    store.commit('setChainId', '1994')
    $scope.$refs.dialog.show = false
    //存储钱包已连接
    // localStorage.setItem('connectorId', 'Unisat')
   
    // try {
    //   let txid = await unisat.sendInscription('34No7UxSxjdjznj2MLCySQWzmhW47Bxw5D', 'ea0ae157dd989f3627b720fd200e58f3b8ff454c9e0cee12cefe2251a7b6c3bai0', {
    //     feeRate: 40
    //   })
    //   console.log(txid)
    // } catch (e) {
    //   console.log(e);
    // }
  }
}
export default BTCUnisatConnectHandle
