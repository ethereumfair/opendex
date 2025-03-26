import store from '../store/index'
import { Notify } from 'vant'
import { IconService, HttpProvider } from 'icon-sdk-js'
const havahConnectHandle = ($scope, name) => {
    if (!window.havah) {
        return Notify(
            $scope.$t('notInstallMetamask', {
                wallet: 'HAVAH Wallet',
            }),
        )
    } else {
        const havahMethod = window.havah;

        //监听账户变化
        window.havah.on('accountsChanged', (accounts) => {
            if (store.state.wallet.connectType == 'HAVAH') {
                store.commit('setWalletAddress', accounts.address)
            }

        })
        //监听链变化
        window.havah.on('networkChanged', (chainId) => {

            if (chainId.nid == "0x100") {
                store.commit('setChainId', '6000')
            }

        })
        havahMethod.connect()
            .then((res) => {
                console.log(res)
                $scope.wallet = name
                store.commit('setChainId', '6000')
                store.commit('setWalletAddress', res.body.address)
                store.commit('setWalletName', name)
                store.commit('setWalletConnectType', 'HAVAH')
                $scope.$refs.dialog.show = false
                localStorage.setItem('connectorId', name)
            })
            .catch((error) => {
                console.log('error.code ', error.code)
                $scope.$refs.dialog.show = false
            })
    }
}

const getHVHBalance = async () => {
    const provider = new HttpProvider('https://ctz.havah.io/api/v3');

    /* Create IconService instance */
    const iconService = new IconService(provider);
    const balances = iconService.getBalance(store.state.wallet.address).execute();
    return balances

}
export default { havahConnectHandle, getHVHBalance }
