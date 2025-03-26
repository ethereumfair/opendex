import axios from 'axios'
import store from '../store'

let api = ''
let development = process.env.NODE_ENV === 'development'
if (!development) {
  api = 'https://transfer.swft.pro'
}
const pathApi = 'https://api-swap.paths.finance'
const newSwftApi = 'https://www.swftc.info/gt'
const sSwapApi = 'https://api.bridgers.xyz'
const swftApi = 'https://www.swftc.info'

axios.interceptors.response.use(
  (suc) => {
    if (suc.status == '200') {
      if (suc.data.resCode != '900') {
        return Promise.resolve(suc.data)
      }
    } else {
      return Promise.resolve(suc.statusText)
    }
  },
  (error) => {
    return Promise.reject(error.data, error.resCode)
  },
)

class BaseApi {
  // constructor
  /**
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {string} method  http请求方式
   * @param {string} responseType 相应类型
   */
  createRpcToken(url, data, method, path, responseType) {
    method = method || 'post'
    // responseType = responseType || 'application/json';
    if (method.toLowerCase() === 'get') {
      let params = ''
      Object.keys(data).forEach(function (key) {
        if (data[key]) {
          let value = data[key]
          params += key + '=' + value + '&'
        }
      })
      if (params.length > 0) {
        params = params.substr(0, params.length - 1)
        url += '?' + params
        data = {}
      }
    }
    data = JSON.stringify(data)
    return axios({
      url: path ? url : api + url,
      method: method,
      data: data,
      dataType: 'json',
      timeout: 500000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  newBaseRequestData() {
    let sourceFlag = localStorage.getItem('sourceFlag')
    let utmSource = localStorage.getItem('utm_source')
    let equipmentNo
    if (sessionStorage.getItem('equipmentNo')) {
      equipmentNo = sessionStorage.getItem('equipmentNo')
      equipmentNo = JSON.parse(equipmentNo)
    } else {
      equipmentNo = this.randomWord()
      let json = JSON.stringify(equipmentNo)
      sessionStorage.setItem('equipmentNo', json)
    }
    let address = ''
    if (
      (store.state.chainId == '000' ||
        store.state.chainId == '222' ||
        store.state.chainId == '333') &&
      store.state.walletPolkadot !== null
    ) {
      address = store.state.walletPolkadot.addrSS58
    } else if (store.state.chainId == '0' && store.state.walletTRON !== null) {
      address = store.state.walletTRON
    } else {
      address = store.state.wallet ? store.state.wallet.address : ''
    }
    if (address.length) {
      equipmentNo = ''
      if (address.length <= 32) {
        let n = 32 - address.length
        for (let i = 0; i < n; i++) {
          equipmentNo += 'x'
        }
        equipmentNo += address
      } else {
        equipmentNo = address.slice(0, 32)
      }
    }
    let data = {
      equipmentNo: equipmentNo,
      sourceType: 'H5',
      userNo: '',
      sessionUuid: '',
      orderId: '',
      sourceFlag: sourceFlag,
      utmSource: utmSource,
    }
    return data
  }
  randomWord() {
    let str = '',
      arr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ]
    for (let i = 0; i < 32; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1))
      str += arr[pos]
    }
    return str
  }

