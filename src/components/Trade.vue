<template>
  <div class="trade" :class="
      bridgersFlag === 'bridgers' || sourceFlag == ('msafedapp' || 'msafeb')
        ? 'border'
        : ''
    ">
    <div class="swap-content" v-if="tabActive == 'swap' || tabActive == 'bridge' || tabActive == 'gasSwap'">
      <div class="trade-boxs" v-if="tabActive == 'swap'">
        <TradeBox style="width: calc(50% - 18px)" ref="fromToken" type="from" @getMax="getMax" />
        <svg t="1623380158754" :class="isPC ? 'icon' : 'iconM'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1319" width="200" height="200" @click="exchangeTokens">
          <path d="M955.574857 505.947429c-1.993143 145.627429-27.282286 266.203429-101.229714 338.102857-71.917714 73.947429-192.493714 99.236571-338.102857 101.229714-145.627429-1.993143-266.203429-27.282286-338.121143-101.229714-73.947429-71.899429-99.236571-192.475429-101.229714-338.102857 2.011429-145.627429 27.282286-266.203429 101.229714-338.102858 71.917714-73.947429 192.493714-99.254857 338.102857-101.248 145.627429 2.011429 266.203429 27.300571 338.121143 101.229715 73.947429 71.917714 99.236571 192.493714 101.229714 338.121143z" fill="#F8FBFF" p-id="1320"></path>
          <path d="M438.528 358.089143v-82.779429s0.237714-4.352-8.301714-6.4c-7.021714-1.554286-13.805714 3.328-13.805715 3.328-3.017143 2.304-142.884571 103.533714-142.884571 103.533715s-13.293714 6.930286-13.293714 20.772571c0 13.330286 9.526857 18.962286 9.526857 18.962286l143.634286 100.717714s9.051429 3.346286 16.822857 1.810286c8.301714-1.810286 8.301714-7.954286 8.301714-7.954286v-77.659429h139.849143s110.244571 15.122286 110.244571 56.905143c0 0-1.755429-131.236571-113.737143-131.236571h-136.356571z" fill="#000000" p-id="1321"></path>
          <path d="M581.394286 691.547429v82.779428s1.517714 5.12 10.550857 6.144c6.034286 0.768 9.801143-2.304 11.044571-3.328 3.017143-2.048 143.140571-103.533714 143.140572-103.533714s13.312-6.930286 13.312-20.772572c0-13.586286-9.545143-18.962286-9.545143-18.962285l-143.890286-100.717715s-6.034286-3.602286-14.061714-1.554285c-10.057143 2.56-10.550857 7.954286-10.550857 7.954285v77.403429h-140.617143s-110.226286-15.122286-110.226286-56.905143c0 0 1.755429 131.236571 113.993143 131.236572l136.850286 0.256z" fill="#277FFA" p-id="1322"></path>
        </svg>
        <TradeBox style="width: calc(50% - 18px)" ref="toToken" type="to" />
      </div>
      <div class="bridge-content" v-if="tabActive == 'bridge'">
        <BridgeTrade />
      </div>
      <div class="bridge-content" v-if="tabActive == 'gasSwap'">
        <GasTrade />
      </div>
      <ReceivingAddress />
      <Info />
      <div class="btns">
        <div class="btn themeBg" @click="exchange">
          {{ this.walletAddress ? showSwapBtn : this.$t('connectWallet') }}
        </div>
      </div>
    </div>
    <HNAddLiquidity ref="HNAddLiquidity" v-if="tabActive == 'addLiquidity'" />
    <SwapConfirm :sendGas="sendGas" ref="swapConfirm" @comfirm="comfirm" />
    <noServe ref="noServeDialog"></noServe>
  </div>
</template>

<script>
const SwapConfirm = () => import("./SwapConfirm");
const ReceivingAddress = () => import("./ReceivingAddress");
const HNAddLiquidity = () => import("./HNAddLiquidity");
const BridgeTrade = () => import("./BridgeTrade");
const GasTrade = () => import("./GasTrade");
const noServe = () => import("./noServe");
// 组件
import TradeBox from "../components/TradeBox";

import Info from "./Info";
// 插件
import { Notify, Dialog } from "vant";
import { ethers } from "ethers";
import tronAbi from "../utils/tronAbi";

let provider, signer;
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  signer = provider.getSigner();
}

import BigNumber from "bignumber.js";
import bus from "../eventBus";
import getAllBalance from "../utils/getAllBalance";
import BtcExchangeHandle from "../utils/getBtcBalance";
import getTronBalance from "../utils/getTronBalance";
import baseApi from "../api/baseApi";
import getEOSBalance from "../utils/getEOSBalance";
import getAPTBalance from "../utils/getAPTBalance";
import { supportNetWork } from "../config";
import getSolTokenBalance from "../utils/getSolTokenBalance";
import tronApi from "../api/BaseGeneralApi";
import getPolkadotBalance from "../utils/getPolkadotBalance";
import getDogeBalance from "../utils/getDogeBalance";
import axios from "axios";
import suiWalletMethods from "../utils/suiWalletConnect";
import getFILBalance from "../utils/getFILBalance";
import seiWalletConnect from "../utils/seiWalletConnect";
import havahWalletConnect from "../utils/havahWalletConnect";
import PortkeyMethods from "@/utils/PortkeyMethods";

