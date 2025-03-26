<template>
  <div class="header" :class="isPC ? 'pc' : 'mb'">
    <div class="logo">
      <a v-if="twFlag != 'miningtw'" :href="websiteUrl" target="_bank">
        <img ref="logo" :src="logo" alt="" />
      </a>
      <img v-else ref="logo" :src="logo" alt="" />
    </div>
    
    <div class="app-header-right">
      <!-- 已连接 -->
      <el-popover placement="bottom-end" trigger="click" v-model="showPopover" :popper-class="isPC ? 'wallet-popper' : 'wallet-popper mb'" :offset="isPC ? -50 : []">
        <div class="popover-content">
          <div class="name">
            {{ walletName }}
          </div>
          <div class="address">{{ cutAddress(walletAddress) }}</div>
          <div class="link">
            <div class="link-list" v-clipboard:copy="walletAddress" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">
              <svg class="icon wallet-icon" aria-hidden="true">
                <use xlink:href="#icon-fuzhibeifen"></use>
              </svg>
              &nbsp;{{ $t('copyAddress') }}
            </div>
            <div class="link-list" @click="viewHandler">
              <svg class="icon wallet-icon" aria-hidden="true">
                <use xlink:href="#icon-select"></use>
              </svg>
              &nbsp;{{ $t('viewOn') }}
            </div>
          </div>
          <div class="btns">
            <el-button class="qh" @click="changeConnect">{{
              $t('change')
            }}</el-button>
            <el-button class="dk" @click="logoutConnect">{{
              $t('disconnect')
            }}</el-button>
          </div>
        </div>
        <div slot="reference" v-show="walletAddress" @mouseenter="mouseenter" class="wallets">
          <span class="chainName themeDeep">
            <svg v-if="walletName != 'OKExWalletSui' && walletName != 'Bitget' && walletName != 'EchoooWallet'" style="width: 32px" class="icon wallet-icon" aria-hidden="true">
              <use :xlink:href="'#icon-' + walletName"></use>
            </svg>
            <svg v-else-if="walletName == 'OKExWalletSui'" style="width: 32px" class="icon wallet-icon" aria-hidden="true">
              <use xlink:href="#icon-OKExWallet"></use>
            </svg>
            <img v-else-if="walletName == 'Bitget'" src="../assets/img/Bitget.svg" style="width: 32px" class="icon wallet-icon" alt="" />
            <img v-else-if="walletName == 'EchoooWallet'" src="../assets/img/EchoooWallet.png" style="width: 32px" class="icon wallet-icon EchoooWallet" alt="" />
            {{
              $store.getters.getChainIdName === 'OKExChain'
                ? 'OKC'
                : $store.getters.getChainIdName === 'ORC'
                ? 'Ontology'
                : $store.getters.getChainIdName
            }}
          </span>
          <span>{{ cutDeepAddress(walletAddress) }}</span>
          <!-- <svg style="width:22px;" class="icon wallet-icon" aria-hidden="true">
              <use xlink:href="#icon-zengjia"></use>
          </svg> -->
        </div>
      </el-popover>
      <!-- 未连接 -->
      <div v-if="!walletAddress" class="wallets" @click="changeWallets">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-lianjie"></use>
        </svg>
        <span>{{ $t('connectWallet') }}</span>
      </div>
      <div class="lang" @click="changeLang('')">
        <svg v-if="lang === 'en'" t="1618324696346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1904" width="200" height="200">
          <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808h157.0048l13.44-57.6768h-157.0048l20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="1905"></path>
        </svg>
        <svg v-if="lang === 'zh'" t="1618325026526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="200" height="200">
          <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808 13.44-57.6768 20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="2177"></path>
        </svg>
        <svg v-if="lang === 'zht'" t="1618325026526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="200" height="200">
          <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808 13.44-57.6768 20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="2177"></path>
        </svg>
        <svg v-if="lang === 'korea'" class="icon" aria-hidden="true">
          <use xlink:href="#icon-korea"></use>
        </svg>
        <div class="lang-list" v-if="showLangList">
          <ul>
            <li @click.stop="changeLang('en')" :class="lang === 'en' ? 'active themeBg' : ''">
              <svg t="1618324696346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1904" width="200" height="200">
                <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808h157.0048l13.44-57.6768h-157.0048l20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="1905"></path>
              </svg>
              <div class="line"></div>
              <div class="name">English</div>
            </li>
            <li @click.stop="changeLang('zh')" :class="lang === 'zh' ? 'active themeBg' : ''">
              <svg t="1618325026526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="200" height="200">
                <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808 13.44-57.6768 20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="2177"></path>
              </svg>
              <div class="line"></div>
              <div class="name">简体中文</div>
            </li>
            <li @click.stop="changeLang('zht')" :class="lang === 'zht' ? 'active themeBg' : ''">
              <svg t="1618325026526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="200" height="200">
                <path d="M404.0192 686.848l13.44-57.7024h-185.6l21.5808-91.9808 13.44-57.6768 20.992-89.0112h182.1184L483.4048 332.8H224.256L140.8 686.848zM555.1872 686.848l52.5312-221.2864 107.9808 221.2608h65.3824L864.512 332.8h-77.056l-51.9424 221.7728L626.9952 332.8h-65.3824l-83.456 354.048z" fill="#fff" p-id="2177"></path>
              </svg>
              <div class="line"></div>
              <div class="name">繁体中文</div>
            </li>
            <li @click.stop="changeLang('korea')" :class="lang === 'korea' ? 'active themeBg' : ''">
              <svg v-if="lang === 'korea'" class="icon" aria-hidden="true">
                <use xlink:href="#icon-korea"></use>
              </svg>
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icon-korea-normal"></use>
              </svg>
              <div class="line"></div>
              <div class="name">한국인</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bg">
      <div class="bg-box themeBg"></div>
    </div>
    <ConnectWallet ref="wallet"></ConnectWallet>
  </div>
