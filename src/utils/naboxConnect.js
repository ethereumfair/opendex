import { Notify } from 'vant'
import store from '../store/index'

// nabox 连接
const NaboxConnectHandle = ($scope) => {
  //判断当前是否支持 Nabox
  if (!window.NaboxWallet) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'NaboxWallet',
      }),
    })
  }
  //创建连接
  if (store.state.wallet.connectType === 'Nabox') {
    return ($scope.$refs.dialog.show = false)
  }
  NaboxWallet.off('chainChanged')
  NaboxWallet.off('accountsChanged')
  //监听链变化
  NaboxWallet.on('chainChanged', (chainId) => {
    //过滤当前非Nabox连接
    if (store.state.wallet.connectType !== 'Nabox') return
    connect($scope)
  })
  //监听账户变化
  NaboxWallet.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'Nabox') return
  })
  connect($scope)
}
//请求创建连接
function connect($scope) {
  NaboxWallet.request({ method: 'eth_requestAccounts', params: [] })
    .then((res) => {
      $scope.wallet = 'Nabox'
      NaboxWallet.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'Nabox')
      store.commit('setWalletConnectType', 'Nabox')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'Nabox')
    })
    .catch((error) => {
      $scope.$refs.dialog.show = false
    })
}
export default NaboxConnectHandle
