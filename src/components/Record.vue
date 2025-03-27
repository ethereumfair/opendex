<template>
  <div class="record" :class="isPC ? 'pc' : ''">
    <div class="top">
      <img class="img" src="../assets/img/more.png" alt="" />
      <span class="title">{{ $t('record') }} </span>
      <span class="more" @click="showRecord">{{ $t('more') }}></span>
    </div>
    <RecordTab v-if="bridgersFlag !== 'bridgers'" />
    <div
      class="box"
      v-for="(item, index) in list"
      :key="index"
      @click="orderDetail(item)"
    >
      <div class="box-top">
        <span class="time">{{ item.beginDate || item.createTime }}</span>
        <span
          class="status"
          :style="{
            color: orderStatus(item.detailState || item.orderStatus)[1],
          }"
          >{{ orderStatus(item.detailState || item.orderStatus)[0] }}</span
        >
      </div>
      <div class="box-cont">
        <div class="left">
          <!-- <img :src="`https://transfer.swft.pro/swft-v3/images/coins/${item.coinCode}.png`" alt=""> -->

          <div class="img">
            <img
              v-if="item.isNft === '' || item.orderSide == '1'"
              :src="`https://transfer.swft.pro/swft-v3/images/coins/${
                item.fromCoinCode || item.depositCoinCode
              }.png`"
              alt=""
            />
            <img
              v-else
              :src="
                item.isNft === 'sell'
                  ? item.nftUrl || item.nftLogoUrl
                  : item.payTokenUrl
              "
              alt=""
            />
          </div>
          <div class="coin">
            <div class="coin-name">
              {{
                item.isNft == 'sell'
                  ? item.nftName
                  : item.fromCoinCode || item.depositCoinCode
              }}
            </div>
            <div class="coin-number">
              {{
                Number(item.fromCoinAmt || item.depositCoinAmt).toFixed(6) - 0
              }}
            </div>
          </div>
        </div>
        <div class="center">
          <svg class="icon dh-icon" aria-hidden="true">
            <use xlink:href="#icon-duihuan1"></use>
          </svg>
        </div>
        <div class="right">
          <div class="img">
            <img
              v-if="item.isNft === '' || item.orderSide == '0'"
              :src="`https://transfer.swft.pro/swft-v3/images/coins/${
                item.toCoinCode || item.receiveCoinCode
              }.png`"
              alt=""
            />
            <img
              v-else
              :src="
                item.isNft === 'buy'
                  ? item.nftUrl || item.nftLogoUrl
                  : item.payTokenUrl
              "
              alt=""
            />
          </div>
          <div :class="isPC ? 'coinPC coin' : 'coin'">
            <div class="coin-name">
              {{
                item.isNft === 'buy'
                  ? item.nftName
                  : item.toCoinCode || item.receiveCoinCode
              }}
            </div>
            <div class="coin-number">
              <template
                v-if="
                  item.detailState === 'receive_complete' ||
                  item.detailState === 'wait_receive_confirm' ||
                  item.detailState === 'wait_partial_refund' ||
                  item.detailState === 'wait_partial_refund_confirm' ||
                  item.detailState === 'partial_complete' ||
                  item.detailState === 'wait_partial_send_confirm_error' ||
                  item.detailState === 'wait_partial_refund_confirm_error' ||
                  item.detailState === 'wait_partial_send' ||
                  item.detailState === 'wait_partial_send_confirm' ||
                  item.detailState === 'wait_deposit_send_error' ||
                  item.isNft !== '' ||
                  (item.router && item.router.router === 'bridgers1') ||
                  (item.router && item.router.router === 'bridgers2')
                "
              >
                {{
                  Number(item.toCoinAmt || item.receiveCoinAmt).toFixed(6) - 0
                }}
              </template>
              <template v-else>
                {{
                  (
                    item.fromCoinAmt *
                      item.instantRate *
                      (1 - item.depositFeeRate) -
                    item.chainFee
                  ).toFixed(6) - 0
                }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AIChooseToken ref="AIChooseToken" :tokenData="tokenData" />
  </div>
</template>
<script>
import baseApi from '../api/baseApi'
import errorCode from '../utils/language.js'
import RecordTab from './common/RecordTab.vue'
import AIChooseToken from './common/AIChooseToken.vue'
import BridgersRecordTab from './common/BridgersRecordTab.vue'
export default {
  name: 'Record',
  data() {
    return {
      list: [],
      timer: null, //查询订单计时器
      detailinfoTimer: null,
      sourceFlag: localStorage.getItem('sourceFlag'),
      bridgersFlag: localStorage.getItem('bridgersFlag'),
      isFirst: false,
      tokenData: null
    }
  },
  components: {
    RecordTab,
    BridgersRecordTab,
    AIChooseToken
  },
  computed: {
    recordType: {
      get() {
        return this.$store.state.recordType
      },
      set(val) {
        this.$store.commit('setRecordType', val)
      },
    },
    walletAddress: {
      get() {
        if (this.$store.state.chainId == '000') {
          return this.$store.state.walletPolkadot.addrSS58
        } else if (this.$store.state.chainId == '222') {
          return this.$store.state.walletPolkadot.addrSS58CRU
        } else if (this.$store.state.chainId == '333') {
          return this.$store.state.walletPolkadot.addrSS58DBC
        } else if (this.$store.state.chainId == '0') {
          return this.$store.state.walletTRON
        } else {
          return this.$store.state.wallet.address
        }
      },
    },
    tabActive: {
      get() {
        return this.$store.state.tabActive
      },
    },
    isUserChoose() {
      return this.$store.state.isUserChoose
    },
    fromToken: {
        get() {
            if (this.tabActive == 'bridge') {
            return this.bridgeFromTokenchain
            }
            return this.$store.state.fromToken
        },
    },
    toToken: {
        get() {
            if (this.tabActive == 'bridge') {
            return this.bridgeToTokenchain
            }
            return this.$store.state.toToken
        },
    },
  },
  methods: {
    showRecord() {
      this.$store.commit('setShowTradeBox', false)
    },
    queryAllTrade() {
      const self = this
      clearInterval(this.timer)
      self.timer = null
      self.queryAjax()
      self.timer = setInterval(() => {
        self.queryAjax()
      }, 5000)
    },
    //获取订单记录列表
    async queryAjax() {
      if (this.walletAddress === '') {
        clearInterval(this.timer)
        this.list = []
        return
      }
      const params = {
        pageNo: 1,
        pageSize: 5,
        fromAddress: this.walletAddress,
      }
      if (this.recordType === 'OmniBridge') {
        const res = await baseApi.queryAllTrade(params)
        if (res && res.resCode == 800) {
          if (this.walletAddress !== '') {
            let list = res.data.pageContent
            list.forEach((element) => {
              if (element.isNft != '' && element.router) {
                element.isNft = ''
              }
            })
            this.list = list
          }
          if(this.isFirst && this.list.length > 0 && this.tabActive == 'swap' && !this.isUserChoose){
            this.AISetToken(this.list[0])
          }
          this.isFirst = false
        }
      } else if (this.recordType === 'bridgers1') {
        const res = await baseApi.getTransData(params)
        if (res.resCode == 100) {
          const list = res.data.list
          list.forEach((item) => {
            this.$set(item, 'beginDate', item.createTime)
            this.$set(item, 'isNft', '')
            this.$set(item, 'detailState', item.status)
            this.$set(item, 'fromCoinAmt', item.fromTokenAmount)
            this.$set(item, 'toCoinAmt', item.toTokenAmount)
            this.$set(item, 'router', {
              router: 'bridgers1',
            })
          })
          this.list = list
        }
      } else if (this.recordType === 'bridgers2') {
        const res = await baseApi.getbridgers2TransData(params)
        if (res.resCode == 100) {
          const list = res.data.list
          list.forEach((item) => {
            this.$set(item, 'beginDate', item.createTime)
            this.$set(item, 'isNft', '')
            this.$set(item, 'detailState', item.status)
            this.$set(item, 'fromCoinAmt', item.fromTokenAmount)
            this.$set(item, 'toCoinAmt', item.toTokenAmount)
            this.$set(item, 'router', {
              router: 'bridgers2',
            })
          })
          this.list = list
        }
      } else if (this.recordType === 'NFT') {
        const res = await baseApi.queryAllNftTrade(params)
        if (res && res.resCode == 800) {
          if (this.walletAddress !== '') {
            let list = res.data.pageContent
            this.list = list
          }
        }
      }
    },

    //获取订单详情
    async orderDetail(item) {
      this.$bus.emit('showOrderHandle', true)
      if (item.router && item.router.router === 'bridgers1') {
        const res = await baseApi.getTransDataById({ orderId: item.orderId })
        if (res.resCode == '100') {
          let data = res.data
          this.$set(data, 'orderdetailStatus', this.orderStatus(data.status))
          this.$set(data, 'beginDate', data.createTime)
          this.$set(data, 'isNft', '')
          this.$set(data, 'detailState', data.status)
          this.$set(data, 'fromCoinAmt', data.fromTokenAmount)
          this.$set(data, 'toCoinAmt', data.toTokenAmount)
          this.$set(data, 'refundAddr', data.fromAddress)
          this.$set(data, 'destinationAddr', data.toAddress)
          this.$set(data, 'depositCoinCode', data.fromCoinCode)
          this.$set(data, 'depositCoinAmt', data.fromCoinAmt)
          this.$set(data, 'receiveCoinAmt', data.toCoinAmt)
          this.$set(data, 'receiveCoinCode', data.toCoinCode)
          this.$set(data, 'depositTxid', data.hash)
          this.$set(data, 'transactionId', data.toHash)

          this.$set(data, 'router', {
            router: 'bridgers1',
          })
          this.$store.commit('setOrder', data)
          this.$bus.emit('isShowStatus')
        } else {
        }
      } else if (item.router && item.router.router === 'bridgers2') {
        const res = await baseApi.getbridgers2TransDataById({
          orderId: item.orderId,
        })
        if (res.resCode == '100') {
          let data = res.data
          this.$set(data, 'orderdetailStatus', this.orderStatus(data.status))
          this.$set(data, 'beginDate', data.createTime)
          this.$set(data, 'isNft', '')
          this.$set(data, 'detailState', data.status)
          this.$set(data, 'fromCoinAmt', data.fromTokenAmount)
          this.$set(data, 'toCoinAmt', data.toTokenAmount)
          this.$set(data, 'refundAddr', data.fromAddress)
          this.$set(data, 'destinationAddr', data.toAddress)
          this.$set(data, 'depositCoinCode', data.fromCoinCode)
          this.$set(data, 'depositCoinAmt', data.fromCoinAmt)
          this.$set(data, 'receiveCoinAmt', data.toCoinAmt)
          this.$set(data, 'receiveCoinCode', data.toCoinCode)
          this.$set(data, 'depositTxid', data.hash)
          this.$set(data, 'transactionId', data.toHash)

          this.$set(data, 'router', {
            router: 'bridgers2',
          })
          this.$store.commit('setOrder', data)
          this.$bus.emit('isShowStatus')
        } else {
        }
      } else if (item.router && item.router === 'NFT') {
        const res = await baseApi.queryOrderStateNFT({ orderId: item.orderId })
        if (res.resCode == 800) {
          const data = res.data
          this.$set(
            data,
            'orderdetailStatus',
            this.orderStatus(res.data.orderStatus),
          )

          this.$store.commit('setOrder', data)
          this.$bus.emit('isShowStatus')
        } else {
          errorCode(res.resCode, this)
        }
      } else {
        const res = await baseApi.queryOrderState({ orderId: item.orderId })
        if (res.resCode == 800) {
          const data = res.data
          this.$set(
            data,
            'orderdetailStatus',
            this.orderStatus(res.data.detailState),
          )
          if (data.isNft != '' && data.router) {
            data.isNft = ''
          }
          this.$store.commit('setOrder', data)
          this.$bus.emit('isShowStatus')
        } else {
          errorCode(res.resCode, this)
        }
      }
    },
    // not_complete：未完成、
    // exchange：交换中、
    // complete：完成
    // timeout：超时、
    // trade_fail：兑换失败

    //解析订单状态
    orderStatus(str) {
      let statusData = [this.$t('wait_deposit_send'), '#707B9E', 1, 'loading', false]
      switch (str) {
        case 'wait_deposits':
          statusData[0] = this.$t('wait_deposit_send') //wait_deposit_send   等待存币
          statusData[1] = '#707B9E'
          statusData[2] = 1 
          statusData[3] = 'loading'
          statusData[4] = false   //是否是最终状态
          break
        case 'wait_deposit_send_fail':
          statusData[0] = this.$t('deposit_failed') //wait_deposit_send_fail  存币失败
          statusData[1] = '#FF8484'
          statusData[2] = 1
          statusData[3] = false
          statusData[4] = true
          break
        case 'wait_deposit_send_error':
          statusData[0] = this.$t('trade_fail') //wait_deposit_send_error   存币失败
          statusData[1] = '#FF8484'
          statusData[2] = 1
          statusData[3] = false
          statusData[4] = true   //是否是最终状态
          break
        case 'wait_detect':
          statusData[0] = this.$t('wait_deposit_send') //NFT接口  等待存币
          statusData[1] = '#707B9E'
          statusData[2] = 1
          statusData[3] = 'loading'
          statusData[4] = false   //是否是最终状态
          break
        case 'exchange':
          statusData[0] = this.$t('exchangeIng') //wait_deposit_send   兑换中
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] = false   //是否是最终状态
          break
        case 'wait_exchange':
          statusData[0] = this.$t('exchangeIng') //NFT接口 交换中
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] = false   //是否是最终状态
          break
        case 'trade_fail':
          statusData[0] = this.$t('trade_fail') //wait_deposit_send   兑换失败
          statusData[1] = '#FF8484'
          statusData[2] = 2
          statusData[3] = false
          statusData[4] = true   //是否是最终状态
          break
        case 'fail':
          statusData[0] = this.$t('trade_fail') //wait_deposit_send   兑换失败
          statusData[1] = '#FF8484'
          statusData[2] = 2
          statusData[3] = false
          statusData[4] =  true  //是否是最终状态
          break
        case 'wait_deposit_send':
          statusData[0] = this.$t('wait_deposit_send') //wait_deposit_send   等待存币
          statusData[1] = '#707B9E'
          statusData[2] = 1
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_receive_send':
          statusData[0] = this.$t('wait_receive_send') //wait_receive_send  等待发币
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_send':
          statusData[0] = this.$t('wait_receive_send') //linknft 等待发币
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break

        case 'wait_receive_confirm':
          statusData[0] = this.$t('wait_receive_confirm') //wait_receive_confirm  等待发币确认
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_refund_send':
          statusData[0] = this.$t('wait_refund_send') //wait_refund_send  等待退币
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_refund':
          statusData[0] = this.$t('wait_refund_send') //linknft 等待退币
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break

        case 'wait_exchange_return':
          statusData[0] = this.$t('exchangeIng') //wait_exchange_return  等待交换结果
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_exchange_push':
          statusData[0] = this.$t('exchangeIng') //wait_exchange_push  等待交换推送
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_for_information':
          statusData[0] = this.$t('exchangeIng') // wait_for_information   等待用户联系
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'receive_complete':
          statusData[0] = this.$t('receive_complete') // receive_complete   发币完成
          statusData[1] = '#1eb740'
          statusData[2] = 4
          statusData[3] = true
          statusData[4] =  true  //是否是最终状态
          break
        case 'complete':
          statusData[0] = this.$t('receive_complete')
          statusData[1] = '#1eb740'
          statusData[2] = 4
          statusData[3] = true
          statusData[4] =  true  //是否是最终状态
          break
        case 'refund_complete':
          statusData[0] = this.$t('refund_complete') // refund_complete   退币完成
          statusData[1] = '#1eb740'
          statusData[2] = 2
          statusData[3] = true
          statusData[4] =  true  //是否是最终状态
          break
        case 'fail':
          statusData[0] = this.$t('refund_complete') // linknft 交易失败已退币   退币完成
          statusData[1] = '#1eb740'
          statusData[2] = 2
          statusData[3] = false
          statusData[4] =  true  //是否是最终状态
          break
        case 'refund_sending':
          statusData[0] = this.$t('refund_sending') // refund_sending   即将退币
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_kyc':
          statusData[0] = this.$t('exchangeIng') //  wait_kyc  需要kyc   WAIT_KYC
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'timeout':
          statusData[0] = this.$t('timeout') // timeout   超时
          statusData[1] = '#FF8484'
          statusData[2] = 1
          statusData[3] = false
          statusData[4] =  true  //是否是最终状态
          break
        case 'wait_refund_confirm':
          statusData[0] = this.$t('wait_refund_confirm') //wait_refund_confirm  等待退币确认
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_partial_send':
          statusData[0] = this.$t('wait_partial_send') //部分成交发币中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_partial_send_confirm':
          statusData[0] = this.$t('wait_partial_send_confirm') // 部分成交发币确认中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_partial_refund':
          statusData[0] = this.$t('wait_partial_refund') //部分成交退币中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_partial_refund_confirm':
          statusData[0] = this.$t('wait_partial_refund_confirm') //部分成交退币确认中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'partial_complete':
          statusData[0] = this.$t('partial_complete') //完成
          statusData[1] = '#1eb740'
          statusData[2] = 4
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'complete':
          statusData[0] = this.$t('receive_complete') //NFT接口 完成
          statusData[1] = '#1eb740'
          statusData[2] = 4
          statusData[3] = true
          statusData[4] =  true  //是否是最终状态
          break
        case 'wait_partial_send_confirm_error':
          statusData[0] = this.$t('wait_partial_send_confirm_error') //部分成交发币确认中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        case 'wait_partial_refund_confirm_error':
          statusData[0] = this.$t('wait_partial_refund_confirm_error') //部分成交退币确认中…
          statusData[1] = '#707B9E'
          statusData[2] = 3
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
          break
        default:
          statusData[0] = this.$t('exchangeIng')
          statusData[1] = '#707B9E'
          statusData[2] = 2
          statusData[3] = 'loading'
          statusData[4] =  false  //是否是最终状态
      }
      return statusData
    },
    async AISetToken(item){
      const res = await baseApi.queryCoinList()
      if(res.resCode == 800){
        const coinList = res.data
        // 获取from 币种
         const from = coinList.filter( list => list.coinCode === item.fromCoinCode)
         //获取to 币种
         const to = coinList.filter( list => list.coinCode === item.toCoinCode)
        if(this.fromToken && this.toToken && this.fromToken.coinCode == from[0].coinCode && this.toToken.coinCode == to[0].coinCode) return
        if(from.length > 0 && to.length > 0){
          this.tokenData = {
            from: from[0],
            to: to[0]
          }
          this.$refs.AIChooseToken.show = true
        }
      }
    }
  },
  watch: {
    '$store.state.wallet': {
      deep: true,
      handler: function (newV) {
        this.queryAllTrade()
      },
    },
    '$store.state.walletPolkadot': {
      deep: true,
      handler: function (newV) {
        this.queryAllTrade()
      },
    },
    recordType: {
      deep: true,
      handler: function (newV) {
        this.list = []
        this.queryAllTrade()
      },
    },
    walletAddress(address){
      if(address != ''){
        this.isFirst = true
      }
    }
  },
  created() {
    if (this.bridgersFlag == 'bridgers') {
      this.recordType = 'bridgers1'
    } else {
      this.recordType = 'OmniBridge'
    }
    this.$bus.on('queryAllTradeHandle', this.queryAllTrade)
    if (
      this.$store.state.wallet.address !== '' ||
      this.$store.state.wallet.address !== null
    ) {
      this.queryAllTrade()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.$bus.off('queryAllTradeHandle', this.queryAllTrade)
  },
}
</script>
<style lang="scss" scoped>
.record {
  margin: 0 10px 20px;
  padding-bottom: 50px;
  font-size: 12px;
  &.pc {
    width: 548px !important;
    margin: 0 auto 60px;
    padding: 6px;
  }
  .top {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .title {
      font-size: 0.33rem;
      font-family: Poppins;
      color: #292929;
      position: absolute;
      left: 0.55rem;
    }
    .img {
      position: absolute;
      left: 0;
      width: 0.44rem;
      height: 0.44rem;
    }
    .more {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.296rem;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #3184fa;
      cursor: pointer;
      position: absolute;
      right: 0;
      padding: 5px 10px;
      border-radius: 12px;
      background: rgba(244, 248, 255, 0.8);
    }
  }
  .box {
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 17px;
    overflow: hidden;
    .box-top {
      padding: 0 0.37rem;
      height: 0.74rem;
      line-height: 0.74rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f1f4f9;
      font-size: 14px;
      font-family: Poppins-Medium, Poppins;
      font-weight: 500;
      color: #292929;
      .status {
        font-size: 12px;
        font-family: Poppins-SemiBold, Poppins;
        font-weight: 600;
        color: #1eb740;
      }
    }
    .box-cont {
      height: 1.48rem;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      cursor: pointer;
      .left,
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(50% - 0.37rem);
        img {
          width: 0.83rem;
          height: 0.83rem;
          padding: 0.27rem;
        }
        .coin {
          width: calc(100% - 1.47rem);
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          align-items: center;
          div {
            width: 100%;
            text-align: left;
          }
          .coin-name {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            font-size: 0.296rem;
          }
          .coin-number {
            font-size: 0.259rem;
            color: #6b6c70;
          }
        }
      }
      .center {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          width: 0.74rem;
          height: 0.74rem;
          border: 1px solid #e5eaf3;
          border-radius: 0.27rem;
        }
      }
    }
  }
  // }
}
</style>
