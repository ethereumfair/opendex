<template>
  <div>
    <div v-if="isPC" class="PC">
      <div class="footerContPC">
        <div class="leftFlex">
          <span
            v-if="bridgersFlag == 'bridgers'"
            class="iconfont flexSpan"
            style="font-size: 30px"
            >&#xe6c5;</span
          >
          <span
            v-if="bridgersFlag !== 'bridgers'"
            class="iconfont flexSpan"
            style="font-size: 30px"
            >&#xe664;</span
          >
        </div>
        <div class="leftFlex">
          <svg
            @click="linkContact('twitter')"
            class="icon svgIcon flexSpan marginR"
            aria-hidden="true"
          >
            <use xlink:href="#icon-tuite"></use>
          </svg>
          <span class="flexSpan faq marginR" v-if="sourceFlag == 'HN'">
            <svg
              @click="linkContact('tg_hn')"
              class="icon svgIcon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-feiji"></use>
            </svg>
            <span>HN</span>
          </span>
          <span class="flexSpan faq marginR">
            <svg
              @click="linkContact('tg')"
              class="icon svgIcon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-feiji"></use>
            </svg>
            <span v-if="sourceFlag == 'HN'">SWFT</span>
          </span>

          <svg
            @click="linkContact('discord')"
            class="icon svgIcon flexSpan"
            aria-hidden="true"
          >
            <use xlink:href="#icon-a-bianzu4"></use>
          </svg>
          <svg
            @click="linkContact('mm')"
            class="icon svgIcon flexSpan"
            aria-hidden="true"
          >
            <use xlink:href="#icon-MM"></use>
          </svg>
        </div>
        <div
          class="leftFlex imgText"
          :class="walletAddress ? 'imgText_VIP' : 'imgText_noVIP'"
        >
          <span v-if="isPC" class="flexSpan faq" @click="linkContact('faq')">
            <svg class="icon svgIcon" aria-hidden="true">
              <use xlink:href="#icon-faq"></use>
            </svg>
            <span style="font-size: 12px"> {{ $t('FAQ') }} </span>
          </span>
          <span v-if="isPC" class="flexSpan faq" @click="linkContact('docs')">
            <svg class="icon svgIcon" aria-hidden="true">
              <use xlink:href="#icon-doc"></use>
            </svg>
            <span style="font-size: 12px"> Docs </span>
          </span>
          <span
            v-if="isPC && walletAddress"
            class="flexSpan faq VIPDoc"
            @click="linkContact('vipKYC')"
          >
            <svg class="icon svgIcon" aria-hidden="true">
              <use xlink:href="#icon-VIPbeifen"></use>
            </svg>
            <span style="font-size: 12px"> {{ $t('vipPortal') }} </span>
          </span>
        </div>
        <div class="rightFlex">
          <span class="flexSpan"
            >©2023 SWFT Blockchain All Rights Reserved</span
          >
          <div class="flexSpan">
            <svg v-if="lang != 'en' && lang != 'korea'" class="icon svgIcon" aria-hidden="true">
              <use xlink:href="#icon-a-shiyongjiaochengbeifen2"></use>
            </svg>
            <span
              v-if="lang != 'en' && lang != 'korea'"
              style="font-size: 12px; margin-right: 20px"
              @click="linkContact('jiaocheng')"
              >使用教程</span
            >
            <svg class="icon svgIcon" aria-hidden="true">
              <use xlink:href="#icon-a-youjian1beifen"></use>
            </svg>
            <span v-if="isShowEmail_en" style="font-size: 12px"
              >contact@swft.pro</span
            >
            <span v-else style="font-size: 12px"
              >support@swftcoin.org</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isPC" class="Mblie">
      <div class="footerContM">
        <div class="cont1">
          <div class="leftFlex" :style="sourceFlag == 'HN' ? 'width:53%' : ''">
            <span
              v-if="sourceFlag != 'HN' && bridgersFlag !== 'bridgers'"
              class="iconfont flexSpan"
              style="font-size: 25px"
              >&#xe664;</span
            >
            <span
              v-if="bridgersFlag == 'bridgers'"
              class="iconfont flexSpan"
              style="font-size: 30px"
              >&#xe6c5;</span
            >
            <div class="flexSpan">
              <div
                style="
                  font-size: 10px;
                  transform: scale(0.7);
                  white-space: nowrap;
                  margin-left: -15%;
                "
              >
                ©2023 SWFT Blockchain All Rights Reserved
              </div>
            </div>
          </div>
          <div class="rightFlex" :style="sourceFlag == 'HN' ? 'width:47%' : ''">
            <svg
              @click="linkContact('twitter')"
              class="icon svgIcon flexSpan"
              aria-hidden="true"
            >
              <use xlink:href="#icon-tuite"></use>
            </svg>
            <span class="flexSpan faq marginR" v-if="sourceFlag == 'HN'">
              <svg
                @click="linkContact('tg_hn')"
                class="icon svgIcon flexSpan"
                aria-hidden="true"
              >
                <use xlink:href="#icon-feiji"></use>
              </svg>
              <span>HN</span>
            </span>
            <span class="flexSpan faq marginR">
              <svg
                @click="linkContact('tg')"
                class="icon svgIcon flexSpan"
                aria-hidden="true"
              >
                <use xlink:href="#icon-feiji"></use>
              </svg>
              <span v-if="sourceFlag == 'HN'">SWFT</span>
            </span>

            <svg
              @click="linkContact('discord')"
              class="icon svgIcon flexSpan"
              aria-hidden="true"
            >
              <use xlink:href="#icon-a-bianzu4"></use>
            </svg>
            <svg
              @click="linkContact('mm')"
              class="icon svgIcon flexSpan"
              aria-hidden="true"
            >
              <use xlink:href="#icon-MM"></use>
            </svg>
          </div>
        </div>
        <div class="cont2">
          <div class="leftFlex">
            <span class="flexSpan faq" @click="linkContact('faq')">
              <svg class="icon svgIcon" aria-hidden="true">
                <use xlink:href="#icon-faq"></use>
              </svg>
              <span style="font-size: 10px"> {{ $t('FAQ') }} </span>
            </span>
            <span class="flexSpan faq" @click="linkContact('docs')">
              <svg class="icon svgIcon" aria-hidden="true">
                <use xlink:href="#icon-doc"></use>
              </svg>
              <span style="font-size: 10px"> Docs </span>
            </span>
            <span
              v-if="walletAddress"
              class="flexSpan faq"
              @click="linkContact('vipKYC')"
            >
              <svg class="icon svgIcon" aria-hidden="true">
                <use xlink:href="#icon-VIPbeifen"></use>
              </svg>
              <span style="font-size: 10px"> {{ $t('vipPortal') }} </span>
            </span>
            <span
              v-if="lang != 'en'"
              class="flexSpan faq"
              @click="linkContact('jiaocheng')"
            >
              <svg class="icon svgIcon" aria-hidden="true">
                <use xlink:href="#icon-a-shiyongjiaochengbeifen2"></use>
              </svg>
              <span style="font-size: 10px">使用教程 </span>
            </span>
          </div>
          <div class="rightFlex">
            <svg class="icon svgIcon flexSpan" aria-hidden="true">
              <use xlink:href="#icon-a-youjian1beifen"></use>
            </svg>
            <div class="flexSpan" style="width: calc(100% - 18px)">
              <div v-if="isShowEmail_en" class="span1">contact@swft.pro</div>
              <div v-else class="span1">support@swftcoin.org</div>
            </div>
          </div>
        </div>
        <!-- <div class="cont3">
          <span class="flexSpan">
            ©2021 SWFT BlockChain All Rights Reserved
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      bridgersFlag: localStorage.getItem('bridgersFlag'),
      sourceFlag: localStorage.getItem('sourceFlag'),
    }
  },
  // 监听属性 类似于data概念
  computed: {
    lang: {
      get() {
        return this.$store.state.lang
      },
      set(val) {
        this.$store.commit('setLang', val)
      },
    },
    walletAddress() {
      let addr = this.$store.state.wallet.address
      if (this.$store.state.chainId == '000') {
        addr = this.$store.state.walletPolkadot.addrSS58
      } else if (this.$store.state.chainId == '222') {
        addr = this.$store.state.walletPolkadot.addrSS58CRU
      } else if (this.$store.state.chainId == '0') {
        addr = this.$store.state.walletTRON
      } else if (this.$store.state.chainId == '333') {
        addr = this.$store.state.walletPolkadot.addrSS58DBC
      }
      return addr
    },
    isShowEmail_en(){
      if( window.location.href.indexOf('allchainbridge.com') != -1 && this.lang == 'en') return true
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    linkContact(val) {
      if (val == 'twitter') {
        if (this.lang == 'en') {
          window.open('https://twitter.com/SwftCoin')
        } else {
          window.open('https://twitter.com/SWFTBridge')
        }
      } else if (val == 'tg') {
        if (this.lang == 'en') {
          window.open('https://t.me/swfcoin')
        } else {
          window.open('https://t.me/swftswap_CN')
        }
      } else if (val == 'tg_hn') {
        window.open('https://t.me/HnToken')
      } else if (val == 'mm') {
        window.open('https://swftcoin.medium.com/')
      } else if (val == 'discord') {
        window.open('https://discord.gg/AHtTqrPKtC')
      } else if (val == 'faq') {
        if (this.lang == 'en') {
          window.open('https://swft-2.gitbook.io/crosschain/faq')
        } else {
          window.open('https://swft-allchain-bridge.gitbook.io/swft/')
        }
      } else if (val == 'jiaocheng') {
        if (this.lang != 'en') {
          //const path = this.$router.resolve({path: '/Tutorials'})
          window.open('https://images.swft.pro/dex/SWFTAllChain.pdf')
        }
      } else if (val == 'docs') {
        window.open('https://swft-2.gitbook.io/crosschain/')
      } else if (val == 'vipKYC') {
        // var reg = new RegExp('"',"g");//g,表示全部替换。
        // let equipmentNo=sessionStorage.getItem('equipmentNo').replace(reg,"");;
        // .replaceAll('"', "")
        let network = this.$store.getters.getChainIdName
        let equipmentNo = ''
        if (this.walletAddress.length) {
          if (this.walletAddress.length <= 32) {
            let n = 32 - this.walletAddress.length
            for (let i = 0; i < n; i++) {
              equipmentNo += 'x'
            }
            equipmentNo += this.walletAddress
          } else {
            equipmentNo = this.walletAddress.slice(0, 32)
          }
        }

        if (this.lang == 'en') {
          window.open(
            'https://www.swftc.info/swft-v3/swft-v3-m/kyc/kyc.html?lang=en&equipmentNo=' +
              equipmentNo +
              '&address=' +
              this.walletAddress +
              '&network=' +
              network +
              '&sourceflag=allChainSwap',
          )
        } else {
          window.open(
            'https://www.swftc.info/swft-v3/swft-v3-m/kyc/kyc.html?lang=cn&equipmentNo=' +
              equipmentNo +
              '&address=' +
              this.walletAddress +
              '&network=' +
              network +
              '&sourceflag=allChainSwap',
          )
        }
      }
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');
.PC {
  width: 100%;
  height: 66px;
  padding: 17px 0;
  background-color: #f1f4f9;
  .footerContPC {
    width: 1200px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    color: #aab0c8;
    font-size: 12px;
    font-family: Poppins-Medium;
    .svgIcon {
      width: 20px;
      height: 20px;
    }
    .leftFlex {
      // flex: 1;
      text-align: left;
      display: flex;
      align-items: center;
      text-align: center;
      min-width: 160px;
      .marginR {
        margin-right: 0.2rem;
      }
      .flexSpan {
        flex: 1;
        cursor: pointer;
      }
      .faq {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-end;
        svg {
          margin-right: 5px;
        }
      }
      .VIPDoc {
        width: 100px;
        flex: 1;
        white-space: nowrap;
        margin-left: 20px;
      }
    }
    .imgText_noVIP {
      width: 250px;
    }
    .imgText_VIP {
      width: 320px;
    }
    .rightFlex {
      flex: 1;
      text-align: right;
      display: flex;
      align-items: center;
      text-align: center;
      .flexSpan {
        cursor: pointer;
        cursor: pointer;
        &:nth-child(1) {
          // flex: 1;
          text-align: left;
          margin: 0 20px;
          font-family: Poppins-Medium;
          color: #d4dae5;
        }
        &:nth-child(2) {
          display: flex;
          height: 20px;
          line-height: 20px;
          text-align: left;
          justify-content: flex-end;
          svg {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
.Mblie {
  width: 100%;
  height: 66px;
  padding: 20px 0;
  background-color: #f1f4f9;
  .footerContM {
    width: 98%;
    height: 100%;
    margin: 0 auto;
    color: #aab0c8;
    font-size: 12px;
    font-family: Poppins-Regular;
    // .cont1 {
    //   margin-bottom: 10px;
    // }
    .marginR {
      margin-right: 0.15rem;
    }
    .cont1,
    .cont2 {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cont3 {
      color: #d4dae5;
    }
    .svgIcon {
      width: 18px;
      height: 18px;
      // margin-right: 5px;
    }
    .cont1 {
      margin-bottom: 15px;
      .leftFlex {
        text-align: left;
        display: flex;
        align-items: center;
        // text-align: center;
        min-width: 160px;
        align-content: center;
        width: 70%;
        .flexSpan {
          // flex: 1;
          cursor: pointer;
        }
        .faq {
          display: flex;
          align-items: center;
          width: 100%;
        }
      }
      .rightFlex {
        text-align: right;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        width: 30%;
        .flexSpan {
          cursor: pointer;
          flex: 1;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
    .cont2 {
      .svgIcon {
        width: 16px;
        height: 16px;
      }
      .leftFlex {
        width: 67%;
        text-align: left;
        display: flex;
        align-items: center;
        // text-align: center;
        min-width: 160px;
        align-content: center;
        // justify-content: space-around;
        .flexSpan {
          // flex: 1;
          // margin-right: 5px;
          cursor: pointer;
        }
        .faq {
          display: flex;
          align-items: center;
          // width: 100%;
          span {
            transform: scale(0.8);
          }
        }
      }
      .rightFlex {
        width: 34%;
        text-align: right;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        // .svgIcon {
        //   position: relative;
        //   left: 9px;
        // }
        .flexSpan:nth-child(2) {
          .span1 {
            font-size: 10px;
            transform: scale(0.9);
            text-align: right;
          }
        }
      }
    }
  }
}
.router-link-a {
  color: #aab0c8;
}
</style>
