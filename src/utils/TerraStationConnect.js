import { Notify } from 'vant'
import store from '../store/index'

const TerraStationConnectHandle = async ($scope) => {
  const {Extension} = await import('@terra-money/terra.js')
  const connetctor = new Extension()
  //判断是否安装TerraStation插件
  if (!connetctor.isAvailable) {
    return Notify({
      color: '#ad0000',
      background: '#ffe1e1',
      message: $scope.$t('notInstallMetamask', {
        wallet: 'Terra Station',
      }),
    })
  }
  //创建链接
  if (store.state.wallet.connectType === 'TerraStation') {
    return ($scope.$refs.dialog.show = false)
  }
  connect(connetctor,$scope)
}
function connect(connetctor,$scope) {
  connetctor.request('connect')
  .then((e) => {
    $scope.wallet = 'TerraStation'
    store.commit('setChainId', '1993')
    store.commit('setWalletAddress', e.payload.address)
    store.commit('setWalletName', 'TerraStation')
    store.commit('setWalletConnectType', 'TerraStation')
    $scope.$refs.dialog.show = false
    //存储钱包已连接
    localStorage.setItem('connectorId', 'TerraStation')
  })
  .catch((err) => {
    console.log(err)
  })
}
export default TerraStationConnectHandle
