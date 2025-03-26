import { Notify } from 'vant'
import store from '../store/index'
const PhantomConnectHandle = ($scope) => {
  if (!window.solana) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'Phantom',
      }),
    })
  }
  if (store.state.wallet.connectType === 'Phantom') {
    return ($scope.$refs.dialog.show = false)
  }
  connect($scope)
}
async function connect($scope) {
  let resp = null
  let publicKey = null
  resp = await window.solana.connect()
  publicKey = window.solana.publicKey.toBase58()
  if (publicKey == null) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('loginPhantom'),
    })
  }

  if (publicKey) {
    $scope.wallet = 'Phantom'
    store.commit('setChainId', '2021')
    store.commit('setWalletAddress', publicKey)
    store.commit('setWalletName', 'Phantom')
    store.commit('setWalletConnectType', 'Phantom')
    $scope.$refs.dialog.show = false
    localStorage.setItem('connectorId', 'Phantom')
  }
}
export default PhantomConnectHandle
