import store from '../store/index'
import { Notify } from 'vant'
const KuCoinConnectHandle = ($scope, name) => {
  if (!window.kucoin) {
    return Notify(
      $scope.$t('notInstallMetamask', {
        wallet: 'Halo',
      }),
    )
  } else {
    window.addEventListener('kucoin#initialized', function () {
      console.log('kucoin initialized', window.kucoin)
    })
    //监听账户变化
    window.kucoin.on('accountsChanged', (accounts) => {
      if (!accounts || accounts.length === 0) {
        //刷新页面
        store.commit('setWalletAddress', '')
      } else {
        store.commit('setWalletAddress', accounts[0])
      }
    })
    //监听链变化
    window.kucoin.on('chainChanged', (chainId) => {
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
    window.kucoin
      .request({ method: 'eth_requestAccounts', params: [] })
      .then((res) => {
        $scope.wallet = name
        window.kucoin.request({ method: 'eth_chainId' }).then((res) => {
          store.commit('setChainId', parseInt(res) + '')
        })
        store.commit('setWalletAddress', res[0])
        store.commit('setWalletName', name)
        store.commit('setWalletConnectType', 'Halo')
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
export default KuCoinConnectHandle
