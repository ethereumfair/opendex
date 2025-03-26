<template>
  <div class="receiving-address">
    <div class="title">{{ $t('reAddress') }}</div>
    <input class="address" :placeholder="
        toToken
          ? toToken.mainNetwork == 'BSC' || toToken.mainNetwork == 'ARB'
            ? this.$t('receivingAddandSpaceId')
            : this.$t('receivingAddress')
          : this.$t('receivingAddress')
      " v-model="address" @focus="focusHandle" @blur="blurHandler" />
    <div class="tip">
      {{ $t('addressTip') }}
    </div>
    <div class="toAddress-select" v-if="showToAddress && toAddress !== '' && address == ''">
      <div class="addressType">{{ $t('currentwalletAddress') }}</div>
      <div class="address-input" @click="clickHandle">
        {{ toAddress }}
      </div>
    </div>
    <div class="toAddress-select" v-if="isSpaceId && isShowSpaceId">
      <div class="addressType">{{ $t('spaceIDaddress') }}</div>
      <div class="address-input" v-if="spaceIdAddress != '' && !isLoading">
        {{ spaceIdAddress }}
      </div>
      <div class="address-input" v-if="spaceIdAddress == '' && !isLoading">
        {{ $t('invalidSpaceID') }}
      </div>
      <div v-if="isLoading">
        <Loading color="#1989fa" />
      </div>
    </div>
    <div class="toAddress-select" v-if="isFio && isShowFioAdddress">
      <div class="addressType">{{ $t('FIOdomainAddress') }}</div>
      <div class="address-input" v-if="FioAddress != '' && !isLoading">
        {{ FioAddress }}
      </div>
      <div class="address-input" v-if="FioAddress == '' && !isLoading">
        {{ $t('invalidFIOdomain') }}
      </div>
      <div v-if="isLoading">
        <Loading color="#1989fa" />
      </div>
    </div>
  </div>