let tp = null;
let isTP = false;
import { EthereumProvider } from "@walletconnect/ethereum-provider";
let WalletConnectProvider = null;
try {
  tp = require("tp-js-sdk");
  isTP = tp.isConnected();
} catch (error) {
  console.log(error);
}
export default {
  name: "Trade",
  components: {
    TradeBox,
    ReceivingAddress,
    Info,
    SwapConfirm,
    noServe,
    HNAddLiquidity,
    BridgeTrade,
    GasTrade,
    // Preference,
  },
  data() {
    return {
      needApprove: false,
      sendGas: null,
      sourceFlag: localStorage.getItem("sourceFlag"),
      bridgersFlag: localStorage.getItem("bridgersFlag"),
    };
  },
  watch: {
    // 监听钱包是否激活
    chainId(val, old) {
      if (!this.isUserChoose) {
        //this.aiSetToken()
      }
    },
    fromToken(val, oldVal) {
      if (!val) return;
      if (
        this.toToken &&
        val.mainNetwork == this.toToken.mainNetwork &&
        val.coinCode == this.toToken.coinCode
      ) {
        this.toToken = null;
      }
      this.$store.commit("setBalance", 0);
      this.init();
    },
  },
  computed: {
    isUserChoose() {
      return this.$store.state.isUserChoose;
    },
    order() {
      return this.$store.state.order;
    },
    // 当前链路
    chainId() {
      return this.$store.state.chainId;
    },
    walletAddress() {
      if (this.$store.state.chainId == "000") {
        return this.$store.state.walletPolkadot.addrSS58;
      }
      if (this.$store.state.chainId == "222") {
        return this.$store.state.walletPolkadot.addrSS58CRU;
      }
      if (this.$store.state.chainId == "333") {
        return this.$store.state.walletPolkadot.addrSS58DBC;
      } else if (this.$store.state.chainId == "0") {
        return this.$store.state.walletTRON;
      } else {
        return this.$store.state.wallet.address;
      }
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
    bridgeChooseToken: {
      get() {
        return this.$store.state.bridgeChooseToken;
      },
      set(val) {},
    },
    fromToken: {
      get() {
        if (this.tabActive == "bridge") {
          return this.bridgeFromTokenchain;
        }
        if (this.tabActive == "gasSwap") {
          return this.$store.state.gasFromToken;
        }
        return this.$store.state.fromToken;
      },
      set(val) {
        this.$store.commit("setFromToken", val);
      },
    },
    toToken: {
      get() {
        if (this.tabActive == "bridge") {
          return this.bridgeToTokenchain;
        }
        if (this.tabActive == "gasSwap") {
          return this.$store.state.gasToToken;
        }
        return this.$store.state.toToken;
      },
      set(val) {
        if (this.tabActive == "gasSwap") {
          return this.$store.commit("setgasToToken", val);
        }
        this.$store.commit("setToToken", val);
      },
    },
    info() {
      return this.$store.state.info;
    },
    showSwapBtn() {
      if (this.$store.state.fromNumber > 0) {
        if (this.$store.state.updating) {
          return this.$t("updating");
        } else {
          return this.$t("swap");
        }
      } else if (this.$store.state.NFTChange) {
        return this.$t("swap");
      } else {
        return this.$t("exchangeQuantity");
      }
    },
    getChainIdName: {
      get() {
        return this.$store.getters.getChainIdName;
      },
      set(val) {},
    },
    NFTChange() {
      return this.$store.state.NFTChange;
    },
    connectType() {
      return this.$store.state.wallet.connectType;
    },
    rpcObject() {
      return this.$store.state.rpcObject;
    },
    coinList() {
      return this.$store.state.coinList;
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.ratio = new BigNumber(0);
    bus.$on("getSendGas", (res) => {
      this.sendGas = res;
    });
  },
  methods: {
    async aiSetToken() {
      await this.getBalance();
      //余额不为0
      if (!this.fromToken || this.fromToken.balance != 0) {
        return;
      }
      let arr = supportNetWork.filter((item) => item.chainId == this.chainId);
      if (arr.length == 0) return;
      const netWork = arr[0];
      if (netWork.netWork != this.fromToken.mainNetwork || !netWork.isEvm) {
        return;
      }
      let balanceList = [];
      const tokenList = this.coinList.filter(
        (item) => item.mainNetwork == netWork.netWork
      );
      let mainCoin = tokenList.filter(
        (item) =>
          (item.contact == "" ||
            item.coinCode.includes("USDT") ||
            item.coinCode.includes("USDC")) &&
          this.toToken.coinCode != item.coinCode
      );
      const data = await getAllBalance(mainCoin, netWork.netWork);
      mainCoin.forEach((item, index) => {
        const coinDecimalNum = item.coinDecimal == null ? 0 : item.coinDecimal;
        const balance = new BigNumber(data[index].result)
          .shiftedBy(-(coinDecimalNum != 0 ? coinDecimalNum : 18))
          .toFixed(6, BigNumber.ROUND_DOWN);
        item.balance = balance > 0 ? Number(balance) : 0;
        if (item.balance > 0) {
          balanceList.push(item);
        }
      });
      mainCoin = this.sortObjectsByProperty(balanceList, "balance");
      if (mainCoin.length == 0) return;
      this.fromToken = mainCoin[0];
      localStorage.setItem("localFromToken", JSON.stringify(mainCoin[0]));
    },
    sortObjectsByProperty(arr, prop) {
      arr.sort(function (a, b) {
        if (a[prop] > b[prop]) {
          return -1;
        }
        if (a[prop] < b[prop]) {
          return 1;
        }
        return 0;
      });
      return arr;
    },
    //初始化获取币种余额
    init() {
      clearInterval(this.timer);
      this.getBalance();
      this.timer = setInterval(() => {
        this.getBalance();
      }, 5000);
    },
    changeFromToken(item) {
      this.fromToken = item;
      this.$refs.fromToken.number = this.fromToken.balance;
      this.changeToken(item);
    },
    changetoToken(item) {
      this.toToken = item;
      this.changeToken(item);
    },
    changeToken(item) {
      this.ratio = 0;
      this.init();
      this.ratio = new BigNumber(0);
      this.getRatio();
    },
    changeTokensBox() {
      [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    },
    getMax() {
      let max;
      if (this.info !== null) {
        max =
          Number(this.info.depositMax) < Number(this.$store.state.balance)
            ? this.info.depositMax
            : this.$store.state.balance;
      } else {
        max = this.$store.state.balance;
      }
      this.$store.commit("setFromNumber", max);
    },
    // 获取余额
    async getBalance() {
      const coin = this.fromToken;
      const wallet = this.$store.state.wallet;
      if (
        !coin ||
        (!wallet.address &&
          !this.$store.state.walletPolkadot &&
          !this.$store.state.walletTRON)
      ) {
        return;
      }
      //fil获取余额
      if (coin.mainNetwork === "FIL" && window.filecoin) {
        if (this.connectType == "MathWalletFIL") {
          const filBalance = await getFILBalance();
          this.setBalance(coin, (Number(filBalance) / 10 ** 18).toFixed(6));
        }
      }

      //dot获取余额
      if (
        coin.mainNetwork === "DOT" ||
        coin.mainNetwork === "CRU" ||
        coin.mainNetwork === "DBC"
      ) {
        if (this.connectType != "Polkadot") return;
        const freeBalance = await getPolkadotBalance(coin);
        if (freeBalance == "0") {
          this.setBalance(coin, 0);
        } else {
          if (coin.mainNetwork === "CRU") {
            var newBalance =
              freeBalance.slice(0, freeBalance.length - 12) +
              "." +
              freeBalance.slice(1);
          } else if (coin.mainNetwork === "DBC") {
            var newBalance = freeBalance / 1000000000000000;
          } else {
            var newBalance =
              freeBalance.slice(0, freeBalance.length - 10) +
              "." +
              freeBalance.slice(1);
            if (coin.contact == "1984") {
              newBalance = new BigNumber(freeBalance)
                .dividedBy(BigNumber(10).pow(coin.coinDecimal))
                .toFixed(4, BigNumber.ROUND_DOWN);
            }
          }

          newBalance = Number(newBalance).toFixed(5);
          this.setBalance(coin, newBalance);
        }
      }
      //trx获取余额
      if (coin.mainNetwork === "TRX") {
        if (
          (this.connectType != "TronLink" && this.isPC) ||
          (!this.isPC && !window.tronWeb)
        )
          return;
        const reslt = await getTronBalance();
        let tronWeb = window.tronWeb;
        if (coin.coinCode === "TRX") {
          this.setBalance(coin, tronWeb.fromSun(reslt.balance).toString());
        } else {
          if (coin.contact.length > 10) {
            const contractAddress = coin.contact; // TRC20 代币的合约地址
            const accountAddress = this.$store.state.walletTRON; // 需要查询余额的账户地址
            let contract = null;
            if (contractAddress == "TMz2SWatiAtZVVcH2ebpsbVtYwUPT9EdjH") {
              contract = await tronWeb.contract(tronAbi, contractAddress);
            } else {
              contract = await tronWeb.contract().at(contractAddress);
            }
            const balance = await contract.balanceOf(accountAddress).call();
            const tronBalance = tronWeb
              .BigNumber(balance.toString())
              .shiftedBy(-(coin.coinDecimal != null ? coin.coinDecimal : 18))
              .toFixed(6, BigNumber.ROUND_DOWN);
            this.setBalance(coin, tronBalance > 0 ? tronBalance : 0);
          } else {
            let assets = reslt.assetV2;
            if (assets && assets.length !== 0) {
              let token = assets.find((e) => {
                if (e.key === coin.contact) {
                  return e;
                }
              });
              if (token) {
                const balance = new BigNumber(token.value)
                  .shiftedBy(
                    -(coin.coinDecimal != null ? coin.coinDecimal : 18)
                  )
                  .toFixed(6, BigNumber.ROUND_DOWN);
                this.setBalance(coin, balance);
              } else {
                this.setBalance(coin, 0);
              }
            } else {
              this.setBalance(coin, 0);
            }
          }
        }
      }
      // SOL获取余额
      if (coin.mainNetwork === "SOL") {
        if (this.connectType != "Phantom") return;
        const solanaWeb3 = await import("@solana/web3.js");
        const connection = new solanaWeb3.Connection(
          this.$store.state.rpcObject.SOL[0] || "https://rpc.ankr.com/solana",
          "confirmed"
        );
        if (coin.contact === "") {
          let account = null;
          try {
            account = await connection.getAccountInfo(window.solana.publicKey);
          } catch (error) {}
          if (account) {
            const balanceSOL = (Number(account.lamports) / 1000000000).toFixed(
              6
            );
            this.setBalance(coin, balanceSOL);
          } else {
            this.setBalance(coin, 0);
          }
        } else {
          const balance = await getSolTokenBalance(
            this.walletAddress,
            coin.contact
          );
          if (balance > 0) {
            this.setBalance(coin, balance);
          } else {
            this.setBalance(coin, 0);
          }
        }
      }
      //terra 获取余额
      if (coin.mainNetwork === "LUNA") {
        if (this.connectType != "TerraStation") return;
        const module = await import("../utils/getTerraBalance");
        const address = this.$store.state.wallet.address;
        const balance = await module.default(coin, address);
        this.setBalance(coin, balance);
      }
      //BTC 获取余额
      if (coin.mainNetwork === "BTC") {
        if (
          this.connectType == "LiqualityWallet" ||
          this.connectType == "TokenPocketBTC"
        ) {
          const balance = await BtcExchangeHandle.getBtcBalanceHandle();
          this.setBalance(coin, balance);
          return;
        } else if (this.connectType == "Unisat") {
          let resBalance = await window.unisat.getBalance();
          const balanceNewBTC = Number(resBalance.total) / 10 ** 8;
          this.setBalance(coin, balanceNewBTC);
        }
      }
      // EOS 获取余额
      if (coin.mainNetwork === "EOS") {
        if (this.connectType != "LeafWallet") return;
        const res = await getEOSBalance(coin);
        this.setBalance(
          coin,
          new BigNumber(res).toFixed(6, BigNumber.ROUND_DOWN)
        );
        return;
      }
      if (coin.mainNetwork === "XRP") {
        if (this.connectType != "XUMM") return;
        if (coin.coinCode === "XRP") {
          const xrpBalance = await baseApi.getXRPBalance(wallet.address);
          let balance = 0;
          if (xrpBalance.xrpBalance) {
            balance =
              Number(xrpBalance.xrpBalance) - xrpBalance.ownerCount * 2 - 10;
          }
          this.setBalance(
            coin,
            new BigNumber(balance).toFixed(6, BigNumber.ROUND_DOWN)
          );
          return;
        }
        const tokensBalance = await baseApi.getXRPTokensBalance(wallet.address);
        const tokenInfo = tokensBalance.find(
          (e) => e.counterparty === coin.contact
        );
        if (tokenInfo) {
          this.setBalance(
            coin,
            new BigNumber(tokenInfo.value).toFixed(6, BigNumber.ROUND_DOWN)
          );
        }
        return;
      }

      if (coin.mainNetwork === "APT") {
        if (this.connectType != "Petra" && this.connectType != "MSafe") return;
        const res = await getAPTBalance(coin);
        this.setBalance(
          coin,
          new BigNumber(res).toFixed(6, BigNumber.ROUND_DOWN)
        );
        return;
      }

      //doge 获取余额
      if (coin.mainNetwork === "DOGE") {
        if (this.connectType != "TokenPocketDoge") return;
        const balance = await getDogeBalance();
        this.setBalance(coin, balance);
        return;
      }
      //sui 获取余额
      if (coin.mainNetwork === "SUI") {
        if (
          this.connectType != "SuiWallet" &&
          this.connectType != "OKExWalletSui"
        )
          return;
        const balance = await suiWalletMethods.getSuiBalance(coin.contact);
        this.setBalance(coin, balance);
        return;
      }

      //sei获取余额
      if (coin.mainNetwork === "SEI") {
        if (this.connectType != "Compass") return;
        const balance = await seiWalletConnect.getSEIBalance();
        this.setBalance(coin, (Number(balance) / 10 ** 6).toFixed(6));
        return;
      }
      //brc20获取余额
      if (coin.mainNetwork === "BRC20") {
        if (this.connectType != "Unisat") return;
        const res = await baseApi.queryBRC20({
          address: wallet.address,
          ticker: coin.coinCode === "1000SATS" ? "SATS" : coin.coinCode,
        });
        if (res.resCode == 800) {
          if (res.data.data.detail.length > 0) {
            let balance = 0;
            let options = [];
            res.data.data.detail.forEach((list) => {
              balance += Number(list.data.amt);
              options.push({
                value: list.inscriptionId,
                label: list.data.amt,
                ...list,
              });
            });
            this.$store.commit("setbalanceOptions", options);
            this.setBalance(coin, balance);
          } else {
            this.setBalance(coin, 0);
          }
        } else {
          this.setBalance(coin, 0);
        }
        return;
      }
      // ELF获取余额
      if (coin.mainNetwork === "AELF") {
        if (this.connectType != "Portkey") return;
        const balance = await PortkeyMethods.getBalance(coin)
        this.setBalance(coin, balance);
        return;
      }
      //HVH获取余额
      if (coin.mainNetwork === "HVH") {
        if (this.connectType != "HAVAH") return;
        const balance = await havahWalletConnect.getHVHBalance();
        this.setBalance(coin, (Number(balance) / 10 ** 18).toFixed(6));
        return;
      }
      //BSC ETH HECO POLYGON OKExChain TT ARB FTM AVAXC
      if (
        coin.mainNetwork === "BSC" ||
        coin.mainNetwork === "ETH" ||
        coin.mainNetwork === "HECO" ||
        coin.mainNetwork === "POLYGON" ||
        coin.mainNetwork === "ETHF" ||
        coin.mainNetwork === "ETHW" ||
        coin.mainNetwork === "Optimism" ||
        coin.mainNetwork === "OKExChain" ||
        coin.mainNetwork === "ARB" ||
        coin.mainNetwork === "AVAXC" ||
        coin.mainNetwork === "TT" ||
        coin.mainNetwork === "XDC" ||
        coin.mainNetwork === "KLAY" ||
        coin.mainNetwork === "CELO" ||
        coin.mainNetwork === "ORC" ||
        coin.mainNetwork === "SGB" ||
        coin.mainNetwork === "HPB" ||
        coin.mainNetwork === "CRONOS" ||
        coin.mainNetwork === "ECH" ||
        coin.mainNetwork === "AME" ||
        coin.mainNetwork === "CUBE" ||
        coin.mainNetwork === "GNOSIS" ||
        coin.mainNetwork === "ETC" ||
        coin.mainNetwork === "KCC" ||
        coin.mainNetwork === "BRISE" ||
        coin.mainNetwork === "FTM" ||
        coin.mainNetwork === "DRAC" ||
        coin.mainNetwork === "FSC" ||
        coin.mainNetwork === "FRZ" ||
        coin.mainNetwork === "GRC30" ||
        coin.mainNetwork === "CORE" ||
        coin.mainNetwork === "DC" ||
        coin.mainNetwork === "MTR" ||
        coin.mainNetwork === "BTTC" ||
        coin.mainNetwork === "ZKSYNC" ||
        coin.mainNetwork === "CFX" ||
        coin.mainNetwork === "EOS(EVM)" ||
        coin.mainNetwork === "FVM" ||
        coin.mainNetwork === "PulseChain" ||
        coin.mainNetwork === "LINEA" ||
        coin.mainNetwork === "PEGO" ||
        coin.mainNetwork === "opBNB" ||
        coin.mainNetwork === "ETRC20" ||
        coin.mainNetwork === "OZO" ||
        coin.mainNetwork === "QITMEER" ||
        coin.mainNetwork === "PATEX" ||
        coin.mainNetwork === "zkEVM" ||
        coin.mainNetwork === "SCROLL" ||
        coin.mainNetwork === "MNT" ||
        coin.mainNetwork === "BASE" ||
        coin.mainNetwork === "Metis" ||
        coin.mainNetwork === "Moonriver" ||
        coin.mainNetwork === "Manta" ||
        coin.mainNetwork === "CMEMO" ||
        coin.mainNetwork === "Blast" ||
        coin.mainNetwork === "Moonbeam"
      ) {
        if (
          this.connectType == "LeafWallet" ||
          this.connectType == "LiqualityWallet" ||
          this.connectType == "TokenPocketBTC" ||
          this.connectType == "TerraStation" ||
          this.connectType == "Phantom" ||
          this.connectType == "TronLink" ||
          this.connectType == "Polkadot" ||
          this.connectType == "SuiWallet" ||
          this.connectType == "Unisat" ||
          this.connectType == "Petra" ||
          this.connectType == "HAVAH" ||
          (this.connectType == "MathWalletFIL" && coin.mainNetwork == "FIL") ||
          this.connectType == "OKExWalletSui"
        )
          return;
        const data = await getAllBalance([coin], coin.mainNetwork);
        if (coin.mainNetwork === "CFX") {
          this.$store.commit("setBalance", data > 0 ? data : 0);
          return;
        }
        const coinDecimalNum = coin.coinDecimal == null ? 0 : coin.coinDecimal;
        const balance =
          new BigNumber(data[0].result)
            .shiftedBy(-(coinDecimalNum != 0 ? coinDecimalNum : 18))
            .toFixed(7, BigNumber.ROUND_DOWN)
            .slice(0, -1) - 0;
        this.$store.commit("setBalance", balance > 0 ? balance : 0);
      }
    },
    // 显示余额
    setBalance(coin, balance) {
      if (
        (this.$store.state.chainId == "000" &&
          (coin.coinCode == "DOT" || coin.coinCode == "USDT(DOT)")) ||
        (this.$store.state.chainId == "222" && coin.coinCode == "CRU") ||
        (this.$store.state.chainId == "333" && coin.coinCode == "DBC") ||
        (this.$store.state.chainId == "1993" && coin.mainNetwork == "LUNA") ||
        (this.$store.state.chainId == "1994" && coin.mainNetwork == "BTC") ||
        (this.$store.state.chainId == "2021" && coin.mainNetwork == "SOL") ||
        (this.$store.state.chainId == "1008600" && coin.mainNetwork == "XRP") ||
        (this.$store.state.chainId == "0" && coin.mainNetwork == "TRX") ||
        (this.$store.state.chainId == "1040" && coin.mainNetwork == "EOS") ||
        (this.$store.state.chainId == "072611" && coin.mainNetwork == "APT") ||
        (this.$store.state.chainId == "9666" && coin.mainNetwork == "DOGE") ||
        (this.$store.state.chainId == "1200" && coin.mainNetwork == "FIL") ||
        (this.$store.state.chainId == "1333" && coin.mainNetwork == "SEI") ||
        (this.$store.state.chainId == "6000" && coin.mainNetwork == "HVH") ||
        (this.$store.state.chainId == "520520" && coin.mainNetwork == "AELF") ||
        (this.$store.state.chainId == "1994" && coin.mainNetwork == "BRC20")
      ) {
        const list = this.$store.state.coinList;
        this.$store.commit("setCoinList", list);
        this.$store.commit("setBalance", Number(balance));
      } else {
        let etherString = ethers.utils.formatUnits(
          balance,
          this.fromToken.coinDecimal
        );
        const number = Number(
          new BigNumber(etherString).toFixed(6, BigNumber.ROUND_DOWN)
        );
        const list = this.$store.state.coinList;
        this.$store.commit("setCoinList", list);
        this.$store.commit("setBalance", number);
      }
    },

    // // 交易
    async exchange() {

      if (
        this.$store.state.chainId !== "000" &&
        this.$store.state.chainId !== "222" &&
        this.$store.state.chainId !== "0" &&
        this.$store.state.chainId !== "333" &&
        this.$store.state.chainId !== "072611" &&
        this.$store.state.chainId !== "7299" &&
        (!this.$store.state.wallet || !this.$store.state.wallet.address)
      ) {
        bus.$emit("getMetaMask");
        return;
      }

      const actionCode = localStorage.getItem("actionCode");
      const isLimit = localStorage.getItem("isLimit");
      if (
        actionCode !== "hdueyjsnxodi38n4u2n2kw3j" &&
        isLimit !== "1" &&
        process.env.NODE_ENV !== "development"
      ) {
        this.$refs.noServeDialog.serveShow();
        return;
      }

      if (
        this.$store.state.fromNumber === "" ||
        this.$store.state.fromNumber <= 0
      ) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("exchangeQuantity"),
        });
        return;
      }
      if (
        !this.$store.state.info ||
        this.$store.state.updating ||
        !this.fromToken ||
        !this.toToken
      )
        return;
      //这里判断是否链接钱包，网络是否正确
      let mainNetWorrk = this.fromToken.mainNetwork;
      if (mainNetWorrk == "TRX") {
        mainNetWorrk = "TRON";
      }
      if (mainNetWorrk == "DOT") {
        mainNetWorrk = "Polkadot";
      }
      const val = {
        netWork: mainNetWorrk,
      };
      const activeNetwork = supportNetWork.filter(
        (item) => item.netWork == mainNetWorrk
      )[0];
      if (activeNetwork.chainId != this.chainId && this.connectType != "JoyIDWallet") {
        return await this.chechNetwork(val);
      }
      // 余额判断
      if (
        Number(this.$store.state.fromNumber) >
        (this.tabActive == "bridge"
          ? Number(this.bridgeChooseToken.balance)
          : Number(this.$store.state.balance))
      ) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("insufficient", {
            coin: this.fromToken.coinCode,
          }),
        });
        return;
      }
      if (
        Number(this.$store.state.fromNumber) < Number(this.info.depositMin) ||
        Number(this.$store.state.fromNumber) > Number(this.info.depositMax)
      ) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("rangeTip", {
            min: this.info.depositMin,
            max: this.info.depositMax,
          }),
        });
        return;
      }

      if (!this.$store.state.address) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("receivingAddress"),
        });
        return;
      }

      if (
        this.fromToken.mainNetwork == "SOL" ||
        this.toToken.mainNetwork == "SOL"
      ) {
        return Dialog.confirm({
          message: this.$t("solTip"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      if (
        this.fromToken.mainNetwork == "CUBE" &&
        this.toToken.mainNetwork != "CUBE"
      ) {
        return Dialog.confirm({
          message: this.$t("cubeTip"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // ETC 兑换提示
      if (
        this.fromToken.mainNetwork == "ETC" &&
        this.fromToken.coinCode == "ETC"
      ) {
        return Dialog.confirm({
          message: this.$t("ETCTip"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // ETHF 兑换提示
      if (
        this.fromToken.mainNetwork == "ETHF" &&
        this.fromToken.coinCode == "ETHF"
      ) {
        return Dialog.confirm({
          message: this.$t("ETHFTip"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // FREN(ETHF) 兑换提示
      if (
        this.fromToken.mainNetwork == "ETHF" &&
        this.fromToken.coinCode == "FREN"
      ) {
        return Dialog.confirm({
          message: this.$t("deepInfo"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // 深度问题 兑换提示
      if (this.info.dex == "SWFT" && this.info.isDex == "Y") {
        return Dialog.confirm({
          message: this.$t("deepInfo"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // ETHW 兑换提示
      if (
        this.fromToken.mainNetwork == "ETHW" &&
        this.fromToken.coinCode == "ETHW"
      ) {
        return Dialog.confirm({
          message: this.$t("ETHWTip"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      //ELF
      if (
        (this.fromToken.mainNetwork == "ETH" &&
          this.fromToken.coinCode == "ELF(ERC20)") ||
        (this.fromToken.mainNetwork == "BSC" &&
          this.fromToken.coinCode == "ELF(BSC)") ||
        this.toToken.coinCode == "ELF(ERC20)" ||
        this.toToken.coinCode == "ELF(BSC)"
      ) {
        return Dialog.confirm({
          message: this.$t("deepInfo"),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      // BTC 兑换提示
      if (
        this.fromToken.mainNetwork == "BTC" &&
        this.fromToken.coinCode == "BTC"
      ) {
        let gas = "0.0003";
        try {
          const result = await axios.get(
            "https://blockstream.info/api/fee-estimates"
          );
          const maxValue = Math.max(...Object.values(result));
          const num = Math.ceil(maxValue);
          gas = (num * 224) / 10 ** 8;
        } catch (error) {}
        return Dialog.confirm({
          message: this.$t("BTCTip", {
            num: gas,
          }),
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          confirmButtonText: this.$t("btnContinue"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {
            // on confirm
            this.$refs.swapConfirm.show();
            return;
          })
          .catch(() => {
            // on cancel
            return;
          });
      }
      this.$refs.swapConfirm.show();
      return;
    },
    async walletconnectchangeNet(val) {
      WalletConnectProvider = await EthereumProvider.init(
        this.connectType == "imToken"
          ? this.$store.getters.EthereumProviderInitImtoken
          : this.$store.getters.EthereumProviderInit
      );

      let arrWc = [
        "1",
        "10",
        "56",
        "100",
        "137",
        "324",
        "42161",
        "42220",
        "43114",
      ];
      let arr = supportNetWork.filter((item) => item.netWork == val.netWork);
      if (arrWc.indexOf(arr[0].chainId) == -1) {
        Dialog.alert({
          message: this.$t("noUseNetwork"),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }

      const toChainId = Number(arr[0].chainId);
      try {
        await WalletConnectProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${toChainId.toString(16)}` }],
        }).then((resltTo) => {
          this.$store.commit("setChainId", toChainId.toString());
        });
      } catch (error) {
        if (error.code == "-32601") {
          Dialog.alert({
            message: this.$t("wcWalletNotchain", { chain: val.netWork }),
            theme: "round-button",
            messageAlign: "left",
            confirmButtonColor: "#277ffa",
            className: "noChangeNetwork",
          });
        }
        console.error("切换链失败:", error);
      }
    },
    async chechNetwork(val) {
      if (val && this.$store.state.isWalletConnect) {
        const network = this.$store.getters.getChainIdName;
        const activeNetWork = val.netWork;
        this.walletconnectchangeNet(val);
        return;
      }
      if (
        this.isPC &&
        (!isTP || localStorage.getItem("utm_source") !== "tokenpocket") &&
        val.netWork == "DOGE"
      ) {
        Dialog.alert({
          message: this.$t("dogeUseTP", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      if (
        this.isPC &&
        this.connectType !== "MathWalletFIL" &&
        val.netWork == "FIL"
      ) {
        Dialog.alert({
          message: this.$t("dogeUseTP", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      //移动端 tron 链 切换拦截
      if (
        !this.isPC &&
        window.tronWeb &&
        window.tronWeb.defaultAddress.base58 &&
        (isTP || localStorage.getItem("utm_source") === "tokenpocket") &&
        val.netWork == "TRON"
      ) {
        Dialog.alert({
          message: this.$t("noUseTronLink", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      //移动端EOS拦截
      if (
        !this.isPC &&
        (isTP || localStorage.getItem("utm_source") === "tokenpocket") &&
        val.netWork == "EOS"
      ) {
        Dialog.alert({
          message: this.$t("noUseEOS", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      if (
        this.connectType === "LeafWallet" &&
        localStorage.getItem("utm_source") === "tokenpocket"
      ) {
        Dialog.alert({
          message: this.$t("noUseEOS", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      //移动端sol 切换拦截
      if (
        !this.isPC &&
        (isTP || localStorage.getItem("utm_source") === "tokenpocket") &&
        val.netWork == "SOL"
      ) {
        Dialog.alert({
          message: this.$t("noUseSolana", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      if (
        this.connectType === "Phantom" &&
        localStorage.getItem("utm_source") === "tokenpocket"
      ) {
        Dialog.alert({
          message: this.$t("noUseSolana", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      //移动端doge 切换拦截
      if (
        !this.isPC &&
        (isTP || localStorage.getItem("utm_source") === "tokenpocket") &&
        val.netWork == "DOGE"
      ) {
        Dialog.alert({
          message: this.$t("noUseDoge", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      if (
        this.connectType === "TokenPocketDoge" &&
        localStorage.getItem("utm_source") === "tokenpocket"
      ) {
        Dialog.alert({
          message: this.$t("noUseDoge", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      //移动端 dot 切换拦截
      const { web3Accounts, web3Enable } = await import(
        "@polkadot/extension-dapp"
      );
      const extensions = await web3Enable("my cool dapp");
      const allAccountsSS58 = await web3Accounts({ ss58Format: 0 });
      if (
        !this.isPC &&
        allAccountsSS58.length > 0 &&
        (isTP || localStorage.getItem("utm_source") === "tokenpocket") &&
        (val.netWork == "DOT" || val.netWork == "CRU" || val.netWork == "DBC")
      ) {
        Dialog.alert({
          message: this.$t("noUsePolkadot", {
            network: val.netWork,
          }),
          theme: "round-button",
          messageAlign: "left",
          confirmButtonColor: "#277ffa",
          className: "noChangeNetwork",
        });
        return;
      }
      if (
        val &&
        (val.netWork === "Polkadot" ||
          val.netWork === "CRU" ||
          val.netWork === "DBC")
      ) {
        this.polkDotFuc(val);
        return;
      }
      if (val && val.netWork === "TRON") {
        this.$bus.emit("checkTronLink");
        return;
      }
      if (val && val.netWork === "SOL") {
        this.$bus.emit("connectPhantom");
        return;
      }
      if (val && val.netWork === "LUNA") {
        this.$bus.emit("connectTerraStation");
        return;
      }
      if (val && (val.netWork === "BTC" || val.netWork === "BRC20")) {
        this.$bus.emit("connectLiqualityWallet");
        return;
      }
      if (val && val.netWork === "XRP") {
        this.$bus.emit("connectXUMMWallet");
        return;
      }
      if (val && val.netWork === "EOS") {
        this.$bus.emit("connectEOS");
        return;
      }
      if (val && val.netWork === "SUI") {
        this.$bus.emit("connectSUI");
        return;
      }
      //Nabox 插件
      if (this.connectType === "Nabox") {
        if (val.netWork !== this.$store.getters.getChainIdName) {
          Dialog.alert({
            message: this.$t("noUseNabox", {
              network: val.netWork,
            }),
            theme: "round-button",
            messageAlign: "left",
            confirmButtonColor: "#277ffa",
            className: "noChangeNetwork",
          });
        }
        return;
      }
      //OKExWallet 插件
      if (this.connectType === "OKExWallet") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = okexchain.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                okexchain
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId = okexchain.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {});
              }
            }
          });
        }
        return;
      }
      //OpenBlock 插件
      if (this.connectType === "OpenBlock") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = this.$store.state.chainId;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.openblock
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(async (data) => {
                    if (data.code) {
                      Dialog.alert({
                        message: this.$t("noUseOpenBlock", {
                          network: val.netWork,
                        }),
                        theme: "round-button",
                        messageAlign: "left",
                        confirmButtonColor: "#277ffa",
                        className: "noChangeNetwork",
                      });
                      return;
                    }
                    const updateChainId = await window.openblock.request({
                      method: "eth_chainId",
                    });
                    if (updateChainId !== this.$store.state.chainId) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                    this.exchange();
                  })
                  .catch((error) => {});
              }
            }
          });
        }
        return;
      }
      //EchoooWallet 插件
      if (this.connectType === "EchoooWallet") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.echoooEth.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.echoooEth
                  .request({
                    method: "wallet_switchEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId =
                      window.echoooEth.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {});
              }
            }
          });
        }
        return;
      }
      //oneKey 插件
      if (this.connectType === "oneKey") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.$onekey.ethereum.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.$onekey.ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId =
                      window.$onekey.ethereum.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {});
              }
            }
          });
        }
        return;
      }
      // onto 切换
      if (this.connectType === "ONTO") {
        Notify(
          this.$t("noUseONTO", {
            network: val.netWork,
          })
        );
        return;
      }
      if (this.connectType === "Halo") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.kucoin.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.kucoin
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId = window.kucoin.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {
                    Notify(
                      this.$t("noSupportChain", {
                        wallet: "Kucoin",
                        network: val.netWork,
                      })
                    );
                  });
              }
            }
          });
        }
        return;
      }
      if (this.connectType === "CLVWallet") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.clover.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.clover
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId = window.clover.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {
                    Notify(
                      this.$t("noSupportChain", {
                        wallet: "CLV Wallet",
                        network: val.netWork,
                      })
                    );
                  });
              }
            }
          });
        }
        return;
      }
      if (this.connectType === "Crypto") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.deficonnectProvider.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.deficonnectProvider
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId =
                      window.deficonnectProvider.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {
                    Notify(
                      this.$t("noSupportChain", {
                        wallet: "Crypto",
                        network: val.netWork,
                      })
                    );
                  });
              }
            }
          });
        }
        return;
      }
      if (this.connectType === "Bitget") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.bitkeep.ethereum.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.bitkeep.ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    const updateChainId =
                      window.bitkeep.ethereum.networkVersion;
                    if (
                      updateChainId !== this.$store.state.chainId &&
                      window.location.href.indexOf("tokenpocket") != -1
                    ) {
                      this.$store.commit(
                        "setChainId",
                        parseInt(updateChainId) + ""
                      );
                    }
                  })
                  .catch((error) => {
                    Notify(
                      this.$t("noSupportChain", {
                        wallet: "Bitget Wallet",
                        network: val.netWork,
                      })
                    );
                  });
              }
            }
          });
        }
        return;
      }
      if (this.connectType === "Patex") {
        const network = this.$store.getters.getChainIdName;
        if (network !== val.netWork) {
          supportNetWork.some((e) => {
            if (e.netWork === val.netWork) {
              const chainId = window.patex.ethereum.networkVersion;
              if (e.chainId !== chainId) {
                const newChainId = parseInt(e.chainId);
                window.patex.ethereum
                  .request({
                    method: "wallet_switchEthereumChain",
                    params: [
                      {
                        chainId: `0x${newChainId.toString(16)}`,
                        chainName:
                          e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                        nativeCurrency: {
                          name: e.symbol,
                          symbol: e.symbol,
                          decimals: e.decimals,
                        },
                        rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                        blockExplorerUrls: [e.blockExplorerUrls],
                      },
                    ],
                  })
                  .then(() => {
                    window.patex.ethereum.on("chainChanged", (chainId) => {
                      this.$store.commit("setChainId", parseInt(chainId) + "");
                    });
                  })
                  .catch((error) => {
                    Notify(
                      this.$t("noSupportChain", {
                        wallet: "Patex Wallet",
                        network: val.netWork,
                      })
                    );
                  });
              }
            }
          });
        }
        return;
      }
      if (val && val.netWork === "APT") {
        this.$bus.emit("connectPetra");
        return;
      }

      const network = this.$store.getters.getChainIdName;
      if (network !== val.netWork) {
        const res = await ethereum.request({ method: "eth_chainId" });
        const networkVersion = parseInt(res);
        if (val.netWork === "ETH") {
          if (
            val.netWork === "ETH" &&
            networkVersion == 1 &&
            this.connectType === "MetaMask"
          ) {
            return this.$store.commit("setChainId", parseInt(1) + "");
          }
          if (this.isPC) {
            if (networkVersion == 1) {
              this.$bus.emit("switchEVMNetWork");
              return;
            }
            window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${parseInt("1").toString(16)}` }],
            });
            return;
          }
          Notify({
            color: "#ad0000",
            background: "#ffe1e1",
            message: this.$t("network", {
              network_old: network,
              network: val.netWork,
            }),
          });
          return;
        }
        supportNetWork.some((e) => {
          if (e.netWork === val.netWork) {
            const chainId = networkVersion;
            if (e.chainId !== chainId) {
              const newChainId = parseInt(e.chainId);
              window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: `0x${newChainId.toString(16)}`,
                      chainName:
                        e.netWork == "ORC" ? "Ontology EVM" : e.netWork,
                      nativeCurrency: {
                        name: e.symbol,
                        symbol: e.symbol,
                        decimals: e.decimals,
                      },
                      rpcUrls: this.rpcObject[e.netWork] || [e.rpcUrl],
                      blockExplorerUrls: [e.blockExplorerUrls],
                    },
                  ],
                })
                .then(() => {
                  const updateChainId = newChainId;
                  if (
                    updateChainId !== this.$store.state.chainId &&
                    window.location.href.indexOf("tokenpocket") != -1
                  ) {
                    this.$store.commit(
                      "setChainId",
                      parseInt(updateChainId) + ""
                    );
                  } else {
                    this.$bus.emit("switchEVMNetWork");
                  }
                });
            } else {
              this.$bus.emit("switchEVMNetWork");
            }
          }
        });
      }
    },
    //调用polkdot钱包插件
    async polkDotFuc(val) {
      if (
        this.$store.state.walletPolkadot === null &&
        (val.netWork === "Polkadot" ||
          val.netWork === "CRU" ||
          val.netWork === "DBC")
      ) {
        this.$bus.emit("getPolkadot", val.netWork);
      } else {
        if (val.netWork == "CRU") {
          this.$store.commit("setChainId", "222");
        } else if (val.netWork == "DBC") {
          this.$store.commit("setChainId", "333");
        } else {
          this.$store.commit("setChainId", "000");
        }
        this.$store.commit("setWalletConnectType", "Polkadot");
      }
    },
    async exchangeTokens() {
      let mainNetWorrk = this.toToken.mainNetwork;
      if (mainNetWorrk == "TRX") {
        mainNetWorrk = "TRON";
      }
      if (mainNetWorrk == "DOT") {
        mainNetWorrk = "Polkadot";
      }
      const activeNetwork = supportNetWork.filter(
        (item) => item.netWork == mainNetWorrk
      );
      if (activeNetwork.length < 1) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("notSupported", { coin: this.toToken.coinCode }),
        });
        return;
      }
      [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    },
    comfirm(_b) {
      this.$refs.order.show(_b);
    },
  },
};
</script>
<style lang="scss" scoped>
.trade {
  box-sizing: border-box;
  width: 100%;
  position: relative;
  z-index: 10;
  background: #ffffff;
  box-shadow: 0px 9px 12px 0px rgba(234, 242, 255, 0.15);
  border-radius: 0 0 30px 30px;
  top: -1px;
  &.border {
    border-radius: 30px;
  }
  // padding: 10px 0 10px;
  // display: flex;
  // justify-content: center;
  .swap-content {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    border-radius: 9px;
    padding: 20px;
    .trade-boxs {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: relative;
      .icon {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 47px;
        left: calc(50% - 20px);
      }
      .iconM {
        width: 29px;
        height: 29px;
        position: absolute;
        top: 36px;
        left: calc(50% - 15px);
      }
      .trade-box {
        flex: 1;
        max-width: calc(50% - 18px);
      }
    }
    .line {
      width: 95%;
      margin: 20px auto;
      min-width: 300px;
      height: 1px;
      background: #1d3354;
    }
    .fee {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      .left {
        display: flex;
        justify-content: flex-start;
        .estimated-fee {
          font-size: 10px;
          font-family: Poppins-Regular, Poppins;
          font-weight: 400;
          color: #aab0c8;
        }
        img {
          width: 20px;
          height: 20px;
          margin: 0 5px;
        }
      }
      .right {
        display: flex;
        justify-content: flex-end;
        .coin {
          font-size: 10px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          margin: 0 5px;
        }
      }
    }

    .btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn {
        color: #fff;
        flex: 1;
        // margin: 20px 20px 0;
        margin-top: 0.277rem;
        font-size: 0.37rem;
        line-height: 1.259rem;
        border-radius: 1.859rem;
        height: 1.259rem;
        border-radius: 0.37rem;
        cursor: pointer;
        &.gray {
          background: #21314e !important;
          color: #aaa;
        }
      }
      // .btnM {
      //   color: #fff;
      //   flex: 1;
      //   // margin: 20px 20px 0;
      //   margin-top: 15px;
      //   font-size: 20px;
      //   line-height: 53px;
      //   border-radius: 100px;
      //   height: 53px;
      //   border-radius: 20px;
      //   cursor: pointer;
      //   &.gray {
      //     background: #21314e !important;
      //     color: #aaa;
      //   }
      // }
    }
  }
}
</style>
<style lang="scss">
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: rgba(5, 22, 50, 0.93);
}
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: rgba(5, 22, 50, 0.93);
}
.atooltip {
  background: rgba(5, 22, 50, 0.93) !important;
}
.el-tooltip__popper {
  max-width: 40% !important; //宽度可根据自己需要进行设置
  line-height: 15px !important;
  letter-spacing: 1px;
}
.approving {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
