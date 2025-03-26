import createProvider from './provider'
import store from '../../store' 
import BigNumber from "bignumber.js";
import {ethers} from "ethers";
import Web3 from 'web3'
import { Interface, getAddress } from 'ethers/lib/utils'
import ERC20_ABI from './abi.json'

const send = async (transtion) => {
  const provider = createProvider()
  const signer = provider.getSigner();
  try{
    const tx = await signer.signTransaction(transtion)
    const txRes = await provider.sendTransaction(tx)
    return txRes
  }catch(error){
    return false
  }
}
const buildERC20Data = (toAddress, amount) => {
  const iface = new Interface(ERC20_ABI)
  const rawData = iface.encodeFunctionData('transfer', [
    getAddress(toAddress),
    amount,
  ])
  return rawData
}
// const sendErc20 = async () => {
//   const provider = createProvider()
//   const signer = provider.getSigner();
//   const tx = await signer.signTransaction({
//     to: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
//     from: address.value,
//     value: '0',
//     data: buildERC20Data('0xCEf7E44D13286e23782E12d654455FA5B35F36f8',`0x${new BigNumber(0.1)
//           .multipliedBy(new BigNumber(10 ** 6))
//           .toString(16)}`)
//   })

//   const txRes = await provider.sendTransaction(tx)
//   console.log(txRes.hash)
// }
const isApprove = async (to) => {
  const provider = createProvider()
  const signer = provider.getSigner();
  const fromToken = store.state.fromToken

  const contract = new ethers.Contract(fromToken.contact, ERC20_ABI, provider)
  const allowAmt = await contract.allowance(
    store.state.wallet.address,
    to,
  )
  const num = new BigNumber(
    ethers.utils.formatUnits(allowAmt, fromToken.coinDecimal),
  )
  const fromTokenNum = new BigNumber(store.state.fromNumber)
  if (num.gte(fromTokenNum)) {
    return  true
  } else {
    return false
  }
}
const approve = async(to) => {
  const provider = createProvider()
  const signer = provider.getSigner();
  const fromToken = store.state.fromToken
  const web3 = new Web3(provider)
  const amount = web3.utils.toWei(store.state.fromNumber, "ether");
  const ethErc20Contract = new web3.eth.Contract(
      ERC20_ABI,
      fromToken.contact
    )
    // 构造授权交易对象
    const approveTx = {
      from: store.state.wallet.address,
      to: fromToken.contact,
      data: ethErc20Contract.methods
        .approve(to, amount)
        .encodeABI(),
    };
    try{
      const tx = await signer.signTransaction(approveTx)
      const txRes = await provider.sendTransaction(tx)
      return txRes.hash
    }catch(error){
       return false
    }
}
const getMaxFees = async() => {
  const rpcObject = store.state.rpcObject
  const fromToken = store.state.fromToken
  const provider = createProvider()
  const gp = Number(await provider.getGasPrice())
  const web3 = new Web3(rpcObject[fromToken.mainNetwork][0]);
  const gasLimit = await web3.eth.estimateGas({
    from: store.state.wallet.address,
  });
  const fee = Number(
    new BigNumber(gp)
      .multipliedBy(gasLimit)
      .dividedBy(BigNumber(10).pow(18))
      .toFixed(6)
  );
  return fee

}
export default{
    send,
    isApprove,
    approve,
    getMaxFees,
    buildERC20Data
}