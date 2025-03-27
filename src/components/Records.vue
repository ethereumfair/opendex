<template>
  <div class="main" :class="isPC ? 'pc' : ''">
    <div class="back">
      <img @click="goBack" src="../assets/img/back.png" alt="" />
      <RecordTab v-if="bridgersFlag !== 'bridgers'" />
      <BridgersRecordTab v-if="bridgersFlag == 'bridgers'" />
    </div>
    <div class="top">
      <span class="title">{{ $t('record') }} </span>
    </div>
    <div v-if="show">
      <List
        v-model="loading"
        :finished="finished"
        finished-text=""
        :loading-text="$t('loading')"
        @load="onLoad"
      >
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
                  {{ item.fromCoinCode || item.depositCoinCode }}
                </div>
                <div class="coin-number">
                  {{
                    Number(item.fromCoinAmt || item.depositCoinAmt).toFixed(6) -
                    0
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
              <div class="coin">
                <div class="coin-name">
                  {{ item.toCoinCode || item.nftName }}
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
                      item.detailState ===
                        'wait_partial_refund_confirm_error' ||
                      item.detailState === 'wait_partial_send' ||
                      item.detailState === 'wait_partial_send_confirm' ||
                      item.detailState === 'wait_deposit_send_error' ||
                      item.isNft !== '' ||
                      (item.router && item.router.router === 'bridgers1') ||
                      (item.router && item.router.router === 'bridgers2')
                    "
                  >
                    {{
                      Number(item.toCoinAmt || item.receiveCoinAmt).toFixed(6) -
                      0
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
      </List>
    </div>
    <div v-if="!loading && list.length == 0">
      <img
        src="../assets/img/noData.png"
        width="206px"
        height="156px"
        style="margin: 50px auto"
        alt=""
      />
      <p style="font-family: Poppins-SemiBold; color: #aab0c8">
        {{ $t('noRecod') }}
      </p>
    </div>
  </div>
</template>
<script>
import baseApi from '../api/baseApi'
import { List } from 'vant'
import errorCode from '../utils/language.js'
import RecordTab from './common/RecordTab.vue'
import BridgersRecordTab from './common/BridgersRecordTab.vue'

export default {
  name: 'Records',
  data() {
    return {
      className: 'home-pc',
      list: [],
      loading: false,
      finished: false,
      pageSize: 10,
      pageNo: 0,
      show: false,
      sourceFlag: localStorage.getItem('sourceFlag'),
      bridgersFlag: localStorage.getItem('bridgersFlag'),
    }
  },
  components: {
    List,
    RecordTab,
    BridgersRecordTab,
  },
  watch: {
    '$store.state.wallet': {
      deep: true,
      handler: function (newV) {
        this.goBack()
      },
    },
    '$store.state.walletPolkadot': {
      deep: true,
      handler: function (newV) {
        this.goBack()
      },
    },
    recordType: {
      deep: true,
      handler: function (newV) {
        const self = this
        this.list = []
        this.pageNo = 0
        this.show = false
        setTimeout(() => {
          self.show = true
          self.finished = false
          //this.onLoad()
        }, 50)
      },
    },
  },
  created() {
    if (this.bridgersFlag == 'bridgers') {
      this.recordType = 'bridgers1'
    } else {
      this.recordType = 'OmniBridge'
    }
    //this.queryAjax()
    this.show = true
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
  },
  methods: {
    onLoad() {
      // 异步更新数据
      this.pageNo++
      this.queryAjax()
    },
    goBack() {
      this.$store.commit('setShowTradeBox', true)
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
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        fromAddress: this.walletAddress,
      }
      if (this.recordType === 'OmniBridge') {
        const res = await baseApi.queryAllTrade(params)
        if (res.resCode == 800) {
          let list = res.data.pageContent
          list.forEach((element) => {
            if (element.isNft != '' && element.router) {
              element.isNft = ''
            }
          })
          if (res.data.pageNo === 1) {
            this.list = list
          } else {
            this.list = [...this.list, ...list]
          }
          if (this.list.length === res.data.totalCount) {
            this.finished = true
          }
        }
        this.loading = false
      } else if (this.recordType === 'bridgers1') {
        const res = await baseApi.getTransData(params)
        if (res.resCode == 100) {
          let list = res.data.list
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
          if (res.data.pageNo === 1) {
            this.list = list
          } else {
            this.list = [...this.list, ...list]
          }
          if (this.list.length === res.data.total) {
            this.finished = true
          }
        }
        this.loading = false
      } else if (this.recordType === 'bridgers2') {
        const res = await baseApi.getbridgers2TransData(params)
        if (res.resCode == 100) {
          let list = res.data.list
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
          if (res.data.pageNo === 1) {
            this.list = list
          } else {
            this.list = [...this.list, ...list]
          }
          if (this.list.length === res.data.total) {
            this.finished = true
          }
        }
        this.loading = false
      } else if (this.recordType === 'NFT') {
        const res = await baseApi.queryAllNftTrade(params)
        if (res && res.resCode == 800) {
          if (this.walletAddress !== '') {
            let list = res.data.pageContent
            if (res.data.pageNo === 1) {
              this.list = list
            } else {
              this.list = [...this.list, ...list]
            }
            if (this.list.length === res.data.totalCount) {
              this.finished = true
            }
          }
          this.loading = false
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
          // if (data.isNft != '' && data.router) {
          //   data.isNft = ''
          // }
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

          this.$store.commit('setOrder', res.data)
          this.$bus.emit('isShowStatus')
        } else {
          errorCode(res.resCode, this)
        }
      }
    },
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
  },
}
</script>
<style lang="scss" scoped>
.main {
  max-width: 548px;
  margin: 0 auto 10px;
  box-sizing: border-box;
  padding: 16px;
  background-color: #fff;
  border-radius: 0.685rem;
  width: calc(100% - 12px);
  // box-shadow: 0px 14px 19px 0px rgba(234, 242, 255, 0.15);
  &.pc {
    width: 548px;
    margin: 0 auto 20px;
    padding: 20px;
  }
  .back {
    text-align: left;
    height: 1.11rem;
    line-height: 1.11rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 0.51rem;
      height: 0.37rem;
    }
  }
  .top {
    height: 0.55rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 0.333rem;
    font-family: Poppins;
    color: #292929;
  }
  .box {
    margin-top: 10px;
    margin-bottom: 10px;
    background: #fbfbfd;
    border-radius: 20px;
    border: 1px solid #f2f5fa;
    overflow: hidden;
    .box-top {
      padding: 0 0.37rem;
      height: 0.74rem;
      line-height: 0.74rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-family: Poppins-Medium, Poppins;
      font-weight: 500;
      color: #292929;
      position: relative;
      // top: 10px;
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
      cursor: pointer;
      .left,
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(50% - 0.37rem);
        img {
          width: 0.74rem;
          height: 0.74rem;
          padding: 0.37rem;
        }
        .coin {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          align-items: center;
          width: calc(100% - 1.85rem);
          div {
            width: 100%;
            text-align: left;
            font-family: Poppins;
          }
          .coin-name {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            font-size: 0.296rem;
          }
          .coin-number {
            font-size: 12px;
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
}
</style>
