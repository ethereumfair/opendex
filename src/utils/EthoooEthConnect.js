import { Notify } from 'vant'
import store from '../store/index'
const EchoooWalletConnectHandle = ($scope) => {
  //判断是否安装EchoooWallet插件
  if (!window.echoooEth) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'EchoooWallet',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'EchoooWallet') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  window.echoooEth.on('chainChanged', (chainId) => {
    //过滤当前非window.echoooEth连接
    if (store.state.wallet.connectType !== 'EchoooWallet') return
    connect($scope)
  })
  //监听账户变化
  window.echoooEth.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'EchoooWallet') return
  })
  connect($scope)
}
function connect($scope) {
  window.echoooEth
    .request({ method: 'eth_requestAccounts' })
    .then((res) => {
      $scope.wallet = 'EchoooWallet'
      window.echoooEth.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'EchoooWallet')
      store.commit('setWalletConnectType', 'EchoooWallet')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'EchoooWallet')
    })
    .catch((err) => {
      $scope.$refs.dialog.show = false
    })
}
export default EchoooWalletConnectHandle
