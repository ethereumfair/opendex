import detectProvider, {isPortkeyProvider} from '@portkey/detect-provider';
import store from '../store/index'
import BigNumber from 'bignumber.js';
const connectWallet = async ($scope) => {
    if (!window.portkey) {
        return Notify({
          color: '#ad0000',
          background: '#ffe1e1',
          message: $scope.$t('notInstallMetamask', {
            wallet: 'Portkey Wallet',
          }),
        })
    }
    try{
      const result = await window.portkey.request({method:'requestAccounts'});
      $scope.wallet = 'Portkey'
      store.commit('setChainId', '520520')
      store.commit('setWalletAddress',  result.AELF[0])
      store.commit('setWalletName', 'Portkey')
      store.commit('setWalletConnectType', 'Portkey')
      $scope.$refs.dialog.show = false
      localStorage.setItem('connectorId', 'Portkey')
    }catch(error){
      console.log(error)
    }
  }
  const getBalance = async (coin) => {
      const provider = await detectProvider();
      const chain = await provider.getChain('AELF');
      const contract = chain.getContract(coin.contact);
      const data = await contract.callViewMethod('GetBalance', {
        symbol: 'ELF',
        owner: store.state.wallet.address,
      });
      const balance = new BigNumber(data.data.balance)
      .dividedBy(BigNumber(10).pow(8))
      .toFixed(6) - 0
      return balance
  }
  const sendELFToken = async (platformAddr, fromNumber, fromToken) => {
    const provider = await detectProvider();
    // get chain
    const chain = await provider.getChain('AELF');

    // get contract
    const tokenC = await chain.getContract(fromToken.contact);
    try{
      // Transfer
      const req = await tokenC.callSendMethod('Transfer',store.state.wallet.address,{amount:fromNumber*10**fromToken.coinDecimal,symbol:fromToken.coinCode.replace('(AELF)',''),to:platformAddr})
      return req
    }catch( error){
      return false
    }
   
  }
  export default{
    sendELFToken,
    getBalance,
    connectWallet,
}