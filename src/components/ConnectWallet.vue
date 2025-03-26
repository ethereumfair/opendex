<template>
  <div>
    <DialogContent ref="dialog" :width="isPC ? '503px' : '95%'">
      <div class="content" :class="isPC ? '' : 'mbcontent'">
        <div class="title">{{ $t('choseWallet') }}</div>
        <div class="tip">{{ $t('plsLinkWallet') }}</div>
        <div class="chinsPart" v-if="bridgersFlag !== 'bridgers'">
          <div class="chain" v-for="(item, index) in chainType" :key="index" :class="selectChain == item ? 'active themeBg' : ''" @click="selectType(item)">
            {{ item }}
          </div>
        </div>
        <div class="walletsBox">
          <ul class="wallets">
            <li v-for="(item, index) in wallets" :key="index" class="wallet border-box" :class="wallet === item.name ? 'active' : ''" @click.stop="choiceWallets(item.name)">
              <div class="left">
                <svg v-if="
                    item.name != 'OKExWalletSui' &&
                    item.name !== 'UniSat' &&
                    item.name !== 'Bitget' &&
                    item.name !== 'EchoooWallet'
                  " class="icon wallet-icon" aria-hidden="true">
                  <use :xlink:href="'#icon-' + item.name"></use>
                </svg>
                <svg v-else-if="item.name == 'OKExWalletSui'" class="icon wallet-icon" aria-hidden="true">
                  <use xlink:href="#icon-OKExWallet"></use>
                </svg>

                <img v-else-if="item.name == 'UniSat'" src="../assets/img/UniSat.svg" class="icon wallet-icon" alt="" />
                <img v-else-if="item.name == 'Bitget'" src="../assets/img/Bitget.svg" class="icon wallet-icon" alt="" />
                <img v-else-if="item.name == 'EchoooWallet'" src="../assets/img/EchoooWallet.png" class="icon wallet-icon" alt="" />
                <div class="name">
                  {{ nameFormat(item.name) }}
                </div>
              </div>
              <img v-if="wallet === item.name" class="choose-icon" src="../assets/img/chooseWallet-icon.png" alt="" />
            </li>
          </ul>
        </div>
      </div>
    </DialogContent>
    <xummDialog ref="qrcode" />
    <imtokenConnect ref="imtokenQR" />
  </div>
</template>
<script>
import DialogContent from "./common/dialog";
import bus from "../eventBus";
import { Notify, Dialog } from "vant";
import walletConnectHandle from "../utils/walletConnect";
import NaboxConnectHandle from "../utils/naboxConnect";
import KuCoinConnectHandle from "../utils/KuCoinConnect";
import OKExWalletConnectHandle from "../utils/OKExWalletConnect";
import oneKeyConnectHandle from "../utils/OneKeyConnect";
import PhantomConnectHandle from "../utils/PhantomConnect";

import BTCWalletConnectHandle from "../utils/BTCWalletConnect";
import XUMMWalletConnetc from "../utils/XUMMWalletConnetc";
import walletList from "../config/walletConfig";
// import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import xummDialog from "./common/XUMMDialog.vue";
import EOSMethods from "../utils/eosMethods";
import ONTOConnectHandle from "../utils/ONTOConnect";
import PetraConnectHandle from "../utils/PetraConnect";
import Coin98ConnectHandle from "../utils/Coin98Connect";
import OpenBlockConnectHandle from "../utils/OpenBlockConnect";
import CLVConnectHandle from "../utils/CLVWalletConnect";
import MSafeConnectHandle from "../utils/MSafeConnect";
import cryptoConnectHandle from "../utils/cryptoConnect";
import { MsafeWallet } from "msafe-wallet";
import bitkeepConnectHandle from "../utils/bitkeepConnect";
import suiWalletMethods from "../utils/suiWalletConnect";
import BTCUnisatConnectHandle from "../utils/BTCWalletConnectUnisat";
import suiOKXWalletMethods from "../utils/suiOKXWalletConnect";
import seiWalletConnect from "../utils/seiWalletConnect";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import patexConnectHandle from "@/utils/patexConnect";
import havahWalletConnect from "@/utils/havahWalletConnect";
import imtokenConnect from "./imtokenConnect.vue";
import FoxWalletConnect from "@/utils/FoxWalletConnect";
import EthoooEthConnect from "@/utils/EthoooEthConnect";
import JoyIDConnect from "@/utils/JoyIDConnect";
import PortkeyMethods from "@/utils/PortkeyMethods";

