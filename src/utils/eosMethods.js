import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { JsonRpc, Api } from 'eosjs'
import { Notify } from 'vant'
import store from '../store/index'
let api = ''
let account = ''
let currentPermission = ''
let currentAccount = ''
let network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  host: 'eospush.tokenpocket.pro',
  port: 443,
  protocol: 'https',
})
ScatterJS.plugins(new ScatterEOS())

const eosConnectHandle = ($scope) => {
  let rpc = new JsonRpc(network.fullhost())
  api = ScatterJS.scatter.eos(network, Api, { rpc })
  ScatterJS.scatter.connect('YourAppName', { network }).then((connected) => {
    if (!connected)
      return Notify({
        color: '#ad0000',
        background: '#ffe1e1',
        message: $scope.$t('notInstallMetamask', {
          wallet: 'LeafWallet',
        }),
      })
    ScatterJS.scatter
      .login()
      .then((id) => {
        account = ScatterJS.scatter.identity.accounts.find(
          (x) => x.blockchain === 'eos',
        )
        currentPermission = account.authority
        currentAccount = account.name
        if (account) {
          $scope.wallet = 'LeafWallet'
          store.commit('setChainId', '1040')
          store.commit('setWalletAddress', account.name)
          store.commit('setWalletName', 'LeafWallet')
          store.commit('setWalletConnectType', 'LeafWallet')
          $scope.$refs.dialog.show = false
          //存储钱包已连接
          localStorage.setItem('connectorId', 'LeafWallet')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })
}
const EOSExchange = async (res,$scope,changeFromNumber,changeFromToken) => {
  const platformAddr = res.data.platformAddr
  // 需要截取地址和memo
  const addrAry = platformAddr.split('#')
  const to = addrAry[0]
  const memo = addrAry[1]
  let quantity = ''
  let coinCode = ''
  let contact = ''
  const fromToken = changeFromToken
  const fromNumber = (changeFromNumber - 0).toFixed(4)
  if(fromToken.contact === ''){ //主币
    coinCode = ' EOS'
    contact = 'eosio.token'
  }else {
    coinCode = fromToken.coinCode.replace("(EOS)","")
    contact = fromToken.contact
  }
  quantity = fromNumber + coinCode
  //ScatterJS.scatter.logout().then(a => alert(a))
  let rpc = new JsonRpc(network.fullhost())
  api = ScatterJS.scatter.eos(network, Api, { rpc })
  await ScatterJS.login()
  const account = ScatterJS.account('eos');
  try{
    const result =  await api.transact({
      actions: [{
          account: contact,
          name: 'transfer',
          authorization: [{
              actor: account.name,
              permission: account.authority,
          }],
          data: {
              from: account.name,
              to: to,
              quantity: quantity,
              memo: memo,
          },
        }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        })
      return result
    }catch(error){
      return error
    }
  }
const EOSMethods = {
  eosConnectHandle,
  EOSExchange
}

export default EOSMethods
