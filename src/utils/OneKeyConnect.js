import { Notify } from 'vant'
import store from '../store/index'
const oneKeyConnectHandle = ($scope) => {
  //判断是否安装oneKey插件
  if (!window.$onekey) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'oneKey',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'oneKey') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  window.$onekey.ethereum.on('chainChanged', (chainId) => {
    //过滤当前非window.$onekey.ethereum连接
    if (store.state.wallet.connectType !== 'oneKey') return
    connect($scope)
  })
  //监听账户变化
  window.$onekey.ethereum.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'oneKey') return
  })
  connect($scope)
}
function connect($scope) {
  window.$onekey.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((res) => {
      $scope.wallet = 'oneKey'
      window.$onekey.ethereum.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'oneKey')
      store.commit('setWalletConnectType', 'oneKey')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'oneKey')
    })
    .catch((err) => {
      $scope.$refs.dialog.show = false
    })
}
export default oneKeyConnectHandle