</template>
<script>
import baseApi from "../api/baseApi";
import { Loading } from "vant";
export default {
  name: "ReceivingAddress",
  components: {
    Loading,
  },
  data() {
    return {
      toAddress: "",
      showToAddress: false,
      address: "",
      isSpaceId: false,
      // isgetSpaceAddress: false,
      spaceIdAddress: "",
      isShowSpaceId: false,
      isLoading: false,
      isFio: false,
      isShowFioAdddress: false,
      FioAddress: "",
    };
  },
  watch: {
    chainId(val, old) {
      this.changeAddress("save");
    },
    toToken(val, old) {
      this.changeAddress();
    },
    address(val, old) {
      this.getAddress(val);
      this.getFIOAddress(val);
      // this.$store.commit('setAddress', val)
    },
    "$store.state.wallet": {
      deep: true,
      handler: function (newV) {
        this.changeAddress("save");
      },
    },
  },
  created() {
    //this.toAddress = this.$store.state.address
    this.changeAddress();
    this.$bus.on("clearAddress", this.clearAddress);
  },
  computed: {
    // address: {
    //   get() {
    //     //return this.toAddress;
    //   },
    //   set(val) {
    //     return this.$store.commit('setAddress', val);
    //   },
    // },
    connectType() {
      return this.$store.state.wallet.connectType;
    },
    chainId() {
      return this.$store.state.chainId;
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
    evmList() {
      return this.$store.state.evmList;
    },
  },
  methods: {
    clearAddress() {
      this.address = "";
    },
    focusHandle() {
      this.showToAddress = true;
    },
    blurHandler(e) {
      // window.scrollTo(0, 0)
      setTimeout(() => {
        this.showToAddress = false;
        this.isShowSpaceId = false;
        this.isShowFioAdddress = false;
      }, 200);
    },
    clickHandle() {
      this.address = this.toAddress;
    },
    changeAddress(save) {
      this.isSpaceId = false;
      this.isFio = false;
      this.spaceIdAddress = "";
      this.FioAddress = "";
      this.$store.commit("setSpaceIdDomain", "");
      this.$store.commit("setFIODomain", "");
      let saveAddress = this.$store.state.address;
      this.toAddress = "";
      this.address = "";
      const mainNetwork = this.toToken
        ? this.toToken.mainNetwork || this.toToken.coinCode
        : "";
      if (
        mainNetwork === "ETH" ||
        mainNetwork === "BSC" ||
        mainNetwork === "HECO" ||
        mainNetwork === "POLYGON" ||
        mainNetwork === "ETHF" ||
        mainNetwork === "ETHW" ||
        mainNetwork === "Optimism" ||
        mainNetwork === "OKExChain" ||
        mainNetwork === "ARB" ||
        mainNetwork === "AVAXC" ||
        mainNetwork === "TT" ||
        mainNetwork === "DOT" ||
        mainNetwork === "CRU" ||
        mainNetwork === "DBC" ||
        mainNetwork === "TRX" ||
        mainNetwork === "XDC" ||
        mainNetwork === "SOL" ||
        mainNetwork === "KLAY" ||
        mainNetwork === "FTM" ||
        mainNetwork === "CELO" ||
        mainNetwork === "ORC" ||
        mainNetwork === "SGB" ||
        mainNetwork === "HPB" ||
        mainNetwork === "CUBE" ||
        mainNetwork === "CRONOS" ||
        mainNetwork === "ECH" ||
        mainNetwork === "AME" ||
        mainNetwork === "GNOSIS" ||
        mainNetwork === "ETC" ||
        mainNetwork === "KCC" ||
        mainNetwork === "BRISE" ||
        mainNetwork === "EOS" ||
        mainNetwork === "DRAC" ||
        mainNetwork === "FSC" ||
        mainNetwork === "FRZ" ||
        mainNetwork === "GRC30" ||
        mainNetwork === "CORE" ||
        mainNetwork === "DC" ||
        mainNetwork === "MTR" ||
        mainNetwork === "BTTC" ||
        mainNetwork === "ZKSYNC" ||
        mainNetwork === "CFX" ||
        mainNetwork === "FVM" ||
        mainNetwork === "EOS(EVM)" ||
        mainNetwork === "PulseChain" ||
        mainNetwork === "LINEA" ||
        mainNetwork === "PEGO" ||
        mainNetwork === "opBNB" ||
        mainNetwork === "ETRC20" ||
        mainNetwork === "OZO" ||
        mainNetwork === "QITMEER" ||
        mainNetwork === "zkEVM" ||
        mainNetwork === "PATEX" ||
        mainNetwork === "SCROLL" ||
        mainNetwork === "BTC" ||
        mainNetwork === "BRC20" ||
        mainNetwork === "SUI" ||
        mainNetwork === "MNT" ||
        mainNetwork === "BASE" ||
        mainNetwork === "Metis" ||
        mainNetwork === "Moonriver" ||
        mainNetwork === "Manta" ||
        mainNetwork === "CMEMO" ||
        mainNetwork === "Blast" ||
        mainNetwork === "Moonbeam"
      ) {
        if (
          this.chainId === "1" ||
          this.chainId === "56" ||
          this.chainId === "128" ||
          this.chainId === "137" ||
          this.chainId === "513100" ||
          this.chainId === "10001" ||
          this.chainId === "10" ||
          this.chainId === "66" ||
          this.chainId === "42161" ||
          this.chainId === "43114" ||
          this.chainId === "108" ||
          this.chainId === "000" ||
          this.chainId === "222" ||
          this.chainId === "0" ||
          this.chainId === "333" ||
          this.chainId === "2021" ||
          this.chainId === "50" ||
          this.chainId === "8217" ||
          this.chainId === "250" ||
          this.chainId === "1040" ||
          this.chainId === "58" ||
          this.chainId === "269" ||
          this.chainId === "25" ||
          this.chainId === "180" ||
          this.chainId === "3000" ||
          this.chainId === "1818" ||
          this.chainId === "100" ||
          this.chainId === "61" ||
          this.chainId === "32520" ||
          this.chainId === "321" ||
          this.chainId === "42220" ||
          this.chainId === "3912" ||
          this.chainId === "1995" ||
          this.chainId === "8192" ||
          this.chainId === "1116" ||
          this.chainId === "2000" ||
          this.chainId === "82" ||
          this.chainId === "199" ||
          this.chainId === "324" ||
          this.chainId === "1030" ||
          this.chainId === "314" ||
          this.chainId === "369" ||
          this.chainId === "8453" ||
          this.chainId === "59144" ||
          this.chainId === "9857" ||
          this.chainId === "813" ||
          this.chainId === "4000" ||
          this.chainId === "1101" ||
          this.chainId === "1994" ||
          this.chainId === "7299" ||
          this.chainId === "5000" ||
          this.chainId === "1088" ||
          this.chainId === "1285" ||
          this.chainId === "1284" ||
          this.chainId === "169" ||
          this.chainId === "985" ||
          this.chainId === "81457" ||
          this.chainId === "20201022"
        ) {
          console.log(this.fromToken.mainNetwork,this.toToken.mainNetwork)
          if (
            this.$store.state.walletPolkadot !== null &&
            this.toToken.mainNetwork === "DOT"
          ) {
            this.toAddress = this.$store.state.walletPolkadot.addrSS58;
          } else if (
            this.$store.state.walletPolkadot !== null &&
            this.toToken.mainNetwork === "CRU"
          ) {
            this.toAddress = this.$store.state.walletPolkadot.addrSS58CRU;
          } else if (
            this.$store.state.walletPolkadot !== null &&
            this.toToken.mainNetwork === "DBC"
          ) {
            this.toAddress = this.$store.state.walletPolkadot.addrSS58DBC;
          } else if (
            this.$store.state.walletTRON !== null &&
            this.toToken.mainNetwork === "TRX"
          ) {
            this.toAddress = this.$store.state.walletTRON;
          } else if (
            this.fromToken &&
            this.$store.state.wallet.address !== null &&
            this.toToken.mainNetwork === "SOL" &&
            this.fromToken.mainNetwork === "SOL"
          ) {
            this.toAddress = this.$store.state.wallet.address;
          } else if (
            this.fromToken &&
            this.$store.state.wallet.address !== null &&
            this.evmList.indexOf(this.toToken.mainNetwork) > -1 &&
            this.evmList.indexOf(this.fromToken.mainNetwork) > -1
          ) {
            this.toAddress = this.$store.state.wallet.address;
          } else if (
            this.fromToken &&
            this.$store.state.wallet.address !== null &&
            this.toToken.mainNetwork === "EOS" &&
            this.fromToken.mainNetwork === "EOS"
          ) {
            this.toAddress = this.$store.state.wallet.address;
          } else if (
            this.fromToken &&
            this.$store.state.wallet.address !== null &&
            this.toToken.mainNetwork === "SUI" &&
            this.fromToken.mainNetwork === "SUI"
          ) {
            this.toAddress = this.$store.state.wallet.address;
          } else if (
            this.fromToken &&
            this.$store.state.wallet.address !== null &&
            this.connectType == "Unisat" &&
            (this.toToken.mainNetwork === "BTC" ||
              this.toToken.mainNetwork === "BRC20") &&
            (this.fromToken.mainNetwork === "BTC" ||
              this.fromToken.mainNetwork === "BRC20")
          ) {
            this.toAddress = this.$store.state.wallet.address;
          } else {
            this.toAddress = "";
          }
        }
      } else {
        this.toAddress = "";
        this.address = "";
      }
      if (save == "save") {
        this.address = saveAddress;
      }
    },
    async getAddress(val) {
      if (this.toToken) {
        if (
          (this.toToken.mainNetwork === "BSC" && val.indexOf(".bnb") != -1) ||
          (this.toToken.mainNetwork === "ARB" && val.indexOf(".arb") != -1)
        ) {
          this.isSpaceId = true;
          this.isShowSpaceId = true;
          this.isLoading = true;
          let tId;
          // const result = await axios.get('https://api.prd.space.id/v1/getAddress?tld=bnb&domain='+val)
          if (this.toToken.mainNetwork === "BSC" && val.indexOf(".bnb") != -1) {
            tId = "bnb";
          }
          if (this.toToken.mainNetwork === "ARB" && val.indexOf(".arb") != -1) {
            tId = "arb1";
          }
          const domain = val;
          const params = {
            tId: tId,
            domain: domain,
          };
          baseApi.accountapiSpaceId(params).then((res) => {
            if (res.resCode == "800") {
              const result = JSON.parse(res.data);
              this.isLoading = false;
              if (result.code == "0") {
                if (
                  result.address != "0x0000000000000000000000000000000000000000"
                ) {
                  this.spaceIdAddress = result.address;
                  this.$store.commit("setAddress", result.address);
                  this.$store.commit("setSpaceIdDomain", domain);
                } else {
                  this.spaceIdAddress = "";
                  this.$store.commit("setSpaceIdDomain", "");
                }
              } else {
                this.spaceIdAddress = "";
                this.$store.commit("setSpaceIdDomain", "");
              }
            }
          });
        } else {
          this.isSpaceId = false;
          this.spaceIdAddress = "";
          this.$store.commit("setAddress", val);
          this.$store.commit("setSpaceIdDomain", "");
        }
      }
    },
    async getFIOAddress(val) {
      if (this.toToken) {
        if (val.indexOf("@") != -1) {
          this.isFio = true;
          this.isShowFioAdddress = true;
          this.isLoading = true;
          const params = {
            realmName: val,
            coinCode: this.toToken.coinCode,
          };
          baseApi.transapiFioAddress(params).then((res) => {
            if (res.resCode == "800") {
              const result = res.data;
              this.isLoading = false;
              this.FioAddress = result[0].publicAddress;
              this.$store.commit("setAddress", result[0].publicAddress);
              this.$store.commit("setFIODomain", val);
            } else {
              this.isLoading = false;
              this.FioAddress = "";
              this.$store.commit("setAddress", "");
              this.$store.commit("setFIODomain", "");
            }
          });
        } else {
          this.isFio = false;
          this.FioAddress = "";
          this.$store.commit("setAddress", val);
          this.$store.commit("setFIODomain", "");
        }
      }
    },
  },
  beforeDestroy() {
    this.$bus.off("clearAddress", this.clearAddress);
  },
};
</script>

<style lang="scss" scoped>
.receiving-address {
  margin: 0.37rem 0 0.5rem;
  position: relative;
  .toAddress-select {
    position: absolute;
    bottom: -1.4rem;
    left: 0;
    width: 100%;
    height: -1.2rem;
    background: #f7f8fa;
    box-shadow: 0px 10px 11px 0px rgba(173, 180, 191, 0.34);
    border-radius: 0.265rem;
    border: 1px solid #f1f1f1;
    padding: 0.18rem;
    box-sizing: border-box;
    z-index: 5;
    .address-input {
      width: 100%;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 17px 19px 0px rgba(242, 247, 255, 0.42);
      border-radius: 12px;
      font-size: 0.25rem;
      font-family: Poppins-Medium;
      font-weight: 500;
      color: #666c82;
      line-height: 0.92rem;
      cursor: pointer;
      text-align: left;
      overflow: hidden;
      padding: 0 0.2rem;
      box-sizing: border-box;
    }
    .addressType {
      font-family: Poppins-Medium, Poppins;
      font-weight: 500;
      color: #000000;
      line-height: 30px;
      text-align: left;
      padding: 0 0.1rem;
    }
  }
  .tip {
    text-align: left;
    margin-top: 0.2rem;
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #f17373;
  }
  .title {
    height: 0.92rem;
    line-height: 0.92rem;
    text-align: left;
    font-size: 0.33rem;
    font-family: Poppins-Bold;
    color: #000000;
  }
  .address {
    font-family: Poppins-Medium;
    height: 0.74rem;
    line-height: 0.74rem;
    width: 100%;
    text-align: left;
    border: none;
    border-bottom: 1px solid #aab0c8;
    font-size: 0.259rem;
    transition: border-bottom 0.5s;
    -webkit-transition: border-bottom 0.5s;
    padding: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
    border-radius: 0;
    &:hover {
      color: #000000;
      border-bottom: 1px solid #000000;
    }
  }
}
</style>
