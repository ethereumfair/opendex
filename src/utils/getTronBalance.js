import store from '../store/index'
export default async function getTronBalance(){
    const address = store.state.walletTRON 
    if(address === '') return
    if (!window.tronWeb) {
        Notify({
          color: '#ad0000',
          background: '#ffe1e1',
          message: this.$t('noWallet'),
        })
        return
    }
    return await window.tronWeb.trx.getAccount(address)
}