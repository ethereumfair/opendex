import { Notify } from 'vant'
import store from '../store/index'
const BTCWalletConnectHandle = ($scope) => {
    //判断是否安装LiqualityWallet插件
    if(!window.bitcoin){
        return Notify({
            color: '#ad0000',
            background: '#ffe1e1',
            message: $scope.$t('notInstallMetamask', {
                wallet: 'Liquality Wallet',
            }),
        })
    }
    //创建链接
    if(store.state.wallet.connectType === 'LiqualityWallet'){
        return  $scope.$refs.dialog.show = false
    }
    connect($scope)
}
async function connect($scope) {
    // const net =  await bitcoin.request({ method: 'wallet_getConnectedNetwork', params: [] })
    const enable = await window.bitcoin.enable()
    const net =  await bitcoin.request({ method: 'wallet_getConnectedNetwork', params: [] })
    if(net.name !== 'bitcoin') {
        return Notify({
            color: '#ad0000',
            background: '#ffe1e1',
            message: $scope.$t('switchNetwork')
        })
    }
    if(enable){
        $scope.wallet = 'LiqualityWallet'
        store.commit('setWalletAddress', enable[0].address)
        store.commit('setWalletName', 'LiqualityWallet')
        store.commit('setWalletConnectType', 'LiqualityWallet')
        store.commit('setChainId', '1994')
        $scope.$refs.dialog.show = false
        //存储钱包已连接
        localStorage.setItem('connectorId', 'LiqualityWallet')
    }
}
export default BTCWalletConnectHandle