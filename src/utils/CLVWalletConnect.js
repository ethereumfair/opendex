import store from '../store/index'
import { Notify } from 'vant'
const CLVConnectHandle = ($scope, name) => {
  if (!window.clover) {
    return Notify(
      $scope.$t('notInstallMetamask', {
        wallet: 'CLV Wallet',
      }),
    )
    return false
  } else {
    //监听账户变化
    window.clover.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        //刷新页面
        store.commit('setWalletAddress', '')
      } else {
        store.commit('setWalletAddress', accounts[0])
      }
    })
    //监听链变化
    window.clover.on('chainChanged', (chainId) => {
      if (
        store.state.fromToken &&
        store.state.fromToken.tokenChain === 'NFT' &&
        parseInt(chainId) == 1
      ) {
        store.commit('setChainId', parseInt('10086') + '')
      } else {
        store.commit('setChainId', parseInt(chainId) + '')
      }
    })
    window.clover
      .request({ method: 'eth_requestAccounts', params: [] })
      .then((res) => {
        $scope.wallet = name
        window.clover.request({ method: 'eth_chainId' }).then((res) => {
          store.commit('setChainId', parseInt(res) + '')
        })
        store.commit('setWalletAddress', res[0])
        store.commit('setWalletName', name)
        store.commit('setWalletConnectType', 'CLVWallet')
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
}
export default CLVConnectHandle
