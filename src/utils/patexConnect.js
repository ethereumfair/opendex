import store from '../store/index'
const patexConnectHandle = ($scope) => {
  //判断当前是否支持 patex
  if (!window.patex.ethereum) {
    $scope.$AlertError(
      $scope.$t('notInstallMetamask', {
        wallet: 'Patex Wallet',
      }),
    )
    return
  }
  //创建连接
  if (store.state.wallet.connectType === 'Patex') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  window.patex.ethereum.on('chainChanged', (chainId) => {
    //过滤当前非patex连接
    if (store.state.wallet.connectType !== 'Patex') return
    connect($scope)
  })
  //监听账户变化
  window.patex.ethereum.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'Patex') return
    //刷新页面
    window.location.reload()
  })
  connect($scope)
}
//请求创建连接
function connect($scope) {
  window.patex.ethereum
    .request({ method: 'eth_requestAccounts', params: [] })
    .then((res) => {
      $scope.wallet = 'Patex'
      window.patex.ethereum
        .request({ method: 'eth_chainId' })
        .then((data) => {
          if (data.code === 'err_0001') {
            store.commit('setChainId', parseInt('0x89') + '')
          } else {
            store.commit('setChainId', parseInt(data) + '')
          }
        })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'Patex')
      store.commit('setWalletConnectType', 'Patex')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'Patex')
    })
    .catch((error) => {
      $scope.$refs.dialog.show = false
    })
}
export default patexConnectHandle
