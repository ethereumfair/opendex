<template>
  <div>
    <div v-if="fromToken && toToken && tabActive != 'NFT'" class="infoCont">
      <div class="info" v-if="sourceFlag != 'HN' && sourceFlag != 'burndex'">
        <div class="info-rate">
          <span class="title">{{ $t('selectExchangePath') }}</span>
          <div class="morePriceText" @click="showPriceList">
            {{ $t('morePrice') }} >
          </div>
        </div>
      </div>
      <div class="list-info" v-if="info && sourceFlag != 'burndex'">
        <div class="free-gas" v-if="info.dex == 'OmniBridge' && isFreeGas">
          <img class="sd" src="../assets/img/sd1.svg" alt="" />
          <div class="free-text">
            <span>
              {{
                $t('nogasswap', {
                  coin: mainCoin,
                })
              }}</span>
          </div>
          <div class="free-icon" @click.stop="windowOpen">></div>
        </div>
        <div class="part1">
          <div class="item item1">
            <img :src="
                twFlag == 'miningtw' &&
                (info.dex == 'bridgers1' || info.dex == 'OmniBridge')
                  ? 'https://images.swft.pro/dex/miningTW.png'
                  : info.logoUrl
              " alt="" />
            &nbsp;
            {{
              twFlag != 'miningtw'
                ? info.dex == 'bridgers1'
                  ? 'Bridgers'
                  : info.dex
                : info.dex == 'bridgers1'
                ? 'MiningTW Bridge'
                : info.dex == 'OmniBridge'
                ? 'MiningTW'
                : info.dex
            }}
          </div>
          <div class="item item3" v-if="!isFreeGas">
            <div v-if="info.diff.indexOf('BEST') > -1" class="" :class="info.diff.indexOf('BEST') > -1 ? 'best' : ''">
              {{ $t('recommended') }}
            </div>

            <div v-if="info.diff.indexOf('maximumReturn') > -1 && pathType == 1" class="" :class="info.diff.indexOf('maximumReturn') > -1 ? 'maxTo' : ''">
              {{ $t('maximumReturn') }}
            </div>
            <div v-if="info.diff.indexOf('FAST') > -1 && pathType == 2" class="" :class="info.diff.indexOf('FAST') > -1 ? 'fast' : ''">
              {{ $t('fast') }}
            </div>
          </div>
        </div>
        <div class="part2">
          <div class="item item2">
            <span class="gery">{{ $t('receivedQuantity') }}：</span>{{ Number(info.toTokenAmount).toFixed(6) }}
          </div>
          <div>
            {{
              info.estimatedTime == 1
                ? $t('estimatedTime1')
                : info.estimatedTime == 2
                ? $t('estimatedTime2')
                : $t('estimatedTime3')
            }}
          </div>
        </div>
      </div>
      <div class="info">
        <div class="info-rate">
          <span class="title">{{ $t('rate') }}</span>
          <span class="cont" v-if="info">
            1 {{ fromToken.coinCode }} ≈
            {{ Number(info.instantRate).toFixed(8) - 0 }}
            {{ toToken.coinCode }}
          </span>
          <span v-else>-</span>
        </div>
      </div>
      <div class="info">
        <div class="info-fee">
          <span class="title">
            {{
              info &&
              info.dex !== 'OmniBridge' &&
              info.dex !== 'bridgers1' &&
              info.dex !== 'Aggregator' &&
              info.dex !== 'bridgers2'
                ? $t('pathfee')
                : $t('fee')
            }}
            <img v-if="info" id="tips" @mouseover="tipOpen" @click="tipOpen" src="../assets/img/tip.png" />
            <Popover v-model="showPopover" theme="dark" trigger="click" placement="bottom-start" :offset="[-10, 8]" :get-container="getContainer">
              <div class="tip-content" v-if="info && info.dex === 'OmniBridge'">
                {{ $t('feeTip') }}
              </div>
              <div class="tip-content" v-if="
                  info &&
                  (info.dex === 'bridgers1' ||
                    info.dex === 'bridgers2' ||
                    info.dex === 'Aggregator')
                ">
                {{ $t('sSwapfeeTip') }}
              </div>
              <div class="tip-content" v-if="
                  info &&
                  info.dex !== 'OmniBridge' &&
                  info.dex !== 'bridgers1' &&
                  info.dex !== 'Aggregator' &&
                  info.dex !== 'bridgers2'
                ">
                {{ $t('pathfeeTip') }}
              </div>
            </Popover>
          </span>
          <span class="cont" v-if="info">
            <span v-if="
                info.dex === 'OmniBridge' ||
                info.dex === 'bridgers1' ||
                info.dex === 'Aggregator' ||
                info.dex === 'bridgers2'
              " :class="info.isDiscount === 'Y' ? 'fee-span' : ''">{{ getFeeRate(info.depositCoinFeeRate) }} %</span>
            <!-- <span
              v-if="
                info.dex === 'bridgers1' ||
                info.dex === 'bridgers2' ||
                info.dex === 'Aggregator'
              "
            ></span> -->
            <span v-else>
              {{
                sourceFlag === 'kfi'
                  ? ''
                  : sendGas
                  ? (info.dex === 'OmniBridge' ? ' + ' : '') +
                    sendGas[0] +
                    ' ' +
                    sendGas[1]
                  : ''
              }}
            </span>
          </span>
          <span v-else>-</span>
        </div>
      </div>
      <div class="info" v-if="
          info &&
          (info.dex === 'bridgers1' ||
            info.dex === 'bridgers2' ||
            info.dex === 'OmniBridge' ||
            info.dex === 'Aggregator') &&
          sourceFlag != 'kfi'
        ">
        <div class="info-rate">
          <span class="title">{{ $t('relayerGasfee') }}</span>
          <span class="cont" v-if="info">
            {{ sendGas[0] + ' ' + sendGas[1] }}
          </span>
          <span v-else>-</span>
        </div>
      </div>
      <div class="info" v-if="info && info.dex === 'OmniBridge' && info.burnRate != 0">
        <div class="info-rate">
          <span class="title">{{ $t('burnRate') }}</span>
          <span class="cont">
            {{ info.burnRate * 100 + '% ' + toToken.coinCode }}
          </span>
        </div>
      </div>
      <div class="info" v-if="info && info.dex !== 'OmniBridge'">
        <div class="info-quantity">
          <span class="title"> {{ $t('slippage') }}</span>
          <span class="cont">
            <div class="bridge">
              <span>{{ slidingPoint }} % &nbsp;</span>
              <svg @click="setSlidingPoint" class="icon" aria-hidden="true">
                <use xlink:href="#icon-shezhi"></use>
              </svg>
            </div>
          </span>
        </div>
      </div>
      <div class="info">
        <div class="info-quantity">
          <span class="title"> {{ $t('expected') }}</span>
          <span class="cont" v-if="info">
            <template>
              {{ toNumber }}
            </template>
            {{ toToken.coinCode }}
          </span>
          <span v-else>-</span>
        </div>
      </div>
      <div class="info" v-if="
          info &&
          (info.dex === 'bridgers1' ||
            info.dex === 'bridgers2' ||
            info.dex === 'Aggregator')
        ">
        <div class="info-quantity">
          <span class="title"> {{ $t('estimatedTime') }}</span>
          <span class="cont" v-if="info">
            {{
              info.estimatedTime == 1
                ? $t('estimatedTime1')
                : info.estimatedTime == 2
                ? $t('estimatedTime2')
                : $t('estimatedTime3')
            }}
          </span>
          <span v-else>-</span>
        </div>
      </div>
    </div>
    <div class="infoCont" v-else>
      <div v-if="NFTSelect && NFTInfo" class="nft-content">
        <p class="NFTDetail">{{ $t('NFTDetail') }}</p>
        <div class="nft-contentInner">
          <div class="nft-img">
            <img :src="NFTSelect.imageUrl" alt="" />
          </div>
          <div class="nft-info">
            <img class="bg" :src="NFTSelect.imageUrl" alt="" />
            <div class="nft-text">
              <div class="top">
                <div class="name">{{ NFTSelect.name }}</div>
                <div>#{{ NFTSelect.tokenId }}</div>
              </div>
              <div class="bottom">
                <div class="price">
                  {{ $t('price') }}
                </div>
                <div class="price-btn themeBg">
                  {{
                    this.NFTChange == 'from'
                      ? Number(NFTInfo.toTokenAmount).toFixed(6) - 0
                      : NFTInfo.fromTokenAmount
                  }}
                  {{
                    this.NFTChange == 'from'
                      ? this.NFTToToken.coinCode
                      : this.NFTFromToken.coinCode
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="NFTSelect && !NFTInfo" class="nft-content">
        <p class="NFTDetail">{{ $t('NFTDetail') }}</p>
        <div class="nft-contentInner">
          <div class="nft-img">
            <img :src="NFTSelect.logoURI" alt="" />
          </div>
          <div class="nft-info no-order">
            <img class="no-order-img" src="../assets/img/nft_noOrder.png" alt="" />
            <div class="nft-text">
              <div class="top">
                <div class="name">{{ NFTSelect.name }}</div>
                <div>#{{ NFTSelect.tokenId }}</div>
              </div>
              <div class="bottom">
                <div class="no-order-text">{{ $t('noNFTOrder') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PriceList ref="priceDialog" :pathType="pathType" />
    <SlidingPoint ref="slidingPoint" />
  </div>
</template>
<script>
import { Toast } from "vant";
import { Popover } from "vant";
import baseApi from "../api/baseApi";
import bus from "../eventBus";
import errorCode from "../utils/language.js";
import BigNumber from "bignumber.js";
const PriceList = () => import("@/components/common/priceList");
const SlidingPoint = () => import("@/components/common/SlidingPoint");
import { supportNetWork } from "../config/index";

export default {
  name: "Info",
  components: {
    Popover,
    PriceList,
    SlidingPoint,
  },
  data() {
    return {
      sendGas: null,
      showPopover: false,
      tipTimer: null,
      timer: null, //兑换区间计时器
      NFTTimer: null, //兑换区间计时器
      sourceFlag: localStorage.getItem("sourceFlag"),
      bridgersFlag: localStorage.getItem("bridgersFlag"),
      feeRate: null,
      dex: "", //用户选择 兑换渠道  为空没选择过
      AggregatorChain: ["ETH", "BSC", "HECO", "POLYGON", "OKExChain", "FTM"], // Aggregator支持的链
      twFlag: localStorage.getItem("twFlag"),
      pathType: 0,
      timeoutID: null,
    };
  },
  computed: {
    lang: {
      get() {
        return this.$store.getters.getLang;
      },
      set(val) {
        this.$i18n.locale = val;
        this.$store.commit("setLang", val);
      },
    },
    tabActive: {
      get() {
        return this.$store.state.tabActive;
      },
    },
    bridgeFromTokenchain: {
      // from 网络
      get() {
        return this.$store.state.bridgeFromTokenchain;
      },
      set(val) {
        this.$store.commit("setBridgeFromTokenchain", val);
      },
    },
    bridgeToTokenchain: {
      // to网络
      get() {
        return this.$store.state.bridgeToTokenchain;
      },
      set(val) {
        this.$store.commit("setBridgeToTokenchain", val);
      },
    },
    isFreeGas() {
      return this.$store.state.isFreeGas;
    },
    mainCoin() {
      const data = supportNetWork.find(
        (e) => this.fromToken.mainNetwork == e.netWork
      );
      if (data) {
        return data.symbol;
      }
    },
    fromToken() {
      if (this.tabActive == "bridge") {
        return this.bridgeFromTokenchain;
      }
      if (this.tabActive == "gasSwap") {
        return this.$store.state.gasFromToken;
      }
      return this.$store.state.fromToken;
    },
    toToken() {
      if (this.tabActive == "bridge") {
        return this.bridgeToTokenchain;
      }
      if (this.tabActive == "gasSwap") {
        return this.$store.state.gasToToken;
      }
      return this.$store.state.toToken;
    },
    info: {
      get() {
        return this.$store.state.info;
      },
      set(obj) {
        this.$store.commit("setInfo", obj);
      },
    },
    fromNumber() {
      return this.$store.state.fromNumber;
    },
    toNumber() {
      return this.$store.state.toNumber - 0;
    },
    NFTChange() {
      return this.$store.state.NFTChange;
    },
    NFTInfo() {
      return this.$store.state.NFTInfo;
    },
    priceList() {
      return this.$store.state.priceList;
    },
    slidingPoint() {
      return this.$store.state.slidingPoint;
    },
    swapConfirm() {
      return this.$store.state.swapConfirm;
    },
    NFTSelect() {
      if (this.NFTChange == "from") {
        return this.$store.state.NFTFromToken;
      } else if (this.NFTChange == "to") {
        return this.$store.state.NFTToToken;
      } else {
        return null;
      }
    },
    NFTFromToken() {
      return this.$store.state.NFTFromToken;
    },
    NFTToToken() {
      return this.$store.state.NFTToToken;
    },
    walletAddress() {
      if (this.$store.state.chainId == "000") {
        return this.$store.state.walletPolkadot.addrSS58;
      }
      if (this.$store.state.chainId == "222") {
        return this.$store.state.walletPolkadot.addrSS58CRU;
      } else if (this.$store.state.chainId == "333") {
        return this.$store.state.walletPolkadot.addrSS58DBC;
      } else if (this.$store.state.chainId == "0") {
        return this.$store.state.walletTRON;
      } else {
        return this.$store.state.wallet.address;
      }
    },
  },
  created() {},
  watch: {
    toToken() {
      this.$store.commit("setToNumber", "");
      this.$store.commit("setPriceList", []);
      this.info = null;
      this.initHandle();
    },
    fromToken() {
      this.$store.commit("setToNumber", "");
      this.$store.commit("setPriceList", []);
      this.info = null;
      this.initHandle();
    },
    fromNumber(val) {
      this.$store.commit("setToNumber", "");
      // 如果存在之前的定时器，则先清除
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
      }
      // 设置新的定时器
      this.timeoutID = setTimeout(() => {
        this.initHandle()
      }, 200)
      // this.initHandle();
    },
    info(data) {
      //监听渠道变化
      if (!data) return;
      //计算出 得到数量
      if (data.dex === "OmniBridge") {
        let number =
          this.fromNumber * data.instantRate * (1 - data.depositCoinFeeRate) -
          data.chainFee;
        if (number < 0) number = 0;
        this.$store.commit("setToNumber", number === 0 ? 0 : number.toFixed(6));
      } else {
        this.$store.commit(
          "setToNumber",
          Number(data.toTokenAmount).toFixed(6)
        );
      }
      this.sendGas = [
        `${data.chainFee}`,
        data.dex === "OmniBridge" || data.dex === "bridgers1"
          ? this.toToken.coinCode || this.toToken.coinCodeShow
          : data.dex === "bridgers2" || data.dex === "Aggregator"
          ? "USDT"
          : data.feeToken,
      ];
      bus.$emit("getSendGas", this.sendGas);
    },
    NFTToToken(val, oldVal) {
      if (this.tabActive == "NFT") {
        this.initHandle();
      }
    },
    NFTFromToken(val, oldVal) {
      if (this.tabActive == "NFT") {
        if (oldVal) {
          this.initHandle();
        }
      }

      // }
    },
    tabActive(val, oldVal) {
      if (val == "NFT") {
        clearInterval(this.timer);
      } else {
        clearInterval(this.NFTTimer);
      }
    },
    pathType(val, oldVal) {
      this.mergeData(this.priceList);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.NFTTimer);
  },
  methods: {
    windowOpen() {
      if (this.lang == "zh") {
        window.open(
          "https://swft-allchain-bridge.gitbook.io/swft/swft-wu-gas-dui-huan-fu-wu"
        );
      } else {
        window.open(
          "https://swft-2.gitbook.io/crosschain/welcome/swft-0-gas-swap-service"
        );
      }
    },
    //初始化获取基本信息接口
    initHandle() {
      clearInterval(this.timer);
      clearInterval(this.NFTTimer);
      if (this.tabActive == "NFT") {
        if (!this.NFTFromToken || !this.NFTToToken) {
          return;
        }
        this.getNFTInfo();
        this.NFTTimer = setInterval(() => {
          this.getNFTInfo();
        }, 20000);
      } else {
        this.getBaseInfo();
        this.timer = setInterval(() => {
          this.getBaseInfo();
        }, 10000);
      }
    },
    // 获取基本信息
    async getBaseInfo() {
      const chainId = this.$store.state.chainId;

      if (!this.fromToken || !this.toToken) {
        return;
      }
      // this.$store.commit('setNFTChange', false)
      //NFT 买卖 禁止获取汇率
      if (this.toToken.isNFT || this.fromToken.isNFT) {
        // this.$store.commit('setNFTChange', true)
        return;
      }
      if (this.fromNumber === "" || this.fromNumber <= 0) return;
      this.$store.commit("setUpdating", true);
      if (this.bridgersFlag !== "bridgers") {
        this.getSwftTradeData([
          this.fromToken.coinCode + this.fromToken.contact,
          this.toToken.coinCode + this.toToken.contact,
        ]);
      }
      //跨链过滤 path 询价请求
      // (this.AggregatorChain.indexOf(this.fromToken.mainNetwork) != -1 &&  this.AggregatorChain.indexOf(this.toToken.mainNetwork) != -1)
      if (
        this.fromToken.mainNetwork === this.toToken.mainNetwork &&
        this.bridgersFlag !== "bridgers"
      ) {
        this.getBridgeTradeData(this.walletAddress, [
          this.fromToken.coinCode + this.fromToken.contact,
          this.toToken.coinCode + this.toToken.contact,
        ]);
      }
      //跨链执行 bridgers2 询价请求
      // this.getBridgers2TradeData(this.walletAddress, [
      //   this.fromToken.coinCode + this.fromToken.contact,
      //   this.toToken.coinCode + this.toToken.contact,
      // ])
      //跨链执行 bridgers1 询价请求
      this.getSswapBridgeTradeData(this.walletAddress, [
        this.fromToken.coinCode + this.fromToken.contact,
        this.toToken.coinCode + this.toToken.contact,
      ]);
    },
    showPriceList() {
      this.$refs.priceDialog.$refs.dialogPriceList.show = true;
    },
    bubbleSort(arr) {
      let max = arr.length - 1;
      for (var j = 0; j < max; j++) {
        // 声明一个变量，作为标志位
        var done = true;
        for (var i = 0; i < max - j; i++) {
          if (Number(arr[i].toTokenAmount) < Number(arr[i + 1].toTokenAmount)) {
            var temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            done = false;
          }
        }
        if (done) {
          break;
        }
      }
      const sSwap = arr.filter((item) => item.dex === "bridgers1");
      if (sSwap.length > 0) {
        let sSwapIndex, sSwapInfo;
        arr.forEach((item, index) => {
          if (item.dex === "bridgers1") {
            sSwapIndex = index;
            sSwapInfo = item;
          }
        });
        if (sSwapIndex != 0) {
          const list = arr.filter((item) => item.dex != "bridgers1");
          arr = [sSwapInfo, ...list];
        }
      }

      let flagtime = false;
      let price1 = 0;
      let price2 = 0;
      arr.forEach((item, index) => {
        let diffStr = [];
        this.$set(item, "diff", diffStr);
        if (index === 0) {
          diffStr.push("BEST");
          this.$set(item, "diff", diffStr);
          if (arr[0].estimatedTime == 1) {
            flagtime = true;
            diffStr.push("FAST");
            this.$set(arr[0], "diff", diffStr);
          }
          price1 = item.toTokenAmount;
        } else if (index === 1) {
          price2 = item.toTokenAmount;
        } else {
          this.$set(
            item,
            "diff",
            this.getPersent(arr[0].toTokenAmount, item.toTokenAmount)
          );
        }

        //速度相同优先最大回报 标记fast
        let fastFlag = arr[0];
        let indexFlag = 0;

        if (item.estimatedTime < fastFlag.estimatedTime && !flagtime) {
          fastFlag = item;
          indexFlag = index;
          flagtime = true;
          diffStr.push("FAST");
          this.$set(arr[indexFlag], "diff", diffStr);
        }
      });
      if (Number(price2) > Number(price1)) {
        arr[1].diff.push("maximumReturn");
      } else {
        arr[0].diff.push("maximumReturn");
      }
      if (this.isFreeGas) {
        const swftNoGasList = arr.filter((item) => item.dex == "OmniBridge");
        const otherList = arr.filter((item) => item.dex != "OmniBridge");
        const noGasNewList = [...swftNoGasList, ...otherList];
        return noGasNewList;
      }
      return arr;
    },

    timeSort(arr) {
      let max = arr.length - 1;
      for (var j = 0; j < max; j++) {
        // 声明一个变量，作为标志位
        for (var i = 1; i < max - j; i++) {
          if (Number(arr[i].estimatedTime) > Number(arr[i + 1].estimatedTime)) {
            var temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
          }
        }
      }
      return arr;
    },
    getPersent(best, other) {
      if (best == 0) {
        return "0.00%";
      }
      return (((other - best) / best) * 100).toFixed(2) + "%";
    },
    //Bridgers2
    async getBridgers2TradeData(walletAddress, key) {
      // 兑换时 停止询价
      if (this.swapConfirm) {
        this.$store.commit("setUpdating", false);
        return;
      }
      const amount = new BigNumber(this.fromNumber).multipliedBy(
        BigNumber(10).pow(this.fromToken.coinDecimal)
      );
      const params = {
        fromTokenAddress:
          this.fromToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.fromToken.contact,
        toTokenAddress:
          this.toToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.toToken.contact,
        fromTokenAmount: this.toNonExponential(amount),
        fromTokenChain: this.changeNetWork(this.fromToken.mainNetwork),
        toTokenChain: this.changeNetWork(this.toToken.mainNetwork),
        userAddr: this.walletAddress,
      };
      const res = await baseApi.getBridgers2TradeData(params);
      if (res.resCode == "100") {
        this.$store.commit("setUpdating", false);
        //阻拦
        if (
          key[0] !== this.fromToken.coinCode + this.fromToken.contact ||
          key[1] !== this.toToken.coinCode + this.toToken.contact
        )
          return;
        if (!res.data.txData) return;
        let resultList = [res.data.txData];
        if (resultList.length > 0) {
          resultList.forEach((element) => {
            //this.$set(element, 'chainFee', element.fee)
            this.$set(
              element,
              "instantRate",
              new BigNumber(element.toTokenAmount)
                .dividedBy(new BigNumber(this.fromNumber))
                .toString()
            );
            // this.$set(
            //   element,
            //   'toTokenAmount',
            //   this.fromNumber * element.instantRate * (1 - element.fee) -
            //     element.chainFee,
            // )
            if (element.toTokenAmount < 0) element.toTokenAmount = 0;
            this.$set(element, "depositCoinFeeRate", element.fee);
          });
        }
        this.mergeData(resultList);
        //return resultList
      } else {
        return [];
      }
    },
    //Bridgers1
    async getSswapBridgeTradeData(walletAddress, key) {
      // 兑换时 停止询价
      if (this.swapConfirm) {
        this.$store.commit("setUpdating", false);
        return;
      }
      const amount = new BigNumber(this.fromNumber).multipliedBy(
        BigNumber(10).pow(this.fromToken.coinDecimal)
      );
      const params = {
        fromTokenAddress:
          this.fromToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.fromToken.contact,
        toTokenAddress:
          this.toToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.toToken.contact,
        fromTokenAmount: this.toNonExponential(amount),
        fromTokenChain: this.changeNetWork(this.fromToken.mainNetwork),
        toTokenChain: this.changeNetWork(this.toToken.mainNetwork),
        userAddr: this.walletAddress,
      };
      const res = await baseApi.getSswapBridgeTradeData(params);
      if (res.resCode == "100") {
        this.$store.commit("setUpdating", false);
        //阻拦
        if (
          key[0] !== this.fromToken.coinCode + this.fromToken.contact ||
          key[1] !== this.toToken.coinCode + this.toToken.contact
        )
          return;
        if (!res.data.txData) return;
        let resultList = [res.data.txData];
        if (resultList.length > 0) {
          resultList.forEach((element) => {
            //this.$set(element, 'chainFee', element.fee)
            this.$set(
              element,
              "instantRate",
              new BigNumber(element.toTokenAmount)
                .dividedBy(new BigNumber(this.fromNumber))
                .toString()
            );
            // this.$set(
            //   element,
            //   'toTokenAmount',
            //   this.fromNumber * element.instantRate * (1 - element.fee) -
            //     element.chainFee,
            // )
            if (element.toTokenAmount < 0) element.toTokenAmount = 0;
            this.$set(element, "depositCoinFeeRate", element.fee);
          });
        }
        this.mergeData(resultList);
        //return resultList
      } else {
        return [];
      }
    },
    async getSwftTradeData(key) {
      if (this.swapConfirm) {
        this.$store.commit("setUpdating", false);
        return;
      } // 兑换时 停止询价
      let info = null;
      var data = {
        depositCoinCode: this.fromToken.coinCode,
        receiveCoinCode: this.toToken.coinCode,
        walletAddress: this.walletAddress,
        depositCoinAmt: this.fromNumber,
        //changeType: 'limited',
      };
      await baseApi.getBaseInfo(data).then((res) => {
        if (!res) {
          return errorCode(900, this);
        }
        if (res && res.resCode !== "800") {
          return errorCode(res.resCode, this);
        }

        if (res.data.instantRateOriginal == "0") {
          Toast({
            message: this.$t("support_Advanced"),
            position: "top",
          });
        }
        // if (
        //   this.$store.state.chainId === null ||
        //   this.$store.state.chainId === ''
        // )
        //   return
        this.$store.commit("setUpdating", false);
        //阻拦
        if (
          key[0] !== this.fromToken.coinCode + this.fromToken.contact ||
          key[1] !== this.toToken.coinCode + this.toToken.contact
        )
          return;
        info = res.data;
        this.$set(info, "dex", "OmniBridge");
        this.$set(info, "isDex", res.data.isDex);
        this.$set(info, "logoUrl", "https://images.allchainbridge.com/dex/OmniBridge.svg");
        this.$set(
          info,
          "toTokenAmount",
          (
            this.fromNumber * info.instantRate * (1 - info.depositCoinFeeRate) -
            info.chainFee
          )
            .toFixed(7)
            .slice(0, -1)
        ); //this.fromNumber * info.instantRate
        if (info.toTokenAmount < 0) info.toTokenAmount = 0;
        this.mergeData([info]);
      });
      //return info
    },
    async getBridgeTradeData(walletAddress, key) {
      // 兑换时 停止询价
      if (this.swapConfirm) {
        console.log("兑换时 停止询价");
        this.$store.commit("setUpdating", false);
        return;
      }
      const amount = new BigNumber(this.fromNumber).multipliedBy(
        BigNumber(10).pow(this.fromToken.coinDecimal)
      );
      const params = {
        fromTokenAddress:
          this.fromToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.fromToken.contact, //源token地址
        toTokenAddress:
          this.toToken.contact === ""
            ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            : this.toToken.contact, //目标token地址
        fromTokenAmount: this.toNonExponential(amount), //输入金额
        fromTokenChain: this.changeNetWork(this.fromToken.mainNetwork), //ETH，BSC, HECO
        toTokenChain: this.changeNetWork(this.toToken.mainNetwork), //ETH，BSC, HECO
        userAddr: this.walletAddress,
        toAddress: this.$store.state.address,
        source: this.sourceFlag,
      };
      try {
        const res = await baseApi.multiQuote(params);
        if (res.resCode == "100") {
          this.$store.commit("setUpdating", false);
          //阻拦
          if (
            key[0] !== this.fromToken.coinCode + this.fromToken.contact ||
            key[1] !== this.toToken.coinCode + this.toToken.contact
          )
            return;
          // 判断同链还是跨链
          const isOrigin =
            this.fromToken.mainNetwork != this.toToken.mainNetwork &&
            this.AggregatorChain.indexOf(this.fromToken.mainNetwork) != -1 &&
            this.AggregatorChain.indexOf(this.toToken.mainNetwork) != -1;
          let resultList = [];
          if (!isOrigin) {
            resultList = res.data.txData.filter(
              (item) =>
                item.dex !== "OmniBridge" &&
                item.dex !== "ClassZZ" &&
                item.dex !== "Bridgers" &&
                item.dex !== "sSwap" &&
                item.dex !== "MetaPath" &&
                item.dex !== "TransitSwap"
            );
          } else {
            resultList = res.data.txData.filter(
              (item) => item.dex == "Aggregator"
            );
          }
          if (resultList.length > 0) {
            resultList.forEach((element) => {
              if (element.dex !== "Aggregator") {
                this.$set(element, "chainFee", element.fee);
              } else {
                this.$set(element, "depositCoinFeeRate", element.fee);
              }
              this.$set(
                element,
                "instantRate",
                new BigNumber(element.receiveTokenAmount)
                  .dividedBy(new BigNumber(this.fromNumber))
                  .toString()
              );
              //添加过滤标识
              this.$set(element, "dexType", "pathBridge");
            });
          }
          this.mergeData(resultList, "pathBridge");
          //return resultList
        } else {
          return [];
        }
      } catch {
        return [];
      }
    },
    changeNetWork(network) {
      if (network === "AVAXC") {
        return "AVALANCHE";
      } else if (network === "FTM") {
        return "FANTOM";
      } else if (network === "ARB") {
        return "ARBITRUM";
      } else if (network === "TRX") {
        return "TRON";
      } else if (network === "SOL") {
        return "SOLANA";
      } else if (network === "opBNB" || network === "zkEVM") {
        return network;
      } else {
        return network.toUpperCase();
      }
    },
    mergeData(data, type) {
      let priceList;
      if (type === "pathBridge") {
        priceList = this.priceList.filter(
          (item) => item.dexType !== "pathBridge"
        );
      } else {
        priceList = this.priceList;
      }
      if (!priceList) priceList = [];
      //先合并
      let mergeList = [...priceList, ...data];
      //在去重  排序
      const newList = this.unique(mergeList);
      let timeSortList = newList;
      if (this.pathType == 2) {
        timeSortList = this.timeSort(newList);
        this.$store.commit("setPriceList", timeSortList);
      } else {
        this.$store.commit("setPriceList", newList);
      }

      const chooseList = newList.filter((item) => item.dex === this.dex);
      //是否存在
      if (chooseList.length > 0) {
        this.info = chooseList[0];
      } else {
        let infoItem = newList.filter((item) => item.diff.indexOf("BEST") > -1);
        this.info = newList.length > 0 ? newList[0] : null;
        this.dex = "";
      }
    },
    unique(list) {
      let result = {};
      let finalResult = [];
      for (let i = 0; i < list.length; i++) {
        result[list[i].dex] = list[i];
      }
      for (let item in result) {
        finalResult.push(result[item]);
      }
      finalResult = this.bubbleSort(finalResult);
      return finalResult;
    },
    toNonExponential(num, type) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      if (!m) return 0;
      if (type === "parseInt") {
        let str = num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
        if (str.indexOf(".") === -1) {
          return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
        } else {
          return str.substring(0, str.indexOf("."));
        }
      } else {
        return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
      }
    },
    tipOpen() {
      const self = this;
      clearTimeout(this.tipTimer);
      self.showPopover = true;
      this.tipTimer = setTimeout(() => {
        self.showPopover = false;
      }, 3000);
    },
    getContainer() {
      return document.querySelector(".info-fee");
    },
    //获取NFT 信息
    async getNFTInfo(type) {
      const _this = this;
      let params = {};
      if (_this.NFTToToken.isNFT) {
        //买
        params = {
          nftId: _this.NFTToToken.id,
          platformId: _this.NFTToToken.platformId,
          orderSide: 1,
          coinCode: _this.NFTFromToken.coinCode,
          fromTokenChain: _this.NFTFromToken.mainNetwork,
          fromAddress: this.walletAddress,
        };
      } else {
        params = {
          tokenId: _this.NFTFromToken.tokenId,
          paymentContract: _this.NFTFromToken.paymentInfo.paymentContract,
          platformId: _this.NFTFromToken.platformId,
          orderSide: 0,
          coinCode: _this.NFTToToken.coinCode,
          fromTokenChain: _this.NFTToToken.mainNetwork,
          fromAddress: this.walletAddress,
          fromTokenAddress: _this.NFTFromToken.contractAddr,
        };
      }
      await baseApi.quote(params).then((res) => {
        if (res.resCode === "800") {
          if (res.data) {
            let info = res.data;
            _this.$set(
              info,
              "imageUrl",
              _this.NFTChange === "from"
                ? _this.NFTFromToken.logoURI
                : _this.NFTToToken.logoURI
            );
            _this.$set(
              info,
              "collectionName",
              _this.NFTChange === "from"
                ? _this.NFTFromToken.name
                : _this.NFTToToken.name
            );
            _this.$set(
              info,
              "tokenId",
              _this.NFTChange === "from"
                ? _this.NFTFromToken.tokenId
                : _this.NFTToToken.tokenId
            );
            _this.$set(info, "dex", res.data.dex);
            _this.$store.commit("setNFTInfo", info);
          }
        } else {
          _this.$store.commit("setNFTInfo", null);
          return;
        }
      });
    },
    // 计算手续费率
    getFeeRate(val) {
      return new BigNumber(val).multipliedBy(100);
    },
    setSlidingPoint() {
      this.$refs.slidingPoint.$refs.dialogSlidingPoint.show = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.infoCont {
  .info {
    display: flex;
    align-items: center;
    min-height: 0.5rem;
    margin: 5px 0;
    .info-rate,
    .info-fee,
    .info-quantity {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .title {
      text-align: left;
      font-size: 0.259rem;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #999999;
      white-space: nowrap;
      position: relative;
      display: flex;
      align-items: center;
      #tips {
        width: 14px;
        height: 14px;
      }
      img {
        margin-left: 5px;
        margin-bottom: 2px;
        display: inline-block;
        cursor: pointer;
      }
    }
    .morePriceText {
      color: #277ffa;
      background: #f3f8ff;
      border-radius: 10px;
      padding: 1px 5px;
      cursor: pointer;
    }
    .cont {
      font-size: 0.259rem;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: #292929;
      text-align: right;
      .fee-span {
        display: inline-block;
        height: 0.351rem;
        background: linear-gradient(180deg, #fad961 0%, #ffc078 100%);
        border-radius: 0.18rem;
        color: #7d5500;
        text-align: center;
        padding: 0 0.148rem;
      }
      .bridge {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding-right: 8px;
        border-radius: 8px;
        &.bg {
          background: #f3f8ff;
        }
        img {
          width: 0.5rem;
          height: 0.5rem;
        }
      }
      svg {
        width: 0.45rem;
        height: 0.45rem;
        margin-bottom: 0.08rem;
      }
    }
    .tip-content {
      padding: 0.148rem;
      font-size: 12px;
      text-align: left;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
  }
  .list-info {
    width: 100%;
    min-height: 1.666rem;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 0.2rem;
    border: 1px solid #277ffa;
    border-radius: 0.25rem;
    background-color: #f3f8ff;
    font-family: Poppins-Regular;
    overflow: hidden;
    .free-gas {
      width: 100%;
      background: #277ffa;
      opacity: 1;
      padding: 0 0.1rem 0 0.2rem;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .sd {
        display: inline-block;
        width: 0.35rem;
        margin-right: 0.05rem;
        color: #ffffff;
      }
      .free-text {
        width: 0;
        flex: 1;
        font-size: 10px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #ffffff;
        line-height: 15px;
        padding: 0.1rem 0;
        text-align: left;
      }
      .free-icon {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 0.1rem;
        font-size: 0.4rem;
        color: #ffffff;
      }
    }
    &.th-title {
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #999999;
    }
    &.list {
      font-family: Poppins-Regular, Poppins;
      color: #292929;
    }
    &.active {
      background: #f0f7ff;
      border: 1px solid #73acff;
      border-radius: 0.25rem;
    }
    .item {
      display: flex;
      align-items: center;
      border-radius: 5px;
      &.item1 {
        // width: 45%;
        font-size: 0.259rem;
        font-family: Poppins-SemiBold, Poppins;
        // height: 0.6rem;
      }
      &.item2 {
        width: 70%;
        // height: 0.6rem;
        overflow: hidden;
        overflow-x: auto;
      }
      .gery {
        color: #999999;
      }
      &.item3 {
        // width: 15%;
        font-size: 12px;
        justify-content: end;

        font-size: 12px;
        &.err {
          color: #cd4444;
        }
        .best {
          color: #24af5c;
          background-color: #e8fff2;
          border: 1px solid #24af5c;
          border-radius: 5px;
          padding: 2px 3px;
          margin-left: 3px;
        }
        .fast {
          color: #277ffa;
          background-color: #f3f8ff;
          border: 1px solid #277ffa;
          border-radius: 5px;
          padding: 2px 3px;
          margin-left: 3px;
        }
        .maxTo {
          color: #277ffa;
          background-color: #f3f8ff;
          border: 1px solid #277ffa;
          border-radius: 5px;
          padding: 2px 3px;
          margin-left: 3px;
        }
      }

      img {
        width: 0.63rem;
        height: 0.63rem;
        border-radius: 1rem;
      }
    }
    .part1 {
      margin-bottom: 0.16rem;
      margin-top: 0.22rem;
    }

    .part1,
    .part2 {
      padding: 0 0.22rem;
      display: flex;
      justify-content: space-between;
    }
    .part2 {
      font-size: 0.259rem;
      font-family: Poppins-SemiBold, Poppins;
      margin-bottom: 0.22rem;
    }
  }
}
.nft-content {
  width: 100%;
  margin-top: 0.37rem;
  .NFTDetail {
    font-size: 0.259rem;
    color: #000000;
    font-family: Poppins-Bold;
    margin: 0;
    text-align: left;
    margin-bottom: 0.148rem;
  }
  .nft-contentInner {
    width: 100%;
    height: 3rem;
    display: flex;
    background: #f7f8fa;
    box-sizing: border-box;
    border-radius: 20px;
    overflow: hidden;
  }

  .nft-img {
    img {
      height: 100%;
      border-radius: 0.37rem 0px 0px 0.37rem;
    }
  }
  .nft-info {
    flex: 1;
    position: relative;

    &.no-order {
      background: linear-gradient(269deg, #fcfcfd 0%, #e4efff 100%);
      .no-order-img {
        position: absolute;
        right: 0;
        width: 50%;
        bottom: 0;
      }
    }
    .bg {
      width: 100%;
      opacity: 0.1;
      filter: blur(2px);
    }
    .nft-text {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 0.35rem 0.5rem 15%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        font-size: 0.33rem;
        .name {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .bottom {
        .price {
          font-family: Poppins-Regular, Poppins;
          color: #999999;
          font-size: 0.222rem;
        }
        .price-btn {
          display: inline-block;
          font-size: 0.296rem;
          font-family: Poppins;
          color: #ffffff;
          border-radius: 0.23rem;
          padding: 0.08rem 0.2rem;
        }
        .no-order-text {
          font-weight: 600;
          color: #277ffa;
        }
      }
    }
  }
}
</style>