// import { supportNetWork } from '../../config'
// const tp = require('tp-js-sdk')
let currentChain = "";
let tp = null;
let isTP = false;
try {
  tp = require("tp-js-sdk");
  isTP = tp.isConnected();
} catch (error) {
  console.log(error);
}
// const isTP = tp.isConnected()

export default {
  name: "ConnectWallet",
  components: {
    DialogContent,
    xummDialog,
    imtokenConnect,
  },
  data() {
    return {
      wallet: "",
      wallets: [],
      inval: null,
      sourceFlag: localStorage.getItem("sourceFlag"),
      selectChain: "ALL",
    };
  },
  created() {
    this.bridgersFlag = localStorage.getItem("bridgersFlag");
    if (this.bridgersFlag === "bridgers") {
      this.wallets = walletList.filter((item) => item.bridgersWallet);
    } else {
      this.wallets = walletList;
    }
    //手机端app CLV钱包隐藏
    if (!this.isPC) {
      const list = walletList.filter((item) => item.name != "CLVWallet");
      this.wallets = list;
    }
    if (!isTP || localStorage.getItem("utm_source") !== "tokenpocket") {
      this.autoConnectWallet();
    } else {
      if (localStorage.getItem("sourceFlag") == "globalw") {
        this.tpAutoConnect();
      }
    }
    if (localStorage.getItem("utm_source") === "bitkeep") {
      this.getMetaMask("BitKeep");
    }
    if (MsafeWallet.inMsafeWallet()) {
      MSafeConnectHandle(this);
    }
  },
  async mounted() {
    bus.$on("getMetaMask", () => {
      this.show();
    });
    this.$bus.on("checkTronLink", (val) => {
      this.checkTronLink(val);
    });
    this.$bus.on("switchEVMNetWork", () => {
      this.getMetaMask();
    });
    this.$bus.on("getPolkadot", (val) => {
      this.polkadotWallet(val);
      this.wallet = val;
    });
    // this.$bus.on('PolkadotWallet', (val) => {
    //   this.wallet = val
    //   this.polkadotWallet(val)
    // })
    this.$bus.on("disConnect", this.disConnect);
    this.$bus.on("connectPhantom", this.PhantomConnect);
    this.$bus.on("connectTerraStation", this.TerraStationConnect);
    this.$bus.on("connectLiqualityWallet", this.connectLiqualityWallet);
    this.$bus.on("connectXUMMWallet", this.connectXUMMWallet);
    this.$bus.on("connectEOS", this.connectEOSWallet);
    this.$bus.on("connectSUI", this.connectSUISWallet);
    this.$bus.on("connectPetra", this.connectPetraWallet);
  },
  computed: {
    chainType() {
      const arr = ["ALL", "EVM", "TRON", "SUI"];
      walletList.some((e) => {
        if (!e.isEVM && arr.indexOf(e.type) == -1) {
          arr.push(e.type);
        }
      });
      return arr;
    },
  },
  methods: {
    async choiceWallets(wallet, auto) {
      if (isTP) {
        const currentChainData = await tp.getCurrentWallet();
        currentChain = currentChainData.data.blockchain;

        // if (
        //   !this.isPC &&
        //   window.tronWeb &&
        //   window.tronWeb.defaultAddress.base58 &&
        //   wallet !== 'TronLink' &&
        //   currentChain == 'tron'
        // ) {
        //   Dialog.alert({
        //     message: this.$t('useTronLink'),
        //     theme: 'round-button',
        //     messageAlign: 'left',
        //     confirmButtonColor: '#277ffa',
        //     className: 'noChangeNetwork',
        //   })
        //   return
        // }
        if (
          !this.isPC &&
          wallet !== "DOT" &&
          wallet !== "CRU" &&
          wallet !== "DBC" &&
          (currentChain == "dot" ||
            currentChain == "cru" ||
            currentChain == "dbc")
        ) {
          const { web3Accounts, web3Enable } = await import(
            "@polkadot/extension-dapp"
          );
          const extensions = await web3Enable("my cool dapp");
          const allAccountsSS58 = await web3Accounts({ ss58Format: 0 });
          if (allAccountsSS58.length > 0) {
            Dialog.alert({
              message: this.$t("useDot"),
              theme: "round-button",
              messageAlign: "left",
              confirmButtonColor: "#277ffa",
              className: "noChangeNetwork",
            });
          }
          return;
        }
        if (!this.isPC && wallet !== "Phantom" && currentChain == "27") {
          Dialog.alert({
            message: this.$t("usePhantom"),
            theme: "round-button",
            messageAlign: "left",
            confirmButtonColor: "#277ffa",
            className: "noChangeNetwork",
          });

          return;
        }
        //tp钱包内BTC连接
        if (currentChain === "btc" && wallet == "TokenPocket") {
          this.wallet = "TokenPocket";
          this.$store.commit("setWalletAddress", currentChainData.data.address);
          this.$store.commit("setWalletName", "TokenPocket");
          this.$store.commit("setWalletConnectType", "TokenPocketBTC");
          this.$store.commit("setChainId", "1994");
          this.$refs.dialog.show = false;
          return;
        }
        //tp钱包内doge连接
        if (currentChain == "doge" && wallet == "TokenPocket") {
          this.wallet = "TokenPocket";
          this.$store.commit("setWalletAddress", currentChainData.data.address);
          this.$store.commit("setWalletName", "TokenPocket");
          this.$store.commit("setWalletConnectType", "TokenPocketDoge");
          this.$store.commit("setChainId", "9666");
          this.$refs.dialog.show = false;
          return;
        }
        if (currentChain == "tron" && wallet == "TokenPocket") {
          this.checkTronLink("TokenPocket");
          return;
        }
      }
      switch (wallet) {
        case "TronLink":
          this.checkTronLink();
          break;
        case "walletConnect":
          if (this.$refs.dialog) {
            this.$refs.dialog.show = false;
          }
          walletConnectHandle(this, auto, wallet);
          break;
        case "Nabox":
          NaboxConnectHandle(this);
          break;
        case "OKExWallet":
          OKExWalletConnectHandle(this);
          break;
        case "Phantom":
          PhantomConnectHandle(this);
          break;
        case "TerraStation":
          this.TerraStationConnect(this);
          break;
        case "LiqualityWallet":
          BTCWalletConnectHandle(this);
          break;
        case "DOT":
          this.polkadotWallet(wallet);
          break;
        case "CRU":
          this.polkadotWallet(wallet);
          break;
        case "DBC":
          this.polkadotWallet(wallet);
          break;
        case "XUMM":
          this.connectXUMMWallet();
          break;
        case "LeafWallet":
          this.connectEOSWallet();
          break;
        case "ONTO":
          if (this.isPC) {
            ONTOConnectHandle(this, wallet);
          } else {
            this.getMetaMask(wallet);
          }
          break;
        case "Petra": //APT
          PetraConnectHandle(this);
          break;
        case "OneKey":
          oneKeyConnectHandle(this);
          break;
        case "Coin98":
          Coin98ConnectHandle(this, wallet);
          break;
        case "Halo":
          KuCoinConnectHandle(this, wallet);
          break;
        case "OpenBlock":
          OpenBlockConnectHandle(this, wallet);
          break;
        case "CLVWallet":
          CLVConnectHandle(this, wallet);
          break;
        case "MSafe":
          MSafeConnectHandle(this, wallet);
          break;
        case "Valora":
          if (this.$refs.dialog) {
            this.$refs.dialog.show = false;
          }
          walletConnectHandle(this, auto, wallet);
          break;
        case "Crypto":
          cryptoConnectHandle(this, wallet);
          break;
        case "Bitget":
          bitkeepConnectHandle(this);
          break;
        case "SuiWallet":
          suiWalletMethods.suiWalletConnectHandle(this);
          break;
        case "UniSat":
          BTCUnisatConnectHandle(this);
          break;
        case "OKExWalletSui":
          suiOKXWalletMethods.suiOKXWalletConnectHandle(this);
          break;
        case "Compass":
          seiWalletConnect.seiConnectHandle(this);
          break;
        case "Patex":
          patexConnectHandle(this);
          break;
        case "HAVAH":
          havahWalletConnect.havahConnectHandle(this, wallet);
          break;
        case "imToken":
          if (this.isPC) {
            this.imTokenPC(wallet);
          } else {
            this.getMetaMask(wallet);
          }
          break;
        case "FoxWallet":
          FoxWalletConnect(this);
          break;
        case "EchoooWallet":
          EthoooEthConnect(this);
          break;
        case "JoyIDWallet":
          JoyIDConnect(this);
          break;
        case "Portkey":
          PortkeyMethods.connectWallet(this)
          break;
        default:
          this.getMetaMask(wallet);
          break;
      }
    },
    async tpAutoConnect() {
      const currentChainData = await tp.getCurrentWallet();
      currentChain = currentChainData.data.blockchain;
      //tp钱包内BTC连接
      if (currentChain === "btc") {
        this.wallet = "TokenPocket";
        this.$store.commit("setWalletAddress", currentChainData.data.address);
        this.$store.commit("setWalletName", "TokenPocket");
        this.$store.commit("setWalletConnectType", "TokenPocketBTC");
        this.$store.commit("setChainId", "1994");
        return;
      } else if (currentChain == "doge") {
        //tp钱包内doge连接
        this.wallet = "TokenPocket";
        this.$store.commit("setWalletAddress", currentChainData.data.address);
        this.$store.commit("setWalletName", "TokenPocket");
        this.$store.commit("setWalletConnectType", "TokenPocketDoge");
        this.$store.commit("setChainId", "9666");
        return;
      } else if (currentChain == "tron") {
        this.checkTronLink("TokenPocket");
        return;
      } else if (currentChain == "27") {
        PhantomConnectHandle(this);
        return;
      } else if (currentChain == "dot") {
        this.polkadotWallet(currentChain.toUpperCase());
        return;
      } else if (currentChain == "eos") {
        this.connectEOSWallet();
        return;
      } else {
        this.getMetaMask("TokenPocket");
      }
    },
    async polkadotWallet(val) {
      if (this.$store.state.connectType === "polkadot") {
        return;
      }
      const { web3Accounts, web3Enable } = await import(
        "@polkadot/extension-dapp"
      );
      if (
        currentChain !== "dot" &&
        currentChain !== "cru" &&
        currentChain !== "dbc" &&
        currentChain !== ""
      ) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("switchDotChian", {
            chainName: "Polkadot",
            walletExtension: "polkadot.js extension",
          }),
        });
        return;
      }
      const extensions = await web3Enable("my cool dapp");
      if (extensions.length === 0) {
        //判断是否安装polkdot钱包插件
        if (this.isPC) {
          Notify({
            color: "#ad0000",
            background: "#ffe1e1",
            message: this.$t("notInstallMetamask", {
              wallet: "polkadot.js extension",
            }),
          });
        } else {
          Notify({
            color: "#ad0000",
            background: "#ffe1e1",
            message: this.$t("switchDotChian", {
              chainName: "Polkadot",
              walletExtension: "polkadot.js extension",
            }),
          });
        }

        return;
      }
      //获取钱包上的所有账户
      const allAccountsSS58 = await web3Accounts({ ss58Format: 0 });
      const allAccountsSS58CRU = await web3Accounts({ ss58Format: 66 });
      const allAccountsSS58DBC = await web3Accounts({ ss58Format: 42 });
      const allAccounts = await web3Accounts();
      // if (this.$store.state.walletPolkadot == null) {
      // if (
      //   !this.$store.state.walletPolkadot &&
      //   this.$store.state.chainId == '000'
      // ) {
      const obj = {
        addrSS58: allAccountsSS58,
        addrSS58CRU: allAccountsSS58CRU,
        addrSS58DBC: allAccountsSS58DBC,
        addr: allAccounts,
        network: val,
      };
      this.$refs.dialog.show = false;
      if (allAccountsSS58.length === 0) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("plsCreateAcct"),
        });
      } else {
        this.$bus.emit("openAcct", obj);
      }

      return;
      // }
      // }
    },
    checkTronLink(walletName) {
      //window.hasOwnProperty("tronWeb")
      try{
        if (this.wallet === "TronLink") {
          this.$refs.dialog.show = false;
          return;
        }
      }catch(error){

      }
      const connectorId = localStorage.getItem("connectorId");
      if (connectorId && connectorId === "TronLink") {
        this.inval = setInterval(() => {
          if (window && window.tronWeb) {
            //当获取到地址的时候就关掉定时器
            if (window.tronWeb.defaultAddress) {
              window.clearInterval(this.inval);
              this.$store.commit(
                "setWalletTRON",
                window.tronWeb.defaultAddress.base58
              );
              this.$store.commit("setChainId", "0");
              this.$store.commit(
                "setWalletName",
                walletName ? walletName : "TronLink"
              );
              this.$store.commit(
                "setWalletConnectType",
                walletName ? walletName : "TronLink"
              );
              localStorage.setItem(
                "connectorId",
                walletName ? walletName : "TronLink"
              );
              this.wallet = walletName ? walletName : "TronLink";
              if(this.$refs.dialog){
                this.$refs.dialog.show = false;
              }
            }
          }
        }, 1000);
      } else {
        if (window && window.tronWeb) {
          window.tronWeb.on("addressChanged", (account) => {
            if (account && account.base58) {
              this.$store.commit("c", account.base58);
            }
          });

          if (window.tronWeb.ready && window.tronWeb.defaultAddress.base58) {
            this.disConnect();
            this.$store.commit(
              "setWalletTRON",
              window.tronWeb.defaultAddress.base58
            );
            this.$store.commit("setChainId", "0");
            this.$store.commit(
              "setWalletName",
              walletName ? walletName : "TronLink"
            );
            this.$store.commit(
              "setWalletConnectType",
              walletName ? walletName : "TronLink"
            );
            localStorage.setItem(
              "connectorId",
              walletName ? walletName : "TronLink"
            );
            this.wallet = walletName ? walletName : "TronLink";
            if(this.$refs.dialog){
                this.$refs.dialog.show = false;
              }
          } else {
            if (this.isPC) {
              Notify({
                color: "#ad0000",
                background: "#ffe1e1",
                message: this.$t("loginTronLink"),
              });
            } else {
              Notify({
                color: "#ad0000",
                background: "#ffe1e1",
                message: this.$t("switchTronChian"),
              });
            }
          }
        } else {
          if (this.isPC) {
            Notify({
              color: "#ad0000",
              background: "#ffe1e1",
              message: this.$t("notInstallTronLink"),
            });
          } else {
            Notify({
              color: "#ad0000",
              background: "#ffe1e1",
              message: this.$t("switchTronChian"),
            });
          }
        }
      }
    },
    async getMetaMask(walletName) {
      if (!walletName) {
        walletName = "MetaMask";
      }
      if (walletName == "MathWallet" && window.filecoin) {
        window.filecoin.getAccount().then((account) => {
          this.$store.commit("setWalletAddress", account.address);
          this.$store.commit("setWalletName", walletName);
          this.$store.commit("setWalletConnectType", "MathWalletFIL");
          this.$refs.dialog.show = false;
          //存储钱包已连接
          localStorage.setItem("connectorId", walletName);
          this.$store.commit("setChainId", "1200");
          this.wallet = walletName;
        });

        return;
      }

      if (walletName == "imToken" && window.tronWeb && !this.isPC) {
        this.checkTronLink("imToken");
        return;
      }
      if (walletName == "TokenPocket" && window.tronWeb && !this.isPC) {
        this.checkTronLink("TokenPocket");
        return;
      }
      if (walletName == "BitpieWallet" && window.tronWeb && !this.isPC) {
        this.checkTronLink("BitpieWallet");
        return;
      }
      if (!window.ethereum) {
        if (isTP || localStorage.getItem("utm_source") === "tokenpocket") {
          Notify({
            color: "#ad0000",
            background: "#ffe1e1",
            message: this.$t("tpBTCno"),
          });
          this.disConnect();
          this.$refs.dialog.show = false;
          return;
        }
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("notInstallMetamask", {
            wallet: "MetaMask",
          }),
        });
        let url = location.href;
        window.open("https://metamask.app.link/dapp/" + url);
        return false;
      } else {
        if (this.$store.state.isWalletConnect) return;
        //监听链变化
        window.ethereum.on("chainChanged", (chainId) => {
          if (
            this.$store.state.wallet.connectType === "Nabox" ||
            this.$store.state.wallet.connectType === "OKExWallet" ||
            this.$store.state.wallet.connectType === "ONTO" ||
            this.$store.state.wallet.connectType === "oneKey" ||
            this.$store.state.wallet.connectType === "OpenBlock" ||
            this.$store.state.wallet.connectType === "EchoooWallet" ||
            this.$store.state.wallet.connectType === "CLVWallet" ||
            this.$store.state.wallet.connectType === "Halo" ||
            this.$store.state.wallet.connectType === "Crypto" ||
            this.$store.state.wallet.connectType === "Patex" ||
            this.$store.state.wallet.connectType === "Bitget"
          )
            return;
          this.initEVMChain(walletName);
        });
        //监听账户变化
        window.ethereum.on("accountsChanged", (accounts) => {
          if (this.$store.state.isWalletConnect) return;
          if (
            this.$store.state.wallet.connectType === "Nabox" ||
            this.$store.state.wallet.connectType === "OKExWallet" ||
            this.$store.state.wallet.connectType === "ONTO" ||
            this.$store.state.wallet.connectType === "oneKey" ||
            this.$store.state.wallet.connectType === "OpenBlock" ||
            this.$store.state.wallet.connectType === "EchoooWallet" ||
            this.$store.state.wallet.connectType === "CLVWallet" ||
            this.$store.state.wallet.connectType === "Halo" ||
            this.$store.state.wallet.connectType === "Crypto" ||
            this.$store.state.wallet.connectType === "Patex" ||
            this.$store.state.wallet.connectType === "Bitget"
          )
            return;

          if (!accounts || accounts.length === 0) {
            this.$store.commit("setWalletAddress", "");
          } else {
            this.$store.commit("setWalletAddress", accounts[0]);
          }
        });
        this.initEVMChain(walletName);
      }
    },
    initEVMChain(walletName) {
      window.ethereum
        .request({ method: "eth_requestAccounts", params: [] })
        .then((res) => {
          if (
            (!res || res.length === 0 || res === null) &&
            (isTP || localStorage.getItem("utm_source") === "tokenpocket")
          ) {
            Notify({
              color: "#ad0000",
              background: "#ffe1e1",
              message: this.$t("tpBTCno"),
            });
            this.$refs.dialog.show = false;
            this.disConnect();
            return;
          }
          this.wallet = walletName;
          ethereum.request({ method: "eth_chainId" }).then((res) => {
            if (
              this.$store.state.fromToken &&
              this.$store.state.fromToken.mainNetwork === "NFT" &&
              parseInt(res) == 1
            ) {
              this.$store.commit("setChainId", parseInt("10086") + "");
            } else {
              this.$store.commit("setChainId", parseInt(res) + "");
            }
          });
          this.$store.commit("setWalletAddress", res[0]);
          this.$store.commit("setWalletName", walletName);
          this.$store.commit("setWalletConnectType", "MetaMask");
          this.$refs.dialog.show = false;
          //存储钱包已连接
          localStorage.setItem("connectorId", walletName);
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
          } else {
            console.error("eth_getBalance", error);
          }
          this.$refs.dialog.show = false;
        });
    },
    autoConnectWallet() {
      const connectorId = localStorage.getItem("connectorId");
      const isTronLink = window.tronLink.ready;
      if (isTronLink && !this.isPC) {
        this.choiceWallets("TronLink");
        return;
      }
      const ua = navigator.userAgent;
      const isOKApp = /OKApp/i.test(ua);
      if (isOKApp) {
        this.choiceWallets("OKExWallet");
        return;
      }

      if (
        connectorId === null ||
        connectorId === "" ||
        connectorId === undefined ||
        connectorId === "TronLink" ||
        connectorId === "DOT" ||
        connectorId === "CRU" ||
        connectorId === "DBC" ||
        connectorId === "MSafe" ||
        connectorId === "XUMM"
      ) {
        localStorage.setItem("connectorId", "");
      } else {
        this.choiceWallets(connectorId, "auto");
      }
    },
    connectEOSWallet() {
      EOSMethods.eosConnectHandle(this);
    },
    connectSUISWallet() {
      suiWalletMethods.suiWalletConnectHandle(this);
    },
    PhantomConnect() {
      PhantomConnectHandle(this);
    },
    connectPetraWallet() {
      PetraConnectHandle(this);
    },
    async TerraStationConnect() {
      const module = await import("../utils/TerraStationConnect");
      module.default(this);
    },
    connectLiqualityWallet() {
      if (window.unisat) {
        BTCUnisatConnectHandle(this);
      } else {
        BTCWalletConnectHandle(this);
      }
    },
    connectXUMMWallet() {
      XUMMWalletConnetc.XUMMWalletConnetcHandle(this);
    },
    show() {
      this.$refs.dialog.show = true;
    },
    close() {
      this.isShow = false;
    },
    choosed(val) {
      return this.wallet && this.wallet.name === val;
    },
    //断开连接
    async disConnect() {
      this.wallet = "";
      this.$store.commit("setChainId", null);
      this.$store.commit("setWalletAddress", "");
      this.$store.commit("setWalletPolkadot", null);
      this.$store.commit("setWalletTRON", null);
      this.$store.commit("setWalletName", "");
      this.$store.commit("setWalletConnectType", "");
      //this.$store.commit('setInfo', null)
      this.$store.commit("setBalance", 0);
      localStorage.setItem("connectorId", "");
      this.$store.commit("setIsWalletConnect", false);
      this.$store.commit("setIsPlenaConnect", false);
      const WalletConnectProvider = await EthereumProvider.init(
        this.connectType == "imToken"
          ? this.$store.getters.EthereumProviderInitImtoken
          : this.$store.getters.EthereumProviderInit
      );
      if (WalletConnectProvider) {
        WalletConnectProvider.disconnect();
      }
      //判断Phantom 连接
      if (window.solana && window.solana.isConnected) {
        window.solana.disconnect();
        localStorage.removeItem("wc@2:core:0.3//pairing");
      }
      this.closeWebSocket();
    },
    closeWebSocket() {
      XUMMWalletConnetc.XUMMConnectClose();
    },
    selectType(val) {
      const arr = [];
      let arrMb = walletList;
      if (!this.isPC) {
        arrMb = walletList.filter((item) => item.name != "CLVWallet");
      }
      if (val == "ALL") {
        this.wallets = arrMb;
        this.selectChain = val;
        return;
      }
      arrMb.forEach((item) => {
        if (item.type.indexOf(val) > -1) {
          arr.push(item);
        }
      });
      this.wallets = arr;
      this.selectChain = val;
    },
    nameFormat(val) {
      if (val == "DOT" || val == "CRU" || val == "DBC") {
        return "polkadot{.js}";
      } else if (val === "OKExWallet") {
        return "OKX Wallet";
      } else if (val == "UniSat") {
        return "UniSat Wallet";
      } else if (val == "Bitget") {
        return "Bitget Wallet";
      } else {
        return val;
      }
    },
    imTokenPC(wallet) {
      const self = this;
      walletConnectHandle(self, "auto", wallet);
      clearTimeout(self.imtokeTimer);
      self.imtokeTimer = setTimeout(() => {
        if (self.$store.state.walletConnect_uri)
          self.$refs.imtokenQR.$refs.dialogImtoken.show = true;
      }, 5000);
    },
  },
  beforeDestroy() {
    this.$bus.off("getPolkadot", this.polkadotWallet);
    this.$bus.off("PolkadotWallet");
    this.$bus.off("disConnect", this.disConnect);
    this.$bus.off("connectPhantom", this.PhantomConnect);
    this.$bus.off("connectTerraStation", this.TerraStationConnect);
    this.$bus.off("connectLiqualityWallet", this.connectLiqualityWallet);
    this.$bus.off("connectEOS", this.connectEOSWallet);
    this.$bus.off("connectPetra", this.connectPetraWallet);
    this.$bus.off("connectSUI", this.connectSUISWallet);
  }, // 生命周期 - 销毁之前
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 0;
  &.mbcontent {
    .wallet {
      width: 24%;
      border-radius: 10px;
      padding: 0 12px;
      margin-top: 15px;
      display: flex;
      color: #a1a4b1;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border: 1px solid #f5f9ff;
      margin-left: 1%;
      .left {
        width: 100%;
        display: flex;
        flex-direction: column;
        // justify-content: flex-start;
        align-items: center;
        .wallet-icon {
          margin-top: 5px;
          width: 28px;
          height: 28px;
        }
        .name {
          font-size: 10px;
          margin: 0 6px;
          font-family: Poppins-Medium;
          transform: scale(0.8);
          margin-bottom: 3px;
        }
      }
      .choose-icon {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 20px;
      }
    }
  }
}
.title {
  text-align: left;
  height: 25px;
  font-size: 18px;
  font-family: Poppins;
  color: #000;
  line-height: 24px;
  font-weight: bold;
}
.tip {
  text-align: left;
  height: 19px;
  font-size: 11px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #8f98ae;
}
.walletsBox {
  width: 100%;
  height: 60vh;
  overflow: hidden;
  overflow-y: auto;
}
.wallets {
  display: flex;
  flex-wrap: wrap;
  // overflow: hidden;
  // overflow-y: auto;
  // height: 60vh;
  .wallet {
    width: 23%;
    height: 69px;
    border-radius: 15px;
    padding: 0 12px;
    margin-top: 15px;
    display: flex;
    color: #a1a4b1;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: 1px solid #f5f9ff;
    margin-left: 2%;
    position: relative;
    overflow: hidden;
    .left {
      width: 100%;
      display: flex;
      flex-direction: column;
      // justify-content: flex-start;
      align-items: center;
      .wallet-icon {
        margin-top: 5px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
      .name {
        height: 22px;
        font-size: 12px;
        margin: 0 12px;
        font-family: Poppins-Medium;
        line-height: 22px;
        white-space: nowrap;
      }
    }
    .choose-icon {
      position: absolute;
      top: -1px;
      right: -1px;
      width: 25px;
    }
    &.active,
    &:hover {
      color: #494949;
      border: 1px solid #bdd9ff;
      background: #f0f7ff;
    }
    .checked {
      width: 20px;
      height: 20px;
    }
  }
}
.chinsPart {
  width: 100%;
  margin-top: 15px;
  overflow: hidden;
  overflow-x: auto;
  display: flex;
  .chain {
    width: 76px;
    height: 18px;
    padding: 4px 12px;
    line-height: 18px;
    border-radius: 4px;
    margin-right: 14px;
    margin-bottom: 4px;
    background: #f1f3f5;
    color: #9ea0a5;
    font-weight: 700;
    cursor: pointer;
    font-size: 0.25rem;
    white-space: normal;
    &.active {
      color: #fff;
    }
  }
}
</style>
