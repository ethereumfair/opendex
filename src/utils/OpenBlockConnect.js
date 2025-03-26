import { Notify } from 'vant'
import store from '../store/index'
// OpenBlock 连接
const OpenBlockConnectHandle = async($scope) => {
  await import( '@openblockhq/dappsdk')

  //判断当前是否支持 OpenBlock
  if (!window.openblock) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'OpenBlock',
      }),
    })
  }
  const provider = window.openblock
  // //创建连接
  if (store.state.wallet.connectType === 'OpenBlock') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  provider.on('chainChanged', (chainId) => {
    //过滤当前非OpenBlock连接
    if (store.state.wallet.connectType !== 'OpenBlock') return
    connect($scope)
  })
  //监听账户变化
  provider.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'OpenBlock') return
  })
  connect($scope)
}
//请求创建连接
function connect($scope) {
  window.openblock.request({ method: 'eth_requestAccounts', params: [] })
    .then((res) => {
      $scope.wallet = 'OpenBlock'
      window.openblock.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'OpenBlock')
      store.commit('setWalletConnectType', 'OpenBlock')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'OpenBlock')
    })
    .catch((error) => {
      $scope.$refs.dialog.show = false
    })
}
export default OpenBlockConnectHandle
