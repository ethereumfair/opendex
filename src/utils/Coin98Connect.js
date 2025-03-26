import { Notify } from 'vant'
import store from '../store/index'
const Coin98ConnectHandle = ($scope, name) => {
  //判断是否安装con插件
  if (!window.coin98) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'Coin98',
      }),
    })
  }
  //创建链接
  if(store.state.wallet.connectType === 'coin98'){
    return  $scope.$refs.dialog.show = false
  }
    //监听链变化
  ethereum.on('chainChanged', (chainId) => {
    //过滤当前非coin98连接
    if(store.state.wallet.connectType !== 'coin98') return
    // connect($scope,name)
  })
  //监听账户变化
  ethereum.on('accountsChanged', (accounts) => {
    if(store.state.wallet.connectType !== 'coin98') return
    //刷新页面
    connect($scope,name)
  })
  connect($scope,name) 
}
function connect($scope,name){
  ethereum
  .request({ method: 'eth_requestAccounts', params: [] })
  .then((res) => {
    if(res.length<1) return
    $scope.wallet = name
    ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
      store.commit('setChainId', parseInt(chainId) + '')
    })
    store.commit('setWalletAddress', res[0])
    store.commit('setWalletName', name)
    store.commit('setWalletConnectType', 'coin98')
    $scope.$refs.dialog.show = false
    localStorage.setItem('connectorId', name)
  })
  .catch((error) => {
    if (error.code === 4001) {
      console.log('error.code ', error.code)
    } else {
      console.error('eth_getBalance', error)
    }
    $scope.$refs.dialog.show = false
  })
}
export default Coin98ConnectHandle
