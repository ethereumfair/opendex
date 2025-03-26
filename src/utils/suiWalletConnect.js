import store from '../store/index'
import { Notify } from 'vant'
import { TransactionBlock,JsonRpcProvider,Connection } from "@mysten/sui.js";
import {
    createWalletKitCore
} from "@mysten/wallet-kit-core";
import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-wallet-standard";
import axios from 'axios'
import BigNumber from 'bignumber.js';

const suiWalletConnectHandle = async ($scope) => {
    const walletKitRef = await WalletKitProvider()
    await walletKitRef.connect('Sui Wallet')
    const state = await walletKitRef.getState()
    if (!state.isConnected && !state.currentAccount) {
        return Notify({
            color: '#ad0000',
            background: '#ffe1e1',
            message: $scope.$t('notInstallMetamask', {
                wallet: 'SuiWallet',
            }),
        })
    }
    store.commit('setChainId', '7299')
    store.commit('setWalletAddress', state.currentAccount.address)
    store.commit('setWalletName', 'SuiWallet')
    store.commit('setWalletConnectType', 'SuiWallet')
    $scope.$refs.dialog.show = false
}
//获取余额
const getSuiBalance = async (contact) => {
    try{
        const result = await axios.post('https://sui-mainnet.nodeinfra.com/',
            {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "suix_getBalance",
            "params": [
                store.state.wallet.address,
                contact
            ]
            }
        )
        const balance = result.result.totalBalance || 0
        return balance
    }catch(error){
        return 0
    }
    
}

const transfer = async (platformAddr, fromNumber,fromToken) => {
    const walletKitRef = await WalletKitProvider()
    const connection = new Connection({
        fullnode: 'https://sui-mainnet-rpc.nodereal.io',
        faucet: '',
    });
    const provider = new JsonRpcProvider(connection);
    await walletKitRef.connect('Sui Wallet')
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
    try {
        const data = await walletKitRef.signAndExecuteTransactionBlock({ transactionBlock: tx })
        return data.digest
    } catch (error) {
        return false
    }
}
const getReferenceGasPrice = async () => {
    try {
        const result = await axios.post('https://sui-mainnet.nodeinfra.com/',
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "suix_getReferenceGasPrice",
                "params": []
            }
        )
        const gas = result.result || 0
        return gas
    } catch (error) {
        return 0
    }
}
const bridgersTransfer = async (tx) => {
    const walletKitRef = await WalletKitProvider()
    await walletKitRef.connect('Sui Wallet')
    try {
        const data = await walletKitRef.signAndExecuteTransactionBlock({ transactionBlock: TransactionBlock.from(JSON.stringify(JSON.parse(tx))) })
        return data.digest
    } catch (error) {
        return false
    }
}
async function WalletKitProvider() {
    const adapters = [
        new WalletStandardAdapterProvider({}),
        ...[],
    ]

    const walletKitRef = await createWalletKitCore({
        adapters
    });
    return walletKitRef;
}
export default {
    suiWalletConnectHandle,
    getSuiBalance,
    transfer,
    getReferenceGasPrice,
    bridgersTransfer
}
