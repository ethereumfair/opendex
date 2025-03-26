import { JoyIDProvider } from '@joyid/ethers'
import store from '../../store' 
import { supportNetWork } from '../../config'
const getRpcUrl = () => {
  const rpcObject = store.state.rpcObject
  const fromToken = store.state.fromToken
  const chainIdList = supportNetWork.filter( item => item.netWork == fromToken.mainNetwork)
  let chainId = 1
  if(chainIdList.length > 0){
    chainId = chainIdList[0].chainId
  }
  return {
    rpcURL: rpcObject[fromToken.mainNetwork][0],
    network:{
      name: fromToken.mainNetwork,
      chainId: Number(chainId),
    }
  }
}
const createProvider = () =>{
    const config = getRpcUrl()
    const rpcURL = config.rpcURL
    const network = config.network
    const joyidConfig = {
      rpcURL,
      network,
      name: "JoyID",
      logo: "https://fav.farm/🆔",
      joyidAppURL: "https://app.joy.id",
    }
    return new JoyIDProvider(
      rpcURL,
      network,
      joyidConfig
    )
}
export default createProvider