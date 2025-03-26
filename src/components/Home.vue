<template>
  <div class="home">
    <div v-if="isServe" class="container">
      <Header />
      <HeaderInfo />
      <div class="home-cont" v-if="showTradeBox">
        <div class="home-cont-trade" :class="isPC ? 'pc' : ''">
          <Tab />
          <Trade
            v-if="
              tabActive == 'swap' ||
              tabActive == 'gasSwap' ||
              tabActive == 'addLiquidity' ||
              tabActive == 'bridge'
            "
          />
        </div>
      </div>
      <Record v-show="showTradeBox && tabActive != 'addLiquidity'" />
      <Records v-if="!showTradeBox" />
      <Order ref="order" />
      <div class="online-service" @click="openServiceDialog('icon')">
        <img src="../assets/img/service.svg" alt="" />
        <div class="service-text" v-if="isPC">{{ $t('support') }}</div>
      </div>
      <ServiceDialog
        v-if="ServiceDialog"
        @closeServiceDialog="closeServiceDialog"
        @openbAIServiceDialog="openbAIServiceDialog"
      />
      <ServiceDialogAi
        v-if="AIServiceDialog"
        @openServiceDialog="openServiceDialog"
        @closeAIServiceDialog="closeAIServiceDialog"
      />
      <AdvertiseAlert
        v-if="isAlert"
        ref="advertise"
        :alertImgObj="alertImgObj"
      ></AdvertiseAlert>
    </div>
    <NoServePage v-if="!isServe" />
    <Footer v-if="isServe" />
  </div>
</template>

<script>
const Record = () => import('./Record')
const Records = () => import('./Records')
const Order = () => import('./Order')
const Footer = () => import('./Footer')
const AdvertiseAlert = () => import('./advertiseAlert')
const Tab = () => import('./Tab')
const NoServePage = () => import('./NoServePage')
const ServiceDialog = () => import('../components/common/ServiceDialog')
const ServiceDialogAi = () => import('../components/common/ServiceDialogAi')
import Header from './Header'
import Trade from './Trade'
import HeaderInfo from './HeaderInfo'
import baseApi from '../api/baseApi'

