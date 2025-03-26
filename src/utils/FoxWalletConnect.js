import { Notify } from 'vant'
import store from '../store/index'
const FoxWalletConnectHandle = ($scope) => {
  //判断foxwallet
  const provider = window.foxwallet && window.foxwallet.ethereum;
  if (!provider) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'FoxWallet',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'FoxWallet') {
    return ($scope.$refs.dialog.show = false)
  }
  //监听链变化
  provider.on('chainChanged', (chainId) => {
    //过滤当前非okexchain连接
    if (store.state.wallet.connectType !== 'FoxWallet') return
    connect($scope)
  })
  //监听账户变化
  provider.on('accountsChanged', (accounts) => {
    if (store.state.wallet.connectType !== 'FoxWallet') return
  })
  connect($scope)
}
async function connect($scope) {
  const provider = window.foxwallet && window.foxwallet.ethereum;
  // const Provider = provider.getProvider();
  provider.request({ method: 'eth_requestAccounts' })
    .then((res) => {
      $scope.wallet = 'FoxWallet'
      provider.request({ method: 'eth_chainId' }).then((res) => {
        store.commit('setChainId', parseInt(res) + '')
      })

      store.commit('setWalletAddress', res[0])
      store.commit('setWalletName', 'FoxWallet')
      store.commit('setWalletConnectType', 'FoxWallet')
      $scope.$refs.dialog.show = false
      //存储钱包已连接
      localStorage.setItem('connectorId', 'FoxWallet')
    })
    .catch((err) => {
      $scope.$refs.dialog.show = false
    })
}
export default FoxWalletConnectHandle
