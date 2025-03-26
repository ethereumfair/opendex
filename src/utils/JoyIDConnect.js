import { Notify } from 'vant'
import store from '../store/index'
import { connect, disconnect, getConnectedAddress } from "@joyid/evm"
const JoyIDConnectHandle = ($scope) => {
  //创建链接
  if (store.state.wallet.connectType === 'JoyID') {
    return ($scope.$refs.dialog.show = false)
  }
  connectHd($scope)
}
async function connectHd($scope) {
    try {
        const res = await getConnectedAddress() || await connect();
        $scope.wallet = 'JoyIDWallet'
        store.commit('setChainId', '1')
        store.commit('setWalletAddress', res)
        store.commit('setWalletName', 'JoyIDWallet')
        store.commit('setWalletConnectType', 'JoyIDWallet')
        $scope.$refs.dialog.show = false
        //存储钱包已连接
        localStorage.setItem('connectorId', 'JoyIDWallet')
      } catch (error) {
        $scope.$refs.dialog.show = false
      }
}
export default JoyIDConnectHandle