export default {
  name: 'Home',
  components: {
    Header,
    Trade,
    Record,
    Records,
    Order,
    HeaderInfo,
    Footer,
    AdvertiseAlert,
    Tab,
    NoServePage,
    ServiceDialog,
    ServiceDialogAi,
  },
  data() {
    return {
      className: 'home',
      isAlert: false,
      sourceFlag: localStorage.getItem('sourceFlag'),
      bridgersFlag: '',
      isServe: true,
      timer: null,
      alertImgObj: {},
      twFlag: localStorage.getItem('twFlag'),
      AIServiceDialog: false, // AI对话框
      ServiceDialog: false, //英文客服
      // showTradeBox: true,
      supportBridgers: [], //bridgers 支持的链
    }
  },
  computed: {
    showOnline() {
      return true
    },
    order() {
      return this.$store.state.order
    },
    lang: {
      get() {
        return this.$store.state.lang
      },
      set(val) {
        this.$store.commit('setLang', val)
      },
    },
    showTradeBox: {
      get() {
        return this.$store.state.showTradeBox
      },
      set(val) {
        this.$store.commit('setShowTradeBox', val)
      },
    },
    tabActive: {
      get() {
        return this.$store.state.tabActive
      },
    },
  },
  async created() {
    if (this.isPC) {
      this.className = 'home-pc'
    }
    this.sourceFlag = localStorage.getItem('sourceFlag')
    this.bridgersFlag = localStorage.getItem('bridgersFlag')
    this.initEnter()
    clearInterval(this.timer)
    if (location.href.indexOf('localhost') == -1) {
      this.timer = setInterval(() => {
        this.initEnter()
      }, 10000)
    }
    if (this.sourceFlag == 'linknft') {
      //this.$store.commit('setTabActive', 'NFT')
    }
    this.getAlertImg()
    // this.$store.commit("setCoinList", list.data);

    //获取rpc
    this.publicNode()
    //获取跨连桥 list
    this.queryChainByCode()
    await this.getChainList()
    if (this.bridgersFlag == 'bridgers') {
      this.queryBridgersCoinList()
    } else {
      this.getCoinList()
    }
  },
  methods: {
    initEnter() {
      const params = {
        sourceFlag: this.sourceFlag,
      }
      baseApi.swftFeeAdvertising(params).then((res) => {
        if (res.resCode == '800') {
          // 制裁国不允许兑换
          if (res.data.used) {
            localStorage.setItem('isLimit', '1')
            this.isServe = true
          } else {
            localStorage.setItem('isLimit', '0')
            if (window.location.href.indexOf('http://localhost') == -1) {
              if (this.sourceFlag != 'HN') {
                // location.href = 'https://www.swftc.info/swft-v3/noServe.html'
                this.isServe = false
              }
            }
          }
        }
      })
    },
    openbAIServiceDialog() {
      this.AIServiceDialog = true
      this.ServiceDialog = false
    },
    closeAIServiceDialog() {
      this.AIServiceDialog = false
    },
    openServiceDialog() {
      this.ServiceDialog = true
      this.AIServiceDialog = false
    },
    closeServiceDialog() {
      this.ServiceDialog = false
    },
    queryChainByCode() {
      baseApi
        .queryChainByCode({
          mainNetwork: '',
        })
        .then((res) => {
          res.forEach((item) => {
            this.$set(item, 'balance', 0)
            this.$set(item, 'toBalance', 0)
            item.chains.forEach((list) => {
              this.$set(list, 'balance', '--')
            })
          })
          this.$store.commit('setBridgeTokens', res)
        })
    },
    publicNode() {
      baseApi.publicNode({}).then((res) => {
        let rpcObject = {}
        const data = res.data
        for (let key in data) {
          if (key == 'EVM') {
            key = 'EOS(EVM)'
          }
          this.$set(
            rpcObject,
            key,
            data[key == 'EOS(EVM)' ? 'EVM' : key].split(','),
          )
        }

        this.$store.commit('setRpcObject', rpcObject)
      })
    },
    queryBridgersCoinList() {
      const CoinList = JSON.parse(localStorage.getItem('CoinList'))
      if (CoinList && CoinList != '') {
        this.$store.commit('setCoinList', CoinList)
      }
      baseApi.queryCoinList().then((res) => {
        const arr = []
        let list = []
        this.supportBridgers.forEach((item) => {
          res.data.forEach((l) => {
            if (l.mainNetwork == item) {
              list.push(l)
            }
          })
        })
        // const list = res.data.filter(
        //   (item) =>
        //     item.mainNetwork === 'ETH' ||
        //     item.mainNetwork === 'BSC' ||
        //     item.mainNetwork === 'HECO' ||
        //     item.mainNetwork === 'POLYGON' ||
        //     item.mainNetwork === 'OKExChain' ||
        //     item.mainNetwork === 'TRX' ||
        //     item.mainNetwork === 'FTM' ||
        //     item.mainNetwork === 'ARB' ||
        //     item.mainNetwork === 'CRONOS' ||
        //     item.mainNetwork === 'AVAXC' ||
        //     item.mainNetwork === 'Optimism' ||
        //     item.mainNetwork === 'APT',
        // )
        list.forEach((e) => {
          const mainNetwork = e.mainNetwork || e.coinCode
          if (!arr.includes(mainNetwork)) {
            arr.push(mainNetwork)
          }
        })
        if (Array.isArray(res && res.data)) {
          this.$store.commit('setCoinList', list)
          localStorage.setItem('CoinList', JSON.stringify(list))
        }
      })
    },
    // 获取币种列表
    getCoinList() {
      const CoinList = JSON.parse(localStorage.getItem('CoinList'))
      if (CoinList && CoinList != '') {
        this.$store.commit('setCoinList', CoinList)
      }
      baseApi.queryCoinList().then((res) => {
        const arr = []
        let list = res.data
        list.forEach((e) => {
          if (e.mainNetwork == 'EVM') {
            e.mainNetwork = 'EOS(EVM)'
          }
          const mainNetwork = e.mainNetwork || e.coinCode
          if (!arr.includes(mainNetwork)) {
            arr.push(mainNetwork)
          }
        })

        if (Array.isArray(res && res.data)) {
          const filterList = list.filter(item => item.coinCode != 'LCT(BSC)')
          list = filterList
          const CMEMOList = list.filter( i => i.coinCode == 'MEMO(ERC20)' || i.coinCode == 'CMEMO(MEMO)' || i.coinCode == 'MEMO(MEMO)')
          const otherList = list.filter( i => i.coinCode != 'MEMO(ERC20)' && i.coinCode != 'CMEMO(MEMO)' && i.coinCode != 'MEMO(MEMO)')
          let nocoin = ''
          otherList.forEach( m => {
            nocoin += m.coinCode + ','
          })
          CMEMOList.forEach( m => {
            m.noSupportCoin = nocoin
          })
          this.$store.commit('setCoinList', [...otherList,...CMEMOList])
          localStorage.setItem('CoinList', JSON.stringify([...otherList,...CMEMOList]))
        }
      })
    },
    // 获取币种的链列表
    async getChainList() {
      const res = await baseApi.queryChainByConfig()
      const arr = []
      const supportChianArr = []
      const supportChian_all = []
      const list = res
      list.forEach((e) => {
        if (e.chain == 'EVM') {
          e.chain = 'EOS(EVM)'
        }
        arr.push(e.chain)
        if (e.isSupport == 'Y') {
          supportChianArr.push(e.chain)
          if (e.chain == 'TRON') {
            supportChian_all.push('TRX')
          } else if (e.chain == 'Polkadot') {
            supportChian_all.push('DOT')
          } else {
            supportChian_all.push(e.chain)
          }
        }
        if (e.isBridgers == 'Y') {
          if (e.chain == 'TRON') {
            this.supportBridgers.push('TRX')
          } else {
            this.supportBridgers.push(e.chain)
          }
        }
      })
      this.$store.commit('setChainList', list)
      this.$store.commit('setShowChainList', arr)
      this.$store.commit('setSupportChianArr', supportChianArr.reverse())
      this.$store.commit('setallSupportChianArr', supportChian_all)
    },
    async getPathNftList() {
      const NFTList = JSON.parse(localStorage.getItem('NFTList'))
      if (NFTList && NFTList != '') {
        this.$store.commit('setNFTList', NFTList)
      }
      const res = await baseApi.getNftCoinList()
      if (res.resCode == 100) {
        const list = res.data.tokens.NFT
        if (Array.isArray(list) && list.length > 0) {
          list.forEach((item) => {
            this.$set(item, 'balance', '0')
            this.$set(item, 'contact', item.address)
            this.$set(item, 'coinCode', item.symbol)
            this.$set(item, 'mainNetwork', 'NFT')
          })
          this.$store.commit('setNFTList', list)
          localStorage.setItem('NFTList', JSON.stringify(list))
        }
      }
    },
    linkContact() {
      if (this.twFlag == 'miningtw') {
        window.open(
          'https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=782460&uid=&customSource=miningtw',
        )
      }
      window.open(
        'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha',
      )
    },
    getAlertImg() {
      const params = {
        sourceFlag: this.sourceFlag,
      }
      baseApi.widgetNotification(params).then((res) => {
        if (res.resCode == '800') {
          this.alertImgObj = res.data
          this.isAlert =
            res.data.cn.isShow == 'Y' || res.data.en.isShow == 'Y'
              ? true
              : false
        }
      })
    },
    customerService() {
      var Tawk_API = Tawk_API || {},
        Tawk_LoadStart = new Date()

      var s1 = document.createElement('script'),
        s0 = document.getElementsByTagName('script')[0]

      s1.async = true
      s1.src = 'https://embed.tawk.to/6433ae444247f20fefeabe57/1gtku1fhl'
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      s0.parentNode.insertBefore(s1, s0)
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  watch: {
    // lang(val, old) {
    //   if ((val == 'en' && this.sourceFlag != 'widget-defi') || ( val == 'korea' && this.sourceFlag != 'widget-defi')) {
    //     this.customerService()
    //     if (document.getElementsByClassName('widget-visible').length > 0) {
    //       document
    //         .getElementsByClassName('widget-visible')[0]
    //         .style.setProperty('display', 'block', 'important')
    //     }
    //   }
    //   if (val == 'zh' || val == 'zht' || this.sourceFlag == 'widget-defi') {
    //     if (document.getElementsByClassName('widget-visible').length > 0) {
    //       document
    //         .getElementsByClassName('widget-visible')[0]
    //         .style.setProperty('display', 'none', 'important')
    //     }
    //   }
    // },
  },
}
</script>
<style lang="scss" scoped>
.container {
  min-height: calc(100% - 100px);
  .online-service {
    height: 0.73rem;
    position: fixed;
    bottom: 20px;
    right: 25px;
    z-index: 89;
    border-radius: 0.73rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 0.09rem;
    background: #ffffff;
    border: 1px solid #277ffa;
    &:hover {
      .service-text {
        display: block;
      }
    }
    .service-text {
      flex: 1;
      text-align: center;
      color: #277ffa;
      font-size: 0.28rem;
      font-weight: bold;
      display: none;
      padding: 0 0.25rem 0 0.1rem;
    }
    img {
      width: 0.8rem;
      cursor: pointer;
    }
  }
  .defaultBg {
    background: #277ffa;
  }
}
.home {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .home-cont {
    display: flex;
    justify-content: space-between;
    .home-cont-trade {
      width: calc(100% - 12px);
      box-sizing: border-box;
      padding: 6px;
      margin-left: 6px;
      &.pc {
        width: 560px;
        margin: 0 auto;
      }
      // background-color: #ff0;
    }
  }
}
</style>
<style lang="scss">
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #aab0c8;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ffffff;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ffffff;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #ffffff;
}
</style>
