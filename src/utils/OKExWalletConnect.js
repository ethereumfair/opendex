import { Notify } from 'vant'
import store from '../store/index'
const OKExWalletConnectHandle = ($scope) => {
  //判断是否安装OKExWallet插件
  if (!window.okexchain) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'OKExWallet',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'OKExWallet') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  okexchain.on('chainChanged', (chainId) => {
    //过滤当前非okexchain连接
    if (store.state.wallet.connectType !== 'OKExWallet') return
    connect($scope)
  })
  //监听账户变化
  okexchain.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'OKExWallet') return
  })
  connect($scope)
}
function connect($scope) {
  okexchain
    .request({ method: 'eth_requestAccounts' })
    .then((res) => {
      $scope.wallet = 'OKExWallet'
      okexchain.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'OKExWallet')
      store.commit('setWalletConnectType', 'OKExWallet')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'OKExWallet')
    })
    .catch((err) => {
      $scope.$refs.dialog.show = false
    })
}
export default OKExWalletConnectHandle