  queryCoinList() {
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryCoinList',
      this.newBaseRequestData(),
      '',
      'path',
    )
  }

  getBaseInfo(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryBaseInfo',
      obj,
      '',
      'path',
    )
  }
  noGasSwap(data) {
    return this.createRpcToken(
      newSwftApi + '/swap/v1/noGasSwap',
      data,
      'post',
      'swft',
    )
  }
  queryChainByCode(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryChainByCode',
      obj,
      '',
      'path',
    )
  }
  queryAllTrade(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryAllTrade',
      obj,
      '',
      'path',
    )
  }
  accountExchange(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/accountExchange',
      obj,
      '',
      'path',
    )
  }
  failureExchange(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/api/v3/failureExchange',
      obj,
      'post',
      'path',
    )
  }
  modifyTxId(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/modifyTxId',
      obj,
      '',
      'path',
    )
  }

  queryOrderState(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryOrderState',
      obj,
      '',
      'path',
    )
  }

  chainFeeList(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryChainFeeList',
      obj,
      '',
      'path',
    )
  }
  swftFeeAdvertising(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken('/api/v3/init', obj)
  }
  widgetNotification(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/pictureControl/widgetNotification',
      obj,
      'post',
      'swft',
    )
  }
  widgetBannerImg(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/pictureControl/widgetBannerImg',
      obj,
      'post',
      'swft',
    )
  }
  publicNode(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/public/node/publicNode',
      obj,
      'post',
      'swft',
    )
  }
  commonSwap(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(pathApi + '/api/commonSwap', obj, 'post', 'path')
  }
  addTransData(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      pathApi + '/api/exchangeRecord/addTransData',
      obj,
      'post',
      'path',
    )
  }
  makerTransferOut(data) {
    return this.createRpcToken(pathApi + '/api/cBridge/makerTransferOut', data)
  }
  uploadPathRecord(data) {
    return this.createRpcToken(
      swftApi + '/bridge/uploadRecord',
      data,
      '',
      'path',
    )
  }
  payload(data) {
    return this.createRpcToken(
      newSwftApi + '/swap/v1/payload',
      data,
      '',
      'path',
    )
  }

  getXUMMWalletInfo(identifier) {
    const data = {
      uuid: identifier,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryWalletAddress',
      data,
      '',
      'path',
    )
  }

  getXRPBalance(addr) {
    return this.createRpcToken(
      'https://api.xrpscan.com/api/v1/account/' + addr,
      '',
      'get',
      'path',
    )
  }

  getXRPTokensBalance(addr) {
    return this.createRpcToken(
      'https://api.xrpscan.com/api/v1/account/' + addr + '/assets',
      '',
      'get',
      'path',
    )
  }
  getSswapBridgeTradeData(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      sSwapApi + '/api/sswap/quote',
      obj,
      'post',
      'path',
    )
  }
  sSwapswap(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      sSwapApi + '/api/sswap/swap',
      obj,
      'post',
      'path',
    )
  }
  updateDataAndStatus(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      sSwapApi + '/api/exchangeRecord/updateDataAndStatus',
      obj,
      'post',
      'path',
    )
  }
  getTransData(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      sSwapApi + '/api/exchangeRecord/getTransData',
      obj,
      'post',
      'path',
    )
  }
  getTransDataById(data) {
    return this.createRpcToken(
      sSwapApi + '/api/exchangeRecord/getTransDataById',
      data,
      'post',
      'path',
    )
  }


  quote(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/path/v1/quote',
      obj,
      '',
      'path',
    )
  }

  queryChainByConfig(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryChainByConfig',
      obj,
      'post',
      'path',
    )
  }
  accountapiSpaceId(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/accountapi/spaceId',
      obj,
      'post',
      'swft',
    )
  }
  mpcbot(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      'https://www.swftc.info/ai/mpcbot',
      obj,
      'post',
      'swft',
    )
  }
  transapiFioAddress(data) {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      swftApi + '/transapi/fioAddress',
      obj,
      'post',
      'swft',
    )
  }
  queryBRC20(data) {
    return this.createRpcToken(
      newSwftApi + '/swap/v1/queryBRC20',
      data,
      'post',
      'swft',
    )
  }
  queryRewardList = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      sSwapApi + '/swap/staking/queryRewardList',
      obj,
      'post',
      'swft',
    )
  };

  queryProjectList = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/queryProjectList',
      obj,
      'post',
      'swft',
    )
  };

  queryPositionList = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/queryPositionList',
      obj,
      'post',
      'swft',
    )
  };

  withdrawFund = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/withdrawFund',
      obj,
      'post',
      'swft',
    )
  };

  transferRevenue = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/transferRevenue',
      obj,
      'post',
      'swft',
    )
  };

  addOrder = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/addOrder',
      obj,
      'post',
      'swft',
    )
  };

  pledge = async (data) => {
    const obj = {
      ...this.newBaseRequestData(),
      ...data,
    }
    return this.createRpcToken(
      newSwftApi + '/swap/staking/pledge',
      obj,
      'post',
      'swft',
    )
  };
  getTronInfo = async (data) => {
    return this.createRpcToken(
      'https://apilist.tronscanapi.com/api/accountv2',
      data,
      'get',
      'swft',
    )
  };
}
const baseApi = new BaseApi()
export default baseApi
