import { MsafeWallet } from "msafe-wallet";
import store from '../store/index'
// MSafe 连接
const MSafeConnectHandle = async($scope) => {
 /// use msafe SDK
 if(!MsafeWallet.inMsafeWallet()){ // check if the dapp is running in msafe
  const url = MsafeWallet.getAppUrl('https://app.m-safe.io'); // get dapp url for msafe
  window.open(url)
}
const msafe = await MsafeWallet.new('https://app.m-safe.io')
window.msafe = msafe
// //创建连接
if (store.state.wallet.connectType === 'MSafe') {
  return ($scope.$refs.dialog.show = false)
}
//监听账户变化
msafe.onChangeAccount(async (account)=>{
  if (store.state.wallet.connectType !== 'MSafe') return
  await connect($scope,msafe)
});
await connect($scope,msafe)
}
//请求创建连接
const connect = async ($scope,msafe) => {
  const account = await msafe.connect(); 
  await msafe.isConnected(); // true
  $scope.wallet = 'MSafe'
  store.commit('setChainId', '072611')
  store.commit('setWalletAddress', account.address)
  store.commit('setWalletName', 'MSafe')
  store.commit('setWalletConnectType', 'MSafe')
  $scope.$refs.dialog.show = false
  //存储钱包已连接
  localStorage.setItem('connectorId', 'MSafe')
}
export default MSafeConnectHandle
