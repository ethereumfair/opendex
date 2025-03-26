import store from '../store/index'
import { Notify } from 'vant'
import { TransactionBlock,JsonRpcProvider,Connection } from "@mysten/sui.js";
import BigNumber from 'bignumber.js';

const GlobalWallet = {
    register: (wallet) => {
        GlobalWallet[wallet.chainName] = wallet
    }
}
const event = new CustomEvent('wallet-standard:app-ready', { detail: GlobalWallet });
window.dispatchEvent(event);

const suiWallet = GlobalWallet.suiMainnet
const suiOKXWalletConnectHandle = async ($scope) =>{
    if(!suiWallet){
      return Notify({
          color: '#ad0000',
          background: '#ffe1e1',
          message: $scope.$t('notInstallMetamask', {
              wallet: 'OKX Wallet',
          }),
      })
    }
    
    suiWallet.features['standard:connect'].connect()
    .then((res) => {
        store.commit('setChainId', '7299')
        store.commit('setWalletAddress', res.accounts[0].address)
        store.commit('setWalletName', 'OKExWalletSui')
        store.commit('setWalletConnectType', 'OKExWalletSui')
        $scope.$refs.dialog.show = false
    })
    .catch((err) => {
      if (err.code === 4001) {
       
      } else {
        console.error(err);
      }
    });
}

// 转账
const transfer = async (platformAddr, fromNumber,fromToken) => {
      const connection = new Connection({
          fullnode: 'https://sui-mainnet.nodeinfra.com/',
          faucet: '',
      });
      const provider = new JsonRpcProvider(connection);
      const tx = new TransactionBlock();
      const amt = new BigNumber(fromNumber).times(new BigNumber('10').pow(fromToken.coinDecimal));
      if(fromToken.contact == '0x2::sui::SUI'){
          const [coin] = tx.splitCoins(tx.gas, [tx.pure(amt)]);
          tx.transferObjects([coin], tx.pure(platformAddr))
      }else{
          const coinInfo = await provider.getCoins(
              {
                  owner: store.state.wallet.address, // fromAddress
                  coinType: fromToken.contact,
              })
          const dataList = (coinInfo.data.sort((a, b) => parseInt(a.balance) - parseInt(b.balance))).filter( item => item.balance != 0)
          let balanceSum = 0;
          let index = -1;

          for (let i = 0; i < dataList.length; i++) {
              balanceSum += parseInt(dataList[i].balance);
              if (balanceSum >= amt) {
                  index = i;
                  break;
              }
          }
          if(index == 0){
              const [coin] = tx.splitCoins(tx.object(dataList[0]['coinObjectId']), [tx.pure(amt)]);
              tx.transferObjects([coin], tx.pure(platformAddr))
          }else{
              let arg = []
              dataList.slice(0,index).forEach(item => {
                  arg.push(tx.object(item['coinObjectId']))
              })
              const remainingNumber = dataList[index].balance - (balanceSum - amt)
              const arg1 = tx.object(dataList[index]['coinObjectId'])
              const [coin] = tx.splitCoins(arg1, [tx.pure(remainingNumber)]);
              tx.transferObjects([coin], tx.pure(platformAddr))
              tx.transferObjects(arg, tx.pure(platformAddr))
          }
      }
  try{
    const result = await suiWallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: { showEffects: true },
    })
    return result.digest
  }catch(error){
    return false
  }
}

// bridger转账
const bridgersTransfer = async (tx) =>{
  try{
      const result = await suiWallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({  
        transactionBlock: TransactionBlock.from(JSON.stringify(JSON.parse(tx))),
        options: { showEffects: true },
      })
      return result.digest
    }catch(error){
      return false
    }
}

export default {
  suiOKXWalletConnectHandle,
  transfer,
  bridgersTransfer,
}
