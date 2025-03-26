import store from '../store/index'
// const BitKeepProvider = null
// bitkeep 连接
const bitkeepConnectHandle = ($scope) => {
  //判断当前是否支持 bitkeep
  if (window.tronWeb && !$scope.isPC) {
    $scope.$bus.emit('checkTronLink', 'Bitget')
    return
  }

  if (!window.bitkeep) {
    // $scope.$AlertError(
    //   $scope.$t('notInstallMetamask', {
    //     wallet: 'Bitget Wallet',
    //   }),
    // )
    window.open('https://bitkeep.com/en/download')
    return
  }
  // BitKeepProvider = window.bitkeep.ethereum
  //创建连接
  if (store.state.wallet.connectType === 'Bitget') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  window.bitkeep.ethereum.on('chainChanged', (chainId) => {
    //过滤当前非bitkeep连接
    if (store.state.wallet.connectType !== 'Bitget') return
    connect($scope)
  })
  //监听账户变化
  window.bitkeep.ethereum.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'Bitget') return
    //刷新页面
    window.location.reload()
  })
  connect($scope)
}
//请求创建连接
function connect($scope) {
  window.bitkeep.ethereum
    .request({ method: 'eth_requestAccounts', params: [] })
    .then((res) => {
      $scope.wallet = 'Bitget'
      window.bitkeep.ethereum
        .request({ method: 'eth_chainId' })
        .then((data) => {
          if (data.code === 'err_0001') {
            store.commit('setChainId', parseInt('0x89') + '')
          } else {
            store.commit('setChainId', parseInt(data) + '')
          }
        })
      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'Bitget')
      store.commit('setWalletConnectType', 'Bitget')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'Bitget')
    })
    .catch((error) => {
      $scope.$refs.dialog.show = false
    })
}
export default bitkeepConnectHandle