</template>
<script>
// import ConnectWallet from './ConnectWallet.vue'
import logoImg from "../config/logoImg";
import { Toast } from "vant";
import { supportNetWork } from "../config/index";
const ConnectWallet = () => import("./ConnectWallet.vue");

export default {
  name: "Header",
  components: { ConnectWallet },
  data() {
    return {
      showLangList: false,
      showLinkList: false,
      showMetamask: false,
      logo: "", //网站logo
      showPopover: false,
      websiteUrl: "https://www.swft.pro/",
      twFlag: localStorage.getItem("twFlag"),
    };
  },
  mounted() {
    this.logo = logoImg["allchain"].logo;
  },
  computed: {
    walletName() {
      let name = this.$store.state.wallet.name;
      if (this.$store.state.chainId == "000") {
        name = "DOT";
      } else if (this.$store.state.chainId == "222") {
        name = "CRU";
      } else if (this.$store.state.chainId == "333") {
        name = "DBC";
      }
      return name;
    },
    wallet() {
      return this.$store.state.wallet.address;
    },
    walletAddress() {
      let addr = this.$store.state.wallet.address;
      if (this.$store.state.chainId == "000") {
        addr = this.$store.state.walletPolkadot.addrSS58;
      } else if (this.$store.state.chainId == "222") {
        addr = this.$store.state.walletPolkadot.addrSS58CRU;
      } else if (this.$store.state.chainId == "333") {
        addr = this.$store.state.walletPolkadot.addrSS58DBC;
      } else if (this.$store.state.chainId == "0") {
        addr = this.$store.state.walletTRON;
      }
      return addr;
    },
    lang: {
      get() {
        return this.$store.getters.getLang;
      },
      set(val) {
        this.$i18n.locale = val;
        this.$store.commit("setLang", val);
      },
    },
  },
  methods: {
    openSDEX(){
      window.open('https://sdex.swft.pro/#/swap')
    },
    changeLink() {
      this.showLinkList = !this.showLinkList;
    },
    changeLang(val) {
      this.showLangList = !this.showLangList;
      if (val) {
        this.lang = val;
      }
    },
    changeWallets() {
      if (this.walletAddress === "") {
        //连接钱包
        this.$refs.wallet.$refs.dialog.show = true;
      }
    },
    logoutConnect() {
      this.$bus.emit("disConnect");
      this.showPopover = false;
    },
    changeConnect() {
      this.showPopover = false;
      this.$refs.wallet.$refs.dialog.show = true;
    },
    cutAddress(adr) {
      const beforeAdr = adr.substring(0, 15);
      const afterAdr = adr.substring(adr.length - 15, adr.length);
      if (adr.length > 31) {
        return beforeAdr + "..." + afterAdr;
      } else {
        return adr;
      }
    },
    cutDeepAddress(addr) {
      if (addr) {
        const str1 = addr.substring(0, 2);
        const str2 = addr.substring(addr.length - 4, addr.length);
        return str1 + "..." + str2;
      } else {
        return "";
      }
    },
    onCopySuccess(val) {
      Toast.success(this.$t("copy_success"));
    },
    onCopyError(val) {},
    viewHandler() {
      //浏览器查看
      const data = supportNetWork.find(
        (e) => this.$store.getters.getChainIdName === e.netWork
      );
      if (!data) return;
      if (
        this.$store.getters.getChainIdName === "TRON" ||
        this.$store.getters.getChainIdName === "OKExChain" ||
        this.$store.getters.getChainIdName === "TT" ||
        this.$store.getters.getChainIdName === "BSC" ||
        this.$store.getters.getChainIdName === "ETH" ||
        this.$store.getters.getChainIdName === "POLYGON" ||
        this.$store.getters.getChainIdName === "ETHF" ||
        this.$store.getters.getChainIdName === "ETHW" ||
        this.$store.getters.getChainIdName === "ARB" ||
        this.$store.getters.getChainIdName === "AVAXC" ||
        this.$store.getters.getChainIdName === "FTM" ||
        this.$store.getters.getChainIdName === "SOL" ||
        this.$store.getters.getChainIdName === "HECO" ||
        this.$store.getters.getChainIdName === "BTC" ||
        this.$store.getters.getChainIdName === "LUNA" ||
        this.$store.getters.getChainIdName === "ORC" ||
        this.$store.getters.getChainIdName === "SGB" ||
        this.$store.getters.getChainIdName === "HPB" ||
        this.$store.getters.getChainIdName === "CRONOS" ||
        this.$store.getters.getChainIdName === "AME" ||
        this.$store.getters.getChainIdName === "ECH" ||
        this.$store.getters.getChainIdName === "CUBE" ||
        this.$store.getters.getChainIdName === "GNOSIS" ||
        this.$store.getters.getChainIdName === "ETC" ||
        this.$store.getters.getChainIdName === "KCC" ||
        this.$store.getters.getChainIdName === "BRISE" ||
        this.$store.getters.getChainIdName === "CELO" ||
        this.$store.getters.getChainIdName === "Optimism" ||
        this.$store.getters.getChainIdName === "DRAC" ||
        this.$store.getters.getChainIdName === "KLAY" ||
        this.$store.getters.getChainIdName === "FSC" ||
        this.$store.getters.getChainIdName === "FRZ" ||
        this.$store.getters.getChainIdName === "GRC30" ||
        this.$store.getters.getChainIdName === "CORE" ||
        this.$store.getters.getChainIdName === "DC" ||
        this.$store.getters.getChainIdName === "MTR" ||
        this.$store.getters.getChainIdName === "BTTC" ||
        this.$store.getters.getChainIdName === "ZKSYNC" ||
        this.$store.getters.getChainIdName === "CFX" ||
        this.$store.getters.getChainIdName === "EOS(EVM)" ||
        this.$store.getters.getChainIdName === "FVM" ||
        this.$store.getters.getChainIdName === "SUI" ||
        this.$store.getters.getChainIdName === "PulseChain" ||
        this.$store.getters.getChainIdName === "LINEA" ||
        this.$store.getters.getChainIdName === "PEGO" ||
        this.$store.getters.getChainIdName === "opBNB" ||
        this.$store.getters.getChainIdName === "OZO" ||
        this.$store.getters.getChainIdName === "QITMEER" ||
        this.$store.getters.getChainIdName === "PATEX" ||
        this.$store.getters.getChainIdName === "ETRC20" ||
        this.$store.getters.getChainIdName === "zkEVM" ||
        this.$store.getters.getChainIdName === "SCROLL" ||
        this.$store.getters.getChainIdName === "MNT" ||
        this.$store.getters.getChainIdName === "BASE" ||
        this.$store.getters.getChainIdName === "Metis" ||
        this.$store.getters.getChainIdName === "Moonriver" ||
        this.$store.getters.getChainIdName === "Manta" ||
        this.$store.getters.getChainIdName === "AELF" ||
        this.$store.getters.getChainIdName === "CMEMO" ||
        this.$store.getters.getChainIdName === "Blast" ||
        this.$store.getters.getChainIdName === "Moonbeam"
        
      ) {
        window.open(data.blockExplorerUrls + "/address/" + this.walletAddress);
      } else if (
        this.$store.getters.getChainIdName === "CRU" ||
        this.$store.getters.getChainIdName === "DBC" ||
        this.$store.getters.getChainIdName === "Polkadot" ||
        this.$store.getters.getChainIdName === "XRP" ||
        this.$store.getters.getChainIdName === "EOS" ||
        this.$store.getters.getChainIdName === "APT"
      ) {
        window.open(data.blockExplorerUrls + "/account/" + this.walletAddress);
      } else if (this.$store.getters.getChainIdName === "FIL") {
        window.open(data.blockExplorerUrls + this.walletAddress);
      }
    },
    mouseenter() {
      if (this.isPC) {
        this.showPopover = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  max-width: 750px;
  width: calc(100% - 32px);
  height: 60px;
  padding: 0px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  &.pc {
    max-width: 1200px !important;
    margin: 0 auto;
    // background: linear-gradient(223deg, #00366F 0%, #00193C 100%);
  }
  &.mb {
    width: 100%;
  }

  .bg {
    height: 270px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: -99;
    .bg-box {
      height: 1000vw;
      width: 1000vw;
      border-radius: 500vw;
      position: absolute;
      bottom: 0;
      left: -450vw;
      z-index: -99;
    }
  }
  .logo {
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    img {
      margin-top: 6px;
      width:4.3rem!important
    }
  }
  .app-header-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .wallets:hover {
      span {
        color: #fff;
      }
    }
    .mb-menu {
      display: flex;
      align-items: center;
      position: relative;
      .lang-list {
        padding: 0px 10px;
        position: absolute;
        top: 45px;
        right: 0;
        // width: 150px;
        word-break: keep-all;
        background: #fffbfc;
        border-radius: 13px;
        border: 1px solid #277ffa;
        z-index: 99;
        ul {
          padding: 10px;
          li {
            margin-top: 10px;
            &:first-child {
              margin-top: 0;
            }
            height: 30px;
            border-radius: 9px;
            display: flex;
            justify-content: space-between;
            color: #277ffa;
            align-items: center;
            cursor: pointer;
            a {
              color: #277ffa;
              font-size: 14px;
            }
          }
        }
      }
    }
    .wallets {
      height: 35px;
      margin-left: 0 !important;
      .chainName {
        margin-left: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        font-size: 12px;
        margin-right: 5px;
        position: relative;
        height: 22px;
        line-height: 22px;
        padding-left: 28px;
        svg,
        img {
          margin: 3px 0 0 !important;
          position: absolute;
          left: -6px;
          top: -40%;
          &.EchoooWallet{
            border-radius: 100px;
          }
        }
      }
    }
    .wallets,
    .lang {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 10px;
      position: relative;
      background: rgba(241, 134, 134, 0.04);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      svg {
        height: 35px;
        width: 32px;
        margin: 0 5px;
      }
      span {
        padding-right: 10px;
        white-space: nowrap;
        -webkit-text-size-adjust: none;
        font-size: 14px;
        font-family: Poppins;
        color: #ffffff;
        cursor: pointer;
      }
      .lang-list {
        padding: 0px 10px;
        position: absolute;
        top: 55px;
        right: 0;
        // width: 150px;
        word-break: keep-all;
        background: #f6f9ff;
        border-radius: 13px;
        border: 1px solid rgba(39, 127, 250, 0.64);
        z-index: 99;
        ul {
          li {
            height: 42px;
            padding: 0 10px;
            margin: 5px 0;
            border-radius: 9px;
            display: flex;
            justify-content: space-between;
            color: #277ffa;
            align-items: center;
            cursor: pointer;
            font-size: 18px;
            svg {
              width: 30px;
              height: 30px;
              margin-right: 10px;
            }
            svg path {
              fill: #277ffa;
              transition: 0.2s;
            }
            .line {
              height: 20px;
              width: 1px;
              margin: 0 5px;
              background: #fff;
            }
            .name {
              flex: 1;
              margin: 0 10px;
              font-family: Poppins;
            }
            &.active {
              border: 0px solid #2980fa;
              color: #ffffff;
              svg path {
                fill: #fff;
                transition: 0.2s;
              }
            }
          }
        }
      }
    }
  }
}
.link-tab {
  display: flex;
  margin-left: 60px;
  .tab-list {
    font-size: 18px;
    font-family: Plus Jakarta Sans-SemiBold, Plus Jakarta Sans;
    font-weight: 600;
    line-height: 21px;
    margin-left: 50px;
    a {
      color: #c3dbfe;
      cursor: pointer;
      &.router-link-active-link {
        color: #ffffff;
        position: relative;
        &::after {
          content: "";
          width: 100%;
          height: 2px;
          background: #ffffff;
          position: absolute;
          bottom: -10px;
          left: 0;
        }
      }
    }
  }
}
</style>
