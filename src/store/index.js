import Vue from 'vue'
import Vuex from 'vuex'
import { supportNetWork } from '../config/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    wallet: {
      address: '',
      name: '',
      connectType: '',
    },
    walletPolkadot: null,
    walletTRON: null,
    chainId: null,
    fromToken:
      JSON.parse(localStorage.getItem('localFromToken')) == '' ||
        !JSON.parse(localStorage.getItem('localFromToken')) ||
        null
        ? null
        : JSON.parse(localStorage.getItem('localFromToken')),
    toToken: null, 
    NFTToToken: null,
    NFTFromToken: null,
    address: '', // toToken需要填入的地址
    receiveAddressNFT: '', // NFT 收币地址
    balance: 0, // fromToken的余额
    fromNumber: '',
    toNumber: '',
    coinList: [], // 未筛选用的币种列表
    coinListChain: [], // 按照链筛选出来的币种列表
    lang: '', //语言标识
    info: null, // 交易对的基础信息
    showTradeBox: true, // 切换交易界面或交易记录界面
    order: null, // 当前查询的订单详情信息
    inputSource: '', // 输入框改变来源 form 兑换输入框  to 目标输入框
    trcKeyDex: 0, //轮询key调用trc API
    isWalletConnect: false, //这里判断是否用walletConnect 连接
    NFTList: null, //nft 列表
    NFTChange: 'to', //nft买/卖
    NFTInfo: null, // NFT 买卖单详情
    priceList: [], //询价列表
    updating: false, //是否在更新价格
    slidingPoint: 1, //滑点
    swapConfirm: false, //是否进行兑换中，用于判断询价是否刷新
    tabActive: 'swap', //默认  展示tab栏模块
    qrcode: null, //xumm二维码
    recordType: '',
    nftFilter: {
      BSC: true,
      ETH: true,
      POLYGON: true,
      buyNow: true,
      sort: 'asc',
    },
    evmList: [
      'ETH',
      'BSC',
      'HECO',
      'POLYGON',
      'ETHF',
      'ETHW',
      'Optimism',
      'OKExChain',
      'ARB',
      'AVAXC',
      'CELO',
      'TT',
      'XDC',
      'KLAY',
      'FTM',
      'ORC',
      'SGB',
      'HPB',
      'CRONOS',
      'AME',
      'ECH',
      'CUBE',
      'GNOSIS',
      'ETC',
      'BRISE',
      'KCC',
      'DRAC',
      'DC',
      'FSC',
      'FRZ',
      'GRC30',
      'CORE',
      'MTR',
      'BTTC',
      'ZKSYNC',
      'CFX',
      'FVM',
      'EOS(EVM)',
      'PulseChain',
      'LINEA',
      'PEGO',
      'opBNB',
      'BASE',
      'ETRC20',
      'QITMEER',
      'OZO',
      'PATEX',
      'zkEVM',
      'SCROLL',
      'MNT',
      'Metis',
      'Moonriver',
      'Moonbeam',
      'CMEMO',
      'Manta',
      'Blast',
    ],
    rpcObject: {}, //rpc
    chainList: [],
    showChainList: [],
    supportChianArr: [],
    bridgeTokens: [], // bridge币种列表
    bridgeChooseToken: null, //已选择需要跨连桥的代币
    bridgeFromTokenchain: null,
    bridgeToTokenchain: null,
    allSupportChianArr: [],
    spaceIdDomain: '',
    isFreeGas: false,
    isUserChoose: false, // 记录是否用户点击选择币种
    FIODomain: '', //FIO域名
    isPlenaConnect: false, //是否Plena 连接
    wcProjectID: '', // walletconnect projectId 需要自己申请
    topic: '',
    gasToToken: null,
    gasFromToken: null,
    balanceOptions: [],
    inscriptionId: null,
    walletConnect_uri: ''
    
  },
  getters: {
    getLang: (state, getters) => {
      if (state.lang) {
        return state.lang
      } else {
        let lang = localStorage.getItem('lang')
        if (!lang) {
          let language = navigator.language
          language = language.toLocaleLowerCase()
          lang = language.indexOf('zh') != '-1' ? 'zh' : 'en'
          localStorage.setItem('lang', lang)
        }
        return lang
      }
    },
    getBalance: (state, getter) => {
      const coinCode = state.fromToken.coinCode
      const token = state.coinList.find((e) => {
        if (e.coinCode === coinCode) {
          return true
        }
      })
      return token.balance
    },
    getChainIdName: (state, getters) => {
      const chainId = state.chainId
      const obj = supportNetWork.find((e) => {
        return e.chainId === chainId
      })
      return obj ? obj.netWork : null
    },
    EthereumProviderInit: (state, getters) => {
      const objInit = {
        projectId: state.wcProjectID,
        showQrModal: true,
        chains: [1],
        optionalChains: [1, 10, 56, 100, 137, 324, 42161, 42220, 43114],
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
          'wallet_addEthereumChain',
          'wallet_switchEthereumChain',
        ],
        optionalMethods: [
          'eth_signTypedData',
          'eth_signTypedData_v4',
          'eth_sign',
        ],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: 'ALLChain Bridge',
          description:
            'One-stop cross-chain platform: Cross-chain swap Aggregator, Cross-chain Bridge, DEX for BTC, ETH, BSC, TRON, XRPL, SOL, etc.',
          url: 'https://defi.swft.pro/#/',
          icons: ['https://images.swft.pro/dex/bridgers1.png'],
        },
      }
      return objInit
    },
    EthereumProviderInitImtoken: (state, getters) => {
      const objInit = {
        projectId: state.wcProjectID,
        showQrModal: false,
        chains: [1],
        optionalChains: [1, 10, 56, 100, 137, 324, 42161, 42220, 43114],
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
          'wallet_addEthereumChain',
          'wallet_switchEthereumChain',
        ],
        optionalMethods: [
          'eth_signTypedData',
          'eth_signTypedData_v4',
          'eth_sign',
        ],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: 'ALLChain Bridge',
          description:
            'One-stop cross-chain platform: Cross-chain swap Aggregator, Cross-chain Bridge, DEX for BTC, ETH, BSC, TRON, XRPL, SOL, etc.',
          url: 'https://defi.swft.pro/#/',
          icons: ['https://images.swft.pro/dex/bridgers1.png'],
        },
      }
      return objInit
    },
  },
  mutations: {
    setWalletAddress(state, address) {
      state.wallet.address = address
    },
    setWalletName(state, name) {
      state.wallet.name = name
    },
    setWalletConnectType(state, type) {
      state.wallet.connectType = type
    },
    setWalletPolkadot(state, arr) {
      state.walletPolkadot = arr
    },
    setWalletTRON(state, add) {
      state.walletTRON = add
    },
    setChainId(state, chainId) {
      state.chainId = chainId
      // onboard.config({
      //   networkId: chainId
      // })
    },
    setFromToken(state, token) {
      state.fromToken = token
    },
    setToToken(state, token) {
      state.toToken = token
    },
    setAddress(state, address) {
      state.address = address
    },
    setBalance(state, balance) {
      state.balance = balance
    },
    setFromNumber(state, num) {
      state.fromNumber = num
    },
    setToNumber(state, num) {
      state.toNumber = num
    },
    setCoinList(state, list) {
      state.coinList = list
      // if (!state.fromToken) {
      //   state.fromToken = list[0];
      //   state.toToken = list[1];
      // }
    },
    setLang(state, lang) {
      localStorage.setItem('lang', lang)
      state.lang = lang
    },
    setInfo(state, obj) {
      state.info = obj
    },
    // setExchangeData(state, obj) {
    //   state.exchangeData = obj;
    // },
    setShowTradeBox(state, val) {
      state.showTradeBox = val
    },
    setOrder(state, val) {
      state.order = val
    },
    setInputSource(state, val) {
      state.inputSource = val
    },
    setTrcKeyDex(state, dex) {
      state.trcKeyDex = dex
    },
    setIsWalletConnect(state, b) {
      state.isWalletConnect = b
    },
    setNFTList(state, list) {
      state.NFTList = list
    },
    setNFTChange(state, b) {
      state.NFTChange = b
    },
    setNFTInfo(state, data) {
      state.NFTInfo = data
    },
    setPriceList(state, list) {
      state.priceList = list
    },
    setUpdating(state, b) {
      state.updating = b
    },
    setSwapConfirm(state, b) {
      state.swapConfirm = b
    },
    setTabActive(state, val) {
      state.tabActive = val
    },
    setQRcode(state, val) {
      state.qrcode = val
    },
    setRecordType(state, val) {
      state.recordType = val
    },
    setNFTFromToken(state, token) {
      state.NFTFromToken = token
    },
    setNFTToToken(state, token) {
      state.NFTToToken = token
    },
    setCoinListChain(state, list) {
      state.coinListChain = list
    },
    setNftFilterBSC(state, val) {
      state.nftFilter.BSC = val
    },
    setNftFilterETH(state, val) {
      state.nftFilter.ETH = val
    },
    setNftFilterPOLYGON(state, val) {
      state.nftFilter.POLYGON = val
    },
    setNftFilterBuyNow(state, val) {
      state.nftFilter.buyNow = val
    },
    setNftFilterSort(state, val) {
      state.nftFilter.sort = val
    },
    setReceiveAddressNFT(state, address) {
      state.receiveAddressNFT = address
    },
    setRpcObject(state, data) {
      state.rpcObject = data
    },
    setChainList(state, list) {
      state.chainList = list
    },
    setShowChainList(state, list) {
      state.showChainList = list
    },
    setSupportChianArr(state, list) {
      state.supportChianArr = list
    },
    setBridgeTokens(state, list) {
      state.bridgeTokens = list
    },
    setBridgeChooseToken(state, val) {
      state.bridgeChooseToken = val
    },

    setBridgeFromTokenchain(state, val) {
      state.bridgeFromTokenchain = val
    },
    setBridgeToTokenchain(state, val) {
      state.bridgeToTokenchain = val
    },
    setallSupportChianArr(state, list) {
      state.allSupportChianArr = list
    },
    setSpaceIdDomain(state, val) {
      state.spaceIdDomain = val
    },
    setIsFreeGas: (state, val) => {
      state.isFreeGas = val
    },
    setIsUserChoose: (state, val) => {
      state.isUserChoose = val
    },
    setFIODomain(state, val) {
      state.FIODomain = val
    },
    setIsPlenaConnect(state, b) {
      state.isPlenaConnect = b
    },
    setTopic(state, val) {
      state.topic = val
    },
    setgasToToken(state, val) {
      state.gasToToken = val
    },
    setgasFromToken(state, val) {
      state.gasFromToken = val
    },
    setbalanceOptions(state, val) {
      state.balanceOptions = val
    },
    setinscriptionId(state, val) {
      state.inscriptionId = val
    },
    setWalletConnect_uri(state, val) {
      state.walletConnect_uri = val
    }
  },
  actions: {},
  modules: {},
})
