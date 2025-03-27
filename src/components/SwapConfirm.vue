<template>
  <div>
    <Dialog
      :width="isPC ? '500px' : '90%'"
      ref="dialogConfirm"
      v-if="fromToken && toToken"
      @close="closeOrderDialog"
      @open="openOrderDilog"
    >
      <div class="centerDiv">
        <div class="free-gas" v-if="info && info.dex == 'OmniBridge' && isFreeGas">
          <div class="free-text">
            <img class="sd" src="../assets/img/sd1.svg" alt="" />
            <span> {{ $t("usenogas") }}</span>
          </div>
          <div class="free-icon" @click.stop="windowOpen">></div>
        </div>
        <div class="imgDiv">
          <img src="@/assets/img/swapConfirm.gif" alt="" />
        </div>
        <div :class="isPC ? 'pc' : ''" class="content">
          <div class="valDiv">
            <div class="top">
              <img
                :src="`https://transfer.swft.pro/swft-v3/images/coins/${fromToken.coinCode}.png`"
              />
              <div class="info">
                <div class="tip">
                  <span class="span12">{{ $t("transferOut") }}</span>
                  <span class="span16"> {{ fromNumber }} </span
                  ><span class="span14">{{ fromToken.coinCodeShow }}</span>
                </div>
                <div class="addr">
                  <span class="addrCut">{{ cutAddress("from") }}</span>
                  <img
                    src="../assets/img/copy.png"
                    v-clipboard:copy="addrCopy('from')"
                    v-clipboard:success="onCopySuccess"
                    v-clipboard:error="onCopyError"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="line"></div>
            </div>
            <div class="bottom">
              <img
                :src="`https://transfer.swft.pro/swft-v3/images/coins/${toToken.coinCode}.png`"
              />
              <div class="info">
                <div class="tip">
                  <span class="span12">{{ $t("expectedText") }}</span
                  ><span class="span16"> {{ toNumber - 0 }} </span
                  ><span class="span14">{{ toToken.coinCodeShow }}</span>
                </div>
                <div class="addr">
                  <span class="addrCut" v-if="spaceIdDomain != ''"
                    >{{ spaceIdDomain }} ({{ cutAddress("to") }})</span
                  >
                  <span class="addrCut" v-if="FIODomain != ''"
                    >{{ FIODomain }} ({{ cutAddress("to") }})</span
                  >
                  <span class="addrCut" v-else>{{ cutAddress("to") }}</span>
                  <img
                    src="../assets/img/copy.png"
                    v-clipboard:copy="$store.state.address"
                    v-clipboard:success="onCopySuccess"
                    v-clipboard:error="onCopyError"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div
            class="rate"
            v-if="sourceFlag != 'HN' && sourceFlag != 'burndex'"
          >
            <div class="left">{{ $t("bridge") }}</div>
            <div class="right" v-if="info">
              <div class="bridge">
                <img
                  :src="
                    twFlag == 'miningtw' &&
                    (info.dex == 'bridgers1' || info.dex == 'OmniBridge')
                      ? 'https://images.swft.pro/dex/miningTW.png'
                      : info.logoUrl
                  "
                  alt=""
                />&nbsp;<span>
                  {{
                    twFlag != "miningtw"
                      ? info.dex == "bridgers1"
                        ? "Bridgers"
                        : info.dex
                      : info.dex == "bridgers1"
                      ? "MiningTW Bridge"
                      : info.dex == "OmniBridge"
                      ? "MiningTW"
                      : info.dex
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="rate">
            <div class="left">{{ $t("rate") }}</div>
            <div class="right" v-if="info">
              1 {{ fromToken.coinCodeShow }} ≈
              {{ Number(info.instantRate).toFixed(8) - 0 }}
              {{ toToken.coinCodeShow }}
            </div>
          </div>

          <div class="rate">
            <div class="left">
              {{
                info &&
                info.dex !== "OmniBridge" &&
                info.dex !== "bridgers1" &&
                info.dex !== "Aggregator" &&
                info.dex !== "bridgers2"
                  ? $t("pathfee")
                  : $t("fee")
              }}
              <img
                @mouseover="tipOpen"
                @click="tipOpen"
                src="../assets/img/tip.png"
                id="tips"
              />
              <Popover
                v-model="showPopover"
                theme="dark"
                trigger="click"
                placement="bottom-start"
                :offset="[-10, 8]"
                :get-container="getContainer"
              >
                <div class="tip-content" v-if="info && info.dex === 'OmniBridge'">
                  {{ $t("feeTip") }}
                </div>
                <div
                  class="tip-content"
                  v-if="
                    info &&
                    info.dex === 'bridgers1' &&
                    info.dex === 'bridgers2' &&
                    info.dex === 'Aggregator'
                  "
                >
                  {{ $t("sSwapfeeTip") }}
                </div>
                <div
                  class="tip-content"
                  v-if="
                    info &&
                    info.dex !== 'OmniBridge' &&
                    info.dex !== 'bridgers1' &&
                    info.dex !== 'Aggregator' &&
                    info.dex !== 'bridgers2'
                  "
                >
                  {{ $t("pathfeeTip") }}
                </div>
              </Popover>
            </div>
            <div class="right">
              <span v-if="info">
                <span
                  v-if="
                    info.dex === 'OmniBridge' ||
                    info.dex === 'bridgers1' ||
                    info.dex === 'Aggregator' ||
                    info.dex === 'bridgers2'
                  "
                  :class="info && info.isDiscount === 'Y' ? 'fee-span' : ''"
                  >{{ info ? getFeeRate(info.depositCoinFeeRate) : "" }} %</span
                >
                <span
                  v-if="
                    info.dex === 'bridgers1' ||
                    info.dex === 'bridgers2' ||
                    info.dex === 'Aggregator'
                  "
                ></span>
                <span v-else>
                  {{
                    sourceFlag === "kfi"
                      ? ""
                      : sendGas
                      ? (info.dex === "OmniBridge" ? " + " : "") +
                        sendGas[0] +
                        " " +
                        sendGas[1]
                      : ""
                  }}
                </span>
              </span>
            </div>
          </div>
          <div
            class="rate"
            v-if="info && info.dex === 'OmniBridge' && info.burnRate != 0"
          >
            <div class="left">{{ $t("burnRate") }}</div>
            <div class="right">
              {{ info.burnRate * 100 + "% " + toToken.coinCode }}
            </div>
          </div>
          <div
            class="rate"
            v-if="
              info &&
              info.dex === 'bridgers1' &&
              info.dex === 'bridgers2' &&
              info.dex === 'Aggregator'
            "
          >
            <div class="left">{{ $t("relayerGasfee") }}</div>
            <div class="right" v-if="info">
              {{ sendGas[0] + " " + sendGas[1] }}
            </div>
          </div>
          <div class="received">
            <div class="left">{{ $t("expected") }}</div>
            <div class="right" v-if="info">
              <template>
                {{ toNumber }}
              </template>
              {{ toToken.coinCodeShow }}
            </div>
          </div>
          <div
            class="rate"
            v-if="
              info &&
              (info.dex === 'bridgers1' ||
                info.dex === 'bridgers2' ||
                info.dex === 'Aggregator')
            "
          >
            <div class="left">
              <span class="title"> {{ $t("estimatedTime") }}</span>
            </div>
            <div class="right" v-if="info">
              <span>
                {{
                  info.estimatedTime == 1
                    ? $t("estimatedTime1")
                    : info.estimatedTime == 2
                    ? $t("estimatedTime2")
                    : $t("estimatedTime3")
                }}
              </span>
            </div>
          </div>
          <div class="buttonDiv">
            <Button
              class="themeBg"
              @click="exchange"
              :loading="submitStatus"
              :loading-text="$t('confirm')"
              >{{ $t("confirm") }}</Button
            >
          </div>
        </div>
        <div class="closeIcon">
          <img @click="closeOrderDialog" src="../assets/img/close.png" alt="" />
        </div>
      </div>
    </Dialog>
    <xummDialog ref="qrcode" />
    <Approve ref="approve" @approve="approve" />
  </div>
</template>
<script>
const Dialog = () => import("./common/dialog");

const Approve = () => import("./Approve");

import baseApi from "../api/baseApi";
import { ethers } from "ethers";
import erc20Abi from "../config/abis/erc20";

import { Button } from "vant";
import { Toast, Popover, Notify } from "vant";
import errorCode from "../utils/language.js";

let provider, signer;
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  signer = provider.getSigner();
}
import BigNumber from "bignumber.js";
import ETH_erc20 from "../utils/eth-erc20";
// path 发币逻辑代码封装
import pathBridgeMethods from "../utils/pathBridgeMethods";

import getContract from "../utils/contract";
import xummDialog from "./common/XUMMDialog.vue";
import eosMethods from "../utils/eosMethods";
import { supportNetWork } from "../config/index";
import axios from "axios";
import failureExchange from "../utils/failureExchange";
import { MsafeWallet } from "msafe-wallet";
import tronAbi from "../utils/tronAbi";
import suiWalletMethods from "../utils/suiWalletConnect";
import suiOKXWalletMethods from "../utils/suiOKXWalletConnect";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { getSigningClient, COMPASS_WALLET } from "@sei-js/core";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import joyIdMethids from "../utils/joyID/swapMethods";
import PortkeyMethods from "@/utils/PortkeyMethods";
let webSocket;
let WalletConnectProvider = null;
export default {
  name: "Header",
  components: {
    Dialog,
    Button,
    Popover,
    Approve,
    xummDialog,
  },
  props: {
    sendGas: { type: Array, default: null },
  },
  data() {
    return {
      submitStatus: false,
      showPopover: false,
      tipTimer: null,
      sourceFlag: localStorage.getItem("sourceFlag"),
      txData: null, //兑换数据
      pathBridgeExchangeStatus: false, 
      transactionReceiptTimer: null, 
      twFlag: localStorage.getItem("twFlag"),
      utmSource: localStorage.getItem("utm_source"),
      interceptData: null,
    };
  },
  created() {
  },
  computed: {
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
    inscriptionId() {
      return this.$store.state.inscriptionId;
    },
    isFreeGas() {
      return this.$store.state.isFreeGas;
    },
    info() {
      return this.$store.state.info;
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
    fromNumber() {
      return this.$store.state.fromNumber;
    },
    toNumber() {
      return this.$store.state.toNumber - 0;
    },
    connectType() {
      return this.$store.state.wallet.connectType;
    },
    spaceIdDomain() {
      return this.$store.state.spaceIdDomain;
    },
    FIODomain() {
      return this.$store.state.FIODomain;
    },
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
    minusHandle(num1, num2) {
      return new BigNumber(num1)
        .minus(new BigNumber(num2))
        .toFixed(6, BigNumber.ROUND_DOWN);
    },
    cutAddress(type) {
      let adr = this.$store.state.wallet.address;
      if (type === "from") {
        if (
          this.fromToken.mainNetwork === "DOT" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58;
        } else if (
          this.fromToken.mainNetwork === "CRU" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58CRU;
        } else if (
          this.fromToken.mainNetwork === "DBC" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58DBC;
        } else if (
          this.fromToken.mainNetwork === "TRX" &&
          this.$store.state.walletTRON !== null
        ) {
          adr = this.$store.state.walletTRON;
        }
      }
      if (type === "to") {
        adr = this.$store.state.address;
      }
      const beforeAdr = adr.substring(0, 10);
      const afterAdr = adr.substring(adr.length - 10, adr.length);
      if (adr.length > 21) {
        return beforeAdr + "....." + afterAdr;
      } else {
        return adr;
      }
    },
    addrCopy(type) {
      let adr = this.$store.state.wallet.address;
      if (type === "from") {
        if (
          this.fromToken.mainNetwork === "DOT" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58;
        } else if (
          this.fromToken.mainNetwork === "CRU" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58CRU;
        } else if (
          this.fromToken.mainNetwork === "DBC" &&
          this.$store.state.walletPolkadot !== null
        ) {
          adr = this.$store.state.walletPolkadot.addrSS58DBC;
        } else if (
          this.fromToken.mainNetwork === "TRX" &&
          this.$store.state.walletTRON !== null
        ) {
          adr = this.$store.state.walletTRON;
        }
      }

      return adr;
    },
    onCopySuccess(val) {
      Toast.success(this.$t("copy_success"));
    },
    onCopyError(val) {},
    show() {
      this.$refs.dialogConfirm.show = true;
    },
    // 计算手续费率
    getFeeRate(val) {
      return new BigNumber(val).multipliedBy(100);
    },
    async exchange() {
      this.submitStatus = true;
      if (this.info.dex !== "OmniBridge") {
        this.submitStatus = true;
        pathBridgeMethods.pathBridgeExchange(this);
        return;
      }
      let params = {
        depositCoinCode: this.fromToken.coinCode, //存币币种
        receiveCoinCode: this.toToken.coinCode, //接收币币种
        depositCoinAmt: this.$store.state.fromNumber, //存币数量
        receiveCoinAmt: this.$store.state.toNumber, //接受币数量
        destinationAddr: this.$store.state.address, //收币地址
        refundAddr: this.$store.state.wallet.address, //退币地址
        isNoGas: this.isFreeGas,
        utmSource: this.utmSource,
      };
      //DOT链
      if (
        (this.fromToken.coinCode == "DOT" ||
          this.fromToken.coinCode == "USDT(DOT)") &&
        this.fromToken.mainNetwork == "DOT"
      ) {
        params.refundAddr = this.$store.state.walletPolkadot.addrSS58;
      }
      if (
        this.fromToken.coinCode == "CRU" &&
        this.fromToken.mainNetwork == "CRU"
      ) {
        params.refundAddr = this.$store.state.walletPolkadot.addrSS58CRU;
      }
      if (
        this.fromToken.coinCode == "DBC" &&
        this.fromToken.mainNetwork == "DBC"
      ) {
        params.refundAddr = this.$store.state.walletPolkadot.addrSS58DBC;
      }
      if (this.fromToken.mainNetwork === "TRX") {
        params.refundAddr = this.$store.state.walletTRON;
      }
      this.submitStatus = true;
      baseApi
        .accountExchange(params)
        .then(async (res) => {
          if (res.resCode == "800") {
            let platformAddr = res.data.platformAddr; //系统收币地址
            if (this.fromToken.mainNetwork === "XDC") {
              //xdc 替换复用地址前缀
              platformAddr = platformAddr.replace(/xdc/, "0x");
            }
            const fromNumber = this.$store.state.fromNumber.toString(); //换币数量
            const isWalletConnect = this.$store.state.isWalletConnect;

            // 判断无gas 兑换服务
            if (this.info.dex == "OmniBridge" && this.isFreeGas) {
              let mainNetwork = null;
              if (this.connectType === "OKExWallet") {
                mainNetwork = okexchain;
              } else if (this.connectType === "OpenBlock") {
                mainNetwork = window.openblock;
              } else if (this.connectType === "Nabox") {
                mainNetwork = NaboxWallet;
              } else if (this.connectType === "ONTO") {
                mainNetwork = window.onto;
              } else if (this.connectType === "oneKey") {
                mainNetwork = window.$onekey.ethereum;
              } else if (this.connectType === "Halo") {
                mainNetwork = window.kucoin;
              } else if (this.connectType === "CLVWallet") {
                mainNetwork = window.clover;
              } else if (this.connectType === "Crypto") {
                mainNetwork = window.deficonnectProvider;
              } else if (this.connectType === "Patex") {
                mainNetwork = window.patex.ethereum;
              } else if (this.connectType === "Bitget") {
                mainNetwork = window.bitkeep.ethereum;
              } else if (this.connectType === "FoxWallet") {
                mainNetwork = window.foxwallet.ethereum;
              } else if (this.connectType === "EchoooWallet") {
                mainNetwork = window.echoooEth;
              } else {
                if (
                  this.connectType === "walletConnect" ||
                  (this.connectType == "imToken" && this.isPC)
                ) {
                  WalletConnectProvider = await EthereumProvider.init(
                    this.connectType == "imToken"
                      ? this.$store.getters.EthereumProviderInitImtoken
                      : this.$store.getters.EthereumProviderInit
                  );
                } else {
                  if (window.ethereum) {
                    mainNetwork = window.ethereum;
                  }
                }
              }
              const getNoGasTransData =
                require("../utils/getNoGasTransData").default;
              // 要签名的参数
              const noGasTxInfo = JSON.parse(res.data.noGasTxInfo);
              const fromAddress = res.data.refundAddr;
              const result = await getNoGasTransData(
                this,
                noGasTxInfo,
                fromAddress,
                mainNetwork,
                this.fromToken.mainNetwork
              );
              if (result) {
                let parame = {};
                if (this.fromToken.mainNetwork == "TRX") {
                  parame = {
                    orderId: res.data.orderId,
                    rawTransaction: JSON.stringify(result),
                  };
                } else {
                  parame = {
                    orderId: res.data.orderId,
                    r: result.r,
                    s: result.s,
                    v: result.v,
                    rawTransaction: result.rawTransaction,
                  };
                }
                const hashRes = await baseApi.noGasSwap(parame);
                if (hashRes.resCode == "800") {
                  this.submitStatus = false;
                  this.$refs.dialogConfirm.show = false;
                  this.closeOrderDialog();
                  this.modifyTxId(
                    {
                      from: fromAddress,
                      hash: hashRes.data.transactionHash,
                    },
                    res.data.orderId,
                    res
                  );
                } else {
                  if (res.resCode == "50016") {
                    const resMsg = res.resMsg;
                    const indexStr = resMsg.indexOf("[");
                    const resMsg1 = resMsg.slice(
                      indexStr + 1,
                      resMsg.length - 1
                    );
                    const arr = resMsg1.split(",");
                    Notify({
                      message: this.$t(res.resCode, {
                        min: arr[0],
                        max: arr[1],
                      }),
                      color: "#ad0000",
                      background: "#ffe1e1",
                    });
                  } else {
                    errorCode(hashRes.resCode, this);
                  }
                }
              }
              return;
            }
            // suiwallet 兑换
            if (
              this.connectType === "SuiWallet" ||
              this.connectType === "OKExWalletSui"
            ) {
              return this.SuiWalletExchange(
                platformAddr,
                fromNumber,
                res,
                this.connectType
              );
            }
            //WalletConnect兑换
            if (
              isWalletConnect ||
              (this.connectType == "imToken" && this.isPC)
            ) {
              WalletConnectProvider = await EthereumProvider.init(
                this.connectType == "imToken"
                  ? this.$store.getters.EthereumProviderInitImtoken
                  : this.$store.getters.EthereumProviderInit
              );

              return this.walletConnectExchange(platformAddr, fromNumber, res);
            }
            //nabox 兑换
            if (this.connectType === "Nabox") {
              this.naboxExchange(platformAddr, fromNumber, res);
              return;
            }
            //nabox 兑换
            if (this.connectType === "Crypto") {
              this.cryptoExchange(platformAddr, fromNumber, res);
              return;
            }
            if (this.connectType === "Patex") {
              this.patexExchange(platformAddr, fromNumber, res);
              return;
            }
            if (this.connectType === "Bitget") {
              if (
                this.fromToken.mainNetwork == "TRX" &&
                window.tronWeb &&
                !this.isPC
              ) {
                this.TronLinkExchange(platformAddr, fromNumber, res);
                return;
              }
              this.bitkeepExchange(platformAddr, fromNumber, res);
              return;
            }
            //OKExWallet 兑换
            if (this.connectType === "OKExWallet") {
              this.OKExWalletExchange(platformAddr, fromNumber, res);
              return;
            }
            //OpenBlock 兑换
            if (this.connectType === "OpenBlock") {
              this.OpenBlockExchange(platformAddr, fromNumber, res);
              return;
            }
            //EchoooWallet 兑换
            if (this.connectType === "EchoooWallet") {
              this.EchoooWalletExchange(platformAddr, fromNumber, res);
              return;
            }
            //JoyIDWallet 兑换
            if (this.connectType === "JoyIDWallet") {
              this.JoyIDExchange(platformAddr, fromNumber, res);
              return;
            }
            //ONTOWallet 兑换
            if (this.connectType === "ONTO") {
              this.ONTOExchange(platformAddr, fromNumber, res);
              return;
            }
            //oneKey 兑换
            if (this.connectType === "oneKey") {
              this.oneKeyExchange(platformAddr, fromNumber, res);
              return;
            }
            //CLV 兑换
            if (this.connectType === "CLVWallet" && this.isPC) {
              this.CLVWalletExchange(platformAddr, fromNumber, res);
              return;
            }
            //metamask 兑换
            if (
              this.connectType === "MetaMask" ||
              this.connectType === "Halo" ||
              this.connectType === "coin98" ||
              this.connectType === "FoxWallet" ||
              (this.connectType === "CLVWallet" && !this.isPC)
            ) {
              this.metaMaskExchange(platformAddr, fromNumber, res);
              return;
            }
            //TronLink 兑换
            if (
              this.connectType === "TronLink" ||
              (this.connectType == "imToken" && window.tronWeb) ||
              (this.connectType == "TokenPocket" &&
                window.tronWeb &&
                !this.isPC) ||
              (this.connectType == "BitpieWallet" &&
                window.tronWeb &&
                !this.isPC) ||
              (this.connectType == "Bitget" && window.tronWeb && !this.isPC)
            ) {
              this.TronLinkExchange(platformAddr, fromNumber, res);
              return;
            }
            //Polkadot 兑换
            if (this.connectType === "Polkadot") {
              if (this.fromToken.coinCode == "DOT") {
                if (
                  this.$store.state.balance - this.$store.state.fromNumber >
                  1
                ) {
                  this.polksdotExchange(res);
                } else {
                  const conf = window.confirm(this.$t("dotTip"));
                  if (conf) {
                    this.polksdotExchange(res);
                  } else {
                    this.submitStatus = false;
                  }
                }
              } else {
                this.polksdotExchange(res);
              }
              return;
            }
            //Phantom 兑换
            if (this.connectType === "Phantom") {
              this.phantomExchange(platformAddr, fromNumber, res);
            }
            //Terra Station 兑换
            if (this.connectType === "TerraStation") {
              this.TerraStationExchange(platformAddr, fromNumber, res);
            }
            // BTC 兑换
            if (this.connectType === "LiqualityWallet") {
              this.LiqualityWalletExchange(platformAddr, fromNumber, res);
            }
            if (this.connectType === "Unisat") {
              this.UnisatExchange(platformAddr, fromNumber, res);
            }
            // BTC TP钱包兑换
            if (this.connectType === "TokenPocketBTC") {
              this.TokenPocketBTCExchange(platformAddr, fromNumber, res);
            }
            // DOGE TP钱包兑换
            if (this.connectType === "TokenPocketDoge") {
              this.TokenPocketDOGEExchange(platformAddr, fromNumber, res);
            }
            // xrp链兑换
            if (this.connectType === "XUMM") {
              this.XRPXUMMExchange(res);
            }
            //EOS 兑换
            if (this.connectType === "LeafWallet") {
              this.EOSExchangeHandle(res, fromNumber);
            }
            //APT 兑换
            if (this.connectType === "Petra") {
              this.APTExchangeHandle(platformAddr, res, fromNumber);
            }
            //MSafe 兑换
            if (this.connectType === "MSafe") {
              this.MSafeExchangeHandle(platformAddr, res, fromNumber);
            }
            //FIL MathWallet 兑换

            if (
              this.connectType === "MathWalletFIL" &&
              this.fromToken.coinCode == "FIL"
            ) {
              this.FILExchangeHandle(platformAddr, fromNumber, res);
            }
            //SEI兑换
            if (
              this.connectType === "Compass" &&
              this.fromToken.coinCode == "SEI"
            ) {
              this.SEIExchangeHandle(platformAddr, fromNumber, res);
            }
            //HVH兑换
            if (
              this.connectType === "HAVAH" &&
              this.fromToken.coinCode == "HVH(HVH)"
            ) {
              this.HAVAHExchangeHandle(platformAddr, fromNumber, res);
            }
            // PortKey 兑换
            if (
              this.connectType === "Portkey"
            ) {
              this.PortkeyExchange(platformAddr, fromNumber, res);
            }
          } else {
            this.submitStatus = false;
            if (res.resCode == "50016") {
              const resMsg = res.resMsg;
              const indexStr = resMsg.indexOf("[");
              const resMsg1 = resMsg.slice(indexStr + 1, resMsg.length - 1);
              const arr = resMsg1.split(",");
              Notify({
                message: this.$t(res.resCode, { min: arr[0], max: arr[1] }),
                color: "#ad0000",
                background: "#ffe1e1",
              });
            } else {
              errorCode(res.resCode, this);
            }

            failureExchange({
              orderId: "",
              fromAmount: this.$store.state.fromNumber,
              fromCoinCode: this.fromToken.coinCode,
              toAmount: this.$store.state.toNumber,
              toCoinCode: this.toToken.coinCode,
              hash: "",
              fromAddress: this.$store.state.wallet.address,
              fromTokenAddress: this.fromToken.contact,
              toTokenAddress: this.toToken.contact,
              fromChain: this.fromToken.mainNetwork,
              toChain: this.toToken.mainNetwork,
              failedReason: this.$t(res.resCode),
              platform: location.host,
              currentNode: this.$store.state.rpcObject[
                this.fromToken.mainNetwork
              ]
                ? this.$store.state.rpcObject[this.fromToken.mainNetwork][0]
                : "",
            });
          }
        })
        .catch((error) => {
          this.submitStatus = false;
        });
    },
    closeWebSocket() {
      if (webSocket) {
        webSocket.close();
      }
    },
    async PortkeyExchange(platformAddr, fromNumber, res){
      const fromToken = this.fromToken;
      const result = await PortkeyMethods.sendELFToken(platformAddr, fromNumber, fromToken)
      if(result){
        const data = {
          from: this.$store.state.wallet.address,
          hash: result.transactionId,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(data, res.data.orderId, res);
      }else{
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    async EOSExchangeHandle(res, fromNumber) {
      const fromToken = this.fromToken;
      const result = await eosMethods.EOSExchange(
        res,
        this,
        fromNumber,
        fromToken
      );
      if (!result.transaction_id) {
        //报错
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        if (result.code == 402) {
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        } else if (result.code == 500) {
          if (result.error.code == 3080004) {
            Notify({
              message: this.$t("EOSCPU"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          }
          if (result.error.code == 3040005) {
            Notify({
              message: this.$t("EOSexpired"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          }
        } else {
          Notify({
            message: result.message,
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
        return;
      } else {
        const data = {
          from: this.$store.state.wallet.address,
          hash: result.transaction_id,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(data, res.data.orderId, res);
      }
    },

    // APT链发币
    async APTExchangeHandle(platformAddr, res, fromNumber) {
      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [
          platformAddr,
          BigNumber(fromNumber)
            .times(10 ** 8)
            .toString(),
        ],
      };
      try {
        const transactionRes = await window.aptos.signAndSubmitTransaction(
          payload
        );
        const data = {
          from: this.$store.state.wallet.address,
          hash: transactionRes.hash,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(data, res.data.orderId, res);
      } catch (error) {
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    // MSafe链发币
    async MSafeExchangeHandle(platformAddr, res, fromNumber) {
      let msafe = null;
      if (window.msafe) {
        msafe = window.msafe;
      } else {
        msafe = await MsafeWallet.new("https://app.m-safe.io");
      }
      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [
          platformAddr,
          BigNumber(fromNumber)
            .times(10 ** 8)
            .toString(),
        ],
      };
      const option = {
        sender: this.$store.state.wallet.address,
        sequence_number: "1",
        max_gas_amount: "4000",
        gas_unit_price: "100",
        expiration_timestamp_secs: (
          Math.floor(Date.now() / 1000) +
          30 * 24 * 3600
        ).toString(),
      };
      try {
        await msafe.signAndSubmit(payload, option);
      } catch (error) {
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    //xrp链发币
    XRPXUMMExchange(res) {
      if (res.data.xrpInfo) {
        const info = JSON.parse(res.data.xrpInfo);
        const _this = this;
        this.$store.commit("setQRcode", info.refs.qr_png);
        // Create WebSocket connection.
        webSocket = new WebSocket(info.refs.websocket_status);

        // Connection opened
        webSocket.addEventListener("open", function (event) {});

        // Listen for messages
        webSocket.addEventListener("message", function (event) {
          const data = JSON.parse(event.data);
          if (data.signed) {
            let uuid = data.payload_uuidv4;

            baseApi
              .getXUMMWalletInfo(uuid)
              .then((resInfo) => {
                if (resInfo.resCode === "800") {
                  webSocket.close();
                  const params = {
                    from: _this.$store.state.wallet.address,
                    hash: resInfo.data.info.response.txid,
                  };
                  _this.submitStatus = false;
                  _this.$refs.dialogConfirm.show = false;
                  _this.$refs.qrcode.dismiss();

                  _this.modifyTxId(params, res.data.orderId, res);
                } else {
                  _this.submitStatus = false;
                  _this.$refs.dialogConfirm.show = false;
                  _this.$refs.qrcode.dismiss();
                  errorCode(resInfo.resCode, _this);
                }
              })
              .catch((err) => {
                _this.submitStatus = false;
                _this.$refs.dialogConfirm.show = false;
                _this.closeOrderDialog();
                Notify({
                  message: _this.$t("rejectExchange"),
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              });
          }
        });

        //this.$refs.dialogConfirm.show = false
        this.$refs.qrcode.show();
      }
    },
    TokenPocketBTCExchange(platformAddr, fromNumber, res) {
      let tp = require("tp-js-sdk");
      tp.btcTokenTransfer({
        from: this.$store.state.wallet.address,
        to: platformAddr,
        amount: fromNumber,
      }).then((data) => {
        if (data.result) {
          //发币
          const params = {
            from: this.$store.state.wallet.address,
            hash: data.data || data.msg,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        } else {
          // 取消
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
      });
    },
    //LiqualityWalletExchange 发币
    async LiqualityWalletExchange(platformAddr, fromNumber, res) {
      await window.bitcoin.enable();
      window.bitcoin
        .request({
          method: "wallet_sendTransaction",
          params: [
            {
              to: platformAddr,
              value: fromNumber * 10 ** 8,
            },
          ],
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data.hash,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((err) => {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //Unisat 发币
    async UnisatExchange(platformAddr, fromNumber, res) {
      if (this.fromToken.mainNetwork == "BRC20") {
        console.log(this.fromToken, platformAddr, fromNumber, res);
        try {
          const txid = await unisat.sendInscription(
            platformAddr,
            this.inscriptionId,
            {
              feeRate: 40,
            }
          );
          const params = {
            from: this.$store.state.wallet.address,
            hash: txid,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        } catch (error) {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
        return;
      }
      await window.unisat
        .sendBitcoin(platformAddr, fromNumber * 10 ** 8)
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((err) => {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    async walletConnectExchange(platformAddr, fromNumber, res) {
      //walletConnect 兑换
      let tx = {};
      if (res.data.txData) {
        tx = {
          to: platformAddr, // Required except during contract publications.
          from: this.$store.state.wallet.address, // must match user's active address.
          data: res.data.txData.data,
          value: res.data.txData.value,
        };
      } else {
        tx = {
          to: platformAddr, // Required except during contract publications.
          from: this.$store.state.wallet.address, // must match user's active address.
          value: `0x${new BigNumber(fromNumber)
            .multipliedBy(new BigNumber(10 ** 18))
            .toString(16)}`,
        };
      }
      WalletConnectProvider.request({
        method: "eth_sendTransaction",
        params: [tx],
      })
        .then((data) => {
          // Returns transaction id (hash)
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //SuiWallet 发币
    async SuiWalletExchange(platformAddr, fromNumber, res, connectType) {
      let hash;
      if (connectType == "OKExWalletSui") {
        hash = await suiOKXWalletMethods.transfer(
          platformAddr,
          fromNumber,
          this.fromToken
        );
      } else {
        hash = await suiWalletMethods.transfer(
          platformAddr,
          fromNumber,
          this.fromToken
        );
      }
      if (hash) {
        const params = {
          from: this.$store.state.wallet.address,
          hash: hash,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(params, res.data.orderId, res);
      } else {
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    //nabox发币
    async naboxExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
            // gasPrice: "0x02540be400", // Optional
            // gas: "0x9c40", // Optional
          },
        ];
      }
      NaboxWallet.request({
        method: "eth_sendTransaction",
        params,
      })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //EchoooWalletExchange 发币
    async EchoooWalletExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
          },
        ];
      }
      window.echoooEth
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //JoyIDExchange 发币
    async JoyIDExchange(platformAddr, fromNumber, res) {
      let params = null;
      const fromToken = this.fromToken;
      if (fromToken.contact === "") {
        //主币
        params = {
          to: platformAddr,
          from: this.$store.state.wallet.address,
          value: `0x${new BigNumber(fromNumber)
            .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
            .toString(16)}`,
        };
      } else {
        // 代币
        params = {
          to: fromToken.contact,
          from: this.$store.state.wallet.address,
          value: "0",
          data: joyIdMethids.buildERC20Data(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          ),
        };
      }
      const result = await joyIdMethids.send(params);
      if (result) {
        const Obj = {
          from: this.$store.state.wallet.address,
          hash: result.hash,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(Obj, res.data.orderId, res);
      } else {
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    //ONTO发币
    async ONTOExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
            // gasPrice: "0x02540be400", // Optional
            // gas: "0x9c40", // Optional
          },
        ];
      }
      onto
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //oneKey 发币
    async oneKeyExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
          },
        ];
      }
      window.$onekey.ethereum
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //OKExWallet发币
    async OKExWalletExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
            // gasPrice: "0x02540be400", // Optional
            // gas: "0x9c40", // Optional
            //value: `0x`, // Optional
          },
        ];
      }
      okexchain
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //OpenBlock发币
    async OpenBlockExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
          },
        ];
      }
      window.openblock
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //CLV 发币
    async CLVWalletExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
            // gasPrice: "0x02540be400", // Optional
            // gas: "0x9c40", // Optional
            //value: `0x`, // Optional
          },
        ];
      }
      window.clover
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //crypto 发币
    async cryptoExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      let params = null;
      if (fromToken.contact === "") {
        params = [
          {
            from: this.$store.state.wallet.address,
            to: platformAddr,
            //gas: '0x76c0', // 30400
            //gasPrice: '0x9184e72a000', // 10000000000000
            value: `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`, // 2441406250
          },
        ];
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = [
          {
            from: this.$store.state.wallet.address, // Required
            to: fromToken.contact, // Required (for non contract deployments)
            data: data, // Required
            // gasPrice: "0x02540be400", // Optional
            // gas: "0x9c40", // Optional
            //value: `0x`, // Optional
          },
        ];
      }
      window.deficonnectProvider
        .request({
          method: "eth_sendTransaction",
          params,
        })
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },

    //bitkeepExchange 发币
    async bitkeepExchange(platformAddr, fromNumber, res) {
      provider = new ethers.providers.Web3Provider(
        window.bitkeep.ethereum,
        "any"
      );
      signer = provider.getSigner();
      const fromToken = this.fromToken;

      let params = null;
      if (fromToken.contact === "") {
        params = {
          // from: this.$store.state.wallet.address,
          to: platformAddr,
          value: ethers.utils.parseEther(fromNumber),
          //gas: '0x76c0', // 30400
          //gasPrice: '0x9184e72a000', // 10000000000000
          // value: `0x${new BigNumber(fromNumber)
          //     .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
          //     .toString(16)}`, // 2441406250
        };
      } else {
        const module = await import("web3");
        const Web3 = module.default;
        const web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = {
          from: this.$store.state.wallet.address, // Required
          to: fromToken.contact, // Required (for non contract deployments)
          data: data, // Required
        };
      }
      signer
        .sendTransaction(params)
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data.hash,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    //metaMask发币
    async metaMaskExchange(platformAddr, fromNumber, res) {
      const fromToken = this.fromToken;
      const ContractAddress = this.fromToken.contact; //换币地址 From
      if (
        fromToken.contact === "" ||
        (fromToken.contact === "0x26d5ca2dE2005F42A8B0C785c723E3e286b77cDF" &&
          fromToken.mainNetwork == "AME") ||
        (fromToken.contact === "0xc333b0fe43e642b770c54438a967a5f9e084edee" &&
          fromToken.mainNetwork == "KCC")
      ) {
        const tx = signer
          .sendTransaction({
            to: platformAddr,
            value: ethers.utils.parseEther(fromNumber),
          })
          .then((data) => {
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            this.modifyTxId(data, res.data.orderId, res);
          })
          .catch((error) => {
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            const utm_source = localStorage.getItem("utm_source");
            if (utm_source == "tokenpocket") {
              //tp 钱包报错回调
              if (error.message == "cancel") {
                Notify({
                  message: this.$t("rejectExchange"),
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              } else {
                Notify({
                  message: error.message,
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              }
              return;
            }
            Notify({
              message: this.$t("rejectExchange"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          });
      } else {
        const tokenContract = new ethers.Contract(
          ContractAddress,
          erc20Abi,
          provider
        );
        const tokenWithSigner = tokenContract.connect(signer);
        const token = ethers.utils.parseUnits(
          fromNumber,
          this.fromToken.coinDecimal
        );
        const module = await import("web3");
        const Web3 = module.default;
        let estimate = null;
        let params = {};
        try {
          estimate = await provider.estimateGas({
            to: platformAddr,
            value: ethers.utils.parseEther(fromNumber),
          });
          params = {
            gasLimit: Web3.utils.toHex(estimate * 5),
          };
        } catch (error) {}
        const tx = tokenWithSigner
          .transfer(platformAddr, token, params)
          .then((data) => {
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            this.modifyTxId(data, res.data.orderId, res);
          })
          .catch((error) => {
            if (error.code != 4001) {
              failureExchange({
                orderId: res.data.orderId,
                fromAmount: this.$store.state.fromNumber,
                fromCoinCode: this.fromToken.coinCode,
                toAmount: this.$store.state.toNumber,
                toCoinCode: this.toToken.coinCode,
                hash: "",
                fromAddress: this.$store.state.wallet.address,
                fromTokenAddress: this.fromToken.contact,
                toTokenAddress: this.toToken.contact,
                fromChain: this.fromToken.mainNetwork,
                toChain: this.toToken.mainNetwork,
                failedReason: [
                  error.message,
                  error.data ? error.data.message : "",
                ].join(","),
                platform: location.host,
                currentNode: this.$store.state.rpcObject[
                  this.fromToken.mainNetwork
                ]
                  ? this.$store.state.rpcObject[this.fromToken.mainNetwork][0]
                  : "",
              });
            }

            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            const utm_source = localStorage.getItem("utm_source");
            if (utm_source == "tokenpocket") {
              //tp 钱包报错回调
              if (error.message == "cancel") {
                Notify({
                  message: this.$t("rejectExchange"),
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              } else {
                Notify({
                  message: error.message,
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              }
              return;
            }
            Notify({
              message: this.$t("rejectExchange"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          });
      }
    },
    //TronLink 兑换
    async TronLinkExchange(platformAddr, fromNumber, res) {
      this.$refs.dialogConfirm.show = false;
      this.closeOrderDialog();
      this.submitStatus = false;
      const code = this.fromToken;
      const ContractAddress = this.fromToken.contact; //换币地址 From
      if (!window.tronWeb) {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("noWallet"),
        });
        return;
      }
      let tronWeb = window.tronWeb;
      if (code.coinCode === "TRX") {
        var txData = await tronWeb.transactionBuilder.sendTrx(
          platformAddr,
          this.$store.state.fromNumber * Math.pow(10, 6),
          this.$store.state.walletTRON
        );
        var signedTx = await tronWeb.trx.sign(txData);
        tronWeb.trx
          .sendRawTransaction(signedTx)
          .then((broastTx) => {
            this.modifyTRXTxId(broastTx.txid, res.data.orderId, res);
          })
          .catch((error) => {
            const utm_source = localStorage.getItem("utm_source");
            if (utm_source == "tokenpocket") {
              //tp 钱包报错回调
              if (error.message == "cancel") {
                Notify({
                  message: this.$t("rejectExchange"),
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              } else {
                Notify({
                  message: error.message,
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
              }
              return;
            }
            Notify({
              message: this.$t("rejectExchange"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          });
      } else {
        if (ContractAddress.length < 10) {
          //trc10转账
          const txData = await tronWeb.transactionBuilder.sendToken(
            platformAddr,
            this.toNonExponential(
              this.$store.state.fromNumber *
                Math.pow(10, this.fromToken.coinDecimal)
            ),
            ContractAddress,
            this.$store.state.walletTRON
          );
          var signedTx = await tronWeb.trx.sign(txData);
          tronWeb.trx
            .sendRawTransaction(signedTx)
            .then((broastTx) => {
              this.modifyTRXTxId(broastTx.txid, res.data.orderId, res);
            })
            .catch((error) => {
              const utm_source = localStorage.getItem("utm_source");
              if (utm_source == "tokenpocket") {
                //tp 钱包报错回调
                if (error.message == "cancel") {
                  Notify({
                    message: this.$t("rejectExchange"),
                    color: "#ad0000",
                    background: "#ffe1e1",
                  });
                } else {
                  Notify({
                    message: error.message,
                    color: "#ad0000",
                    background: "#ffe1e1",
                  });
                }
                return;
              }
              Notify({
                message: this.$t("rejectExchange"),
                color: "#ad0000",
                background: "#ffe1e1",
              });
            });
        } else {
          //trc20转账
          let contract;
          if (this.fromToken.contact == "TMz2SWatiAtZVVcH2ebpsbVtYwUPT9EdjH") {
            contract = await tronWeb.contract(tronAbi, this.fromToken.contact);
          } else {
            contract = await tronWeb.contract().at(this.fromToken.contact);
          }
          let value = new BigNumber(this.$store.state.fromNumber).multipliedBy(
            BigNumber(10).pow(this.fromToken.coinDecimal)
          );
          contract
            .transfer(platformAddr, this.toNonExponential(value))
            .send()
            .then((txid) => {
              this.modifyTRXTxId(txid, res.data.orderId, res);
            })
            .catch((error) => {
              Notify({
                message: this.$t("rejectExchange"),
                color: "#ad0000",
                background: "#ffe1e1",
              });
            });
        }
      }
    },
    //PolkadotExchange 兑换
    async polksdotExchange(res) {
      const { ApiPromise, WsProvider, Uint8Array } = await import(
        "@polkadot/api"
      );
      const { typesBundleForPolkadot } = await import(
        "@crustio/type-definitions"
      );
      const { web3FromAddress, web3FromSource } = await import(
        "@polkadot/extension-dapp"
      );
      let wsProvider = null;
      let api = null;
      let DOTandCRUDecimal = 10000000000;
      const account = this.$store.state.walletPolkadot;
      let netAccount = account.addrSS58;
      let transferFee = 10000000000;
      let num = Number(this.$store.state.fromNumber) * DOTandCRUDecimal;
      if (this.fromToken.mainNetwork === "CRU") {
        wsProvider = new WsProvider("wss://rpc.crust.network");
        api = await ApiPromise.create({
          provider: wsProvider,
          typesBundle: typesBundleForPolkadot,
        });
        DOTandCRUDecimal = 1000000000000;
        netAccount = account.addrSS58CRU;
        num = Number(this.$store.state.fromNumber) * DOTandCRUDecimal;
        transferFee = 30000000;
      } else if (this.fromToken.mainNetwork === "DBC") {
        wsProvider = new WsProvider("wss://info.dbcwallet.io");
        api = await ApiPromise.create({
          provider: wsProvider,
        });
        DOTandCRUDecimal = 1000000000000000;
        const numm = Number(this.$store.state.fromNumber) * DOTandCRUDecimal;
        num = numm.toString();
        netAccount = account.addrSS58DBC;
        transferFee = 2000000000000;
      } else {
        wsProvider = new WsProvider("wss://rpc.polkadot.io");
        api = await ApiPromise.create({ provider: wsProvider });
        transferFee = 200000000;
      }

      const injector = await web3FromSource(account.source);
      if (
        this.fromToken.mainNetwork === "DOT" &&
        this.fromToken.contact == "1984"
      ) {
        num = Number(this.$store.state.fromNumber) * 1000000;
        const { ApiPromise, WsProvider } = require("@polkadot/api");
        const provider = new WsProvider(
          "wss://polkadot-asset-hub-rpc.polkadot.io"
        ); // 'wss://statemint.api.onfinality.io/public-ws'
        const api = await ApiPromise.create({ provider });
        const recipient = res.data.platformAddr; // Replace with the recipient's address
        const amount = num; // Amount of USDT to transfer (in smallest unit)
        api.tx.assets
          .transfer(this.fromToken.contact, recipient, amount)
          .signAndSend(netAccount, {
            signer: injector.signer,
            fee: transferFee,
          })
          .then((hash) => {
            console.log("Transfer sent with hash", hash.toHex());
            const dataHash = {
              from: netAccount,
              hash: hash.toHex(),
            };
            this.modifyTxId(dataHash, res.data.orderId, res);
            Notify({ type: "success", message: "Success" });
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
          })
          .catch((e) => {
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            if (e.message === "Cancelled") {
              Notify({
                color: "#ad0000",
                background: "#ffe1e1",
                message: this.$t("rejectExchange"),
              });
            } else {
            }
          });
      } else {
        api.tx.balances
          .transfer(res.data.platformAddr, num)
          .signAndSend(
            netAccount,
            { signer: injector.signer, fee: transferFee },
            (result, t) => {
              if (result.status.isFinalized || result.status.isInBlock) {
                // unsubscribe()
                const dataHash = {
                  from: netAccount,
                  hash: result.status.asInBlock.toString(),
                };

                result.events
                  .filter(({ event: { section } }) => section === "system")
                  .forEach(({ event: { data, method } }) => {
                    if (method === "ExtrinsicSuccess") {
                      this.modifyTxId(dataHash, res.data.orderId, res);
                      Notify({ type: "success", message: "Success" });
                    }
                    this.submitStatus = false;
                    this.$refs.dialogConfirm.show = false;
                    this.closeOrderDialog();
                  });
              }
            }
          )
          .catch((e) => {
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            if (e.message === "Cancelled") {
              Notify({
                color: "#ad0000",
                background: "#ffe1e1",
                message: this.$t("rejectExchange"),
              });
            } else {
            }
          });
      }
    },
    //phantomExchange 兑换
    async createTransferTransaction(platformAddr, fromNumber) {
      const {
        Connection,
        PublicKey,
        Transaction,
        clusterApiUrl,
        SystemProgram,
      } = await import("@solana/web3.js");
      const NETWORK =
        this.$store.state.rpcObject.SOL[0] || "https://rpc.ankr.com/solana";
      const addressPublicKey = window.solana.publicKey;
      const connection = new Connection(NETWORK);
      if (!this.$store.state.wallet.address && this.connectType != "Phantom") {
        return;
      }
      let transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: addressPublicKey,
          toPubkey: platformAddr,
          lamports: Number(fromNumber) * 1000000000,
        })
      );
      transaction.feePayer = addressPublicKey;
      const anyTransaction = transaction;
      anyTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      return transaction;
    },
    async phantomExchange(platformAddr, fromNumber, res) {
      const fromToken = this.fromToken;
      //代币
      if (fromToken.contact !== "") {
        const module = await import("../utils/solTokenExchange");
        const signature = await module.default(
          platformAddr,
          fromToken.contact,
          fromNumber * 10 ** fromToken.coinDecimal
        );
        if (signature) {
          const dataHash = {
            from: this.$store.state.wallet.address,
            hash: signature,
          };
          this.modifyTxId(dataHash, res.data.orderId, res);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
        } else {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
        return;
      }
      //主币
      const {
        Connection,
        PublicKey,
        Transaction,
        clusterApiUrl,
        SystemProgram,
      } = await import("@solana/web3.js");
      const NETWORK =
        this.$store.state.rpcObject.SOL[0] || "https://rpc.ankr.com/solana";
      const connection = new Connection(NETWORK);
      const transaction = await this.createTransferTransaction(
        platformAddr,
        fromNumber
      );
      if (transaction) {
        try {
          let { signature } = await window.solana.signAndSendTransaction(transaction);
          // let signature = await connection.sendRawTransaction(
          //   signed.serialize()
          // );
          connection.confirmTransaction(signature, "confirmed");
          const dataHash = {
            from: this.$store.state.wallet.address,
            hash: signature,
          };
          this.modifyTxId(dataHash, res.data.orderId, res);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
        } catch (err) {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
      }
    },
    async TerraStationExchange(platformAddr, fromNumber, res) {
      const fromToken = this.fromToken;
      if (fromToken.contact === "") {
        const module = await import("../utils/TerraExchange");
        const fromAddress = this.$store.state.wallet.address;
        const result = await module.default(
          fromAddress,
          platformAddr,
          fromNumber
        );
        if (result.success) {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          const dataHash = {
            from: this.$store.state.wallet.address,
            hash: result.result.txhash,
          };
          this.modifyTxId(dataHash, res.data.orderId, res);
        } else {
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
      }
    },
    TokenPocketDOGEExchange(platformAddr, fromNumber, res) {
      let tp = require("tp-js-sdk");
      tp.btcTokenTransfer({
        from: this.$store.state.wallet.address,
        to: platformAddr,
        amount: fromNumber,
      }).then((data) => {
        if (data.result) {
          //发币
          const params = {
            from: this.$store.state.wallet.address,
            hash: data.data || data.msg,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        } else {
          // 取消
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        }
      });
    },
    async FILExchangeHandle(platformAddr, fromNumber, res) {
      const params = {
        jsonrpc: "2.0",
        id: 1,
        method: "Filecoin.MpoolGetNonce",
        params: [this.$store.state.wallet.address],
      };

      const nonceResult = await axios.post(
        "https://filecoin.maiziqianbao.net",
        params
      );

      let transaction = {
        from: this.$store.state.wallet.address,
        nonce: nonceResult.result, //可选
        to: platformAddr,
        value: (fromNumber * 10 ** 18).toString(), // 精度18
        method: 0,
        params: "",
      };

      window.filecoin
        .sendTransaction(transaction)
        .then((data) => {
          if (data) {
            //发币
            const params = {
              from: this.$store.state.wallet.address,
              hash: data,
            };
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            this.modifyTxId(params, res.data.orderId, res);
          } else {
            // 取消
            this.submitStatus = false;
            this.$refs.dialogConfirm.show = false;
            this.closeOrderDialog();
            Notify({
              message: this.$t("rejectExchange"),
              color: "#ad0000",
              background: "#ffe1e1",
            });
          }
        })
        .catch((err) => {
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    async SEIExchangeHandle(platformAddr, fromNumber, res) {
      const offlineSigner = await COMPASS_WALLET.getOfflineSigner("pacific-1");
      const signingClient = await getSigningClient(
        "https://sei-rpc.brocha.in/",
        offlineSigner
      );
      const fee = calculateFee(150000, "0.1usei");
      const aomuntSei = Number(fromNumber) * 10 ** 6;
      const amount = [{ amount: aomuntSei.toString(), denom: "usei" }];
      const timeoutTimestamp = Math.floor(Date.now() / 1000) + 60;
      const platformAddrArr = platformAddr.split("#");
      const sendResponse = await signingClient.sendTokens(
        this.$store.state.wallet.address,
        platformAddrArr[0],
        amount,
        fee,
        platformAddrArr[1]
      );

      if (sendResponse.code === 0) {
        //发币
        const params = {
          from: this.$store.state.wallet.address,
          hash: sendResponse.transactionHash,
        };
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        this.modifyTxId(params, res.data.orderId, res);
      } else {
        console.log(sendResponse.rawLog);
        // 取消
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
      }
    },
    async patexExchange(platformAddr, fromNumber, res) {
      const module = await import("web3");
      const Web3 = module.default;
      const fromToken = this.fromToken;
      provider = new ethers.providers.Web3Provider(window.patex.ethereum);
      signer = provider.getSigner();
      let params = null;
      if (fromToken.contact === "") {
        params = {
         
          to: platformAddr,
          value: ethers.utils.parseEther(fromNumber),
        };
      } else {
        web3 = new Web3();
        const ethErc20Contract = new web3.eth.Contract(
          ETH_erc20,
          fromToken.contact
        );
        const data = await ethErc20Contract.methods
          .transfer(
            platformAddr,
            // ethers.utils.parseEther(fromNumber)
            `0x${new BigNumber(fromNumber)
              .multipliedBy(new BigNumber(10 ** fromToken.coinDecimal))
              .toString(16)}`
          )
          .encodeABI();
        params = {
          from: this.$store.state.wallet.address, // Required
          to: fromToken.contact, // Required (for non contract deployments)
          data: data, // Required
        };
      }
      signer
        .sendTransaction(params)
        .then((data) => {
          const params = {
            from: this.$store.state.wallet.address,
            hash: data.hash,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, res.data.orderId, res);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          Notify({
            message: this.$t("rejectExchange"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
    async HAVAHExchangeHandle(platformAddr, fromNumber, resEx) {
      const rawTx = {
        from: this.$store.state.wallet.address, //from address
        to: platformAddr, //to address
        value: Number(fromNumber), //1.5HVH
      };
      try {
        const rsp = await window.havah.sendTransaction(rawTx);
        if (rsp.type == "success") {
          const params = {
            from: this.$store.state.wallet.address,
            hash: rsp.txHash,
          };
          this.submitStatus = false;
          this.$refs.dialogConfirm.show = false;
          this.closeOrderDialog();
          this.modifyTxId(params, resEx.data.orderId, resEx);
        }
      } catch (e) {
        this.submitStatus = false;
        this.$refs.dialogConfirm.show = false;
        this.closeOrderDialog();
        Notify({
          message: this.$t("rejectExchange"),
          color: "#ad0000",
          background: "#ffe1e1",
        });
        throw e;
      }
    },

    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    },
    modifyTxId(data, orderId, order) {
      const self = this;
      const params = {
        orderId: orderId, //   订单号
        depositAddress: data.from.toLowerCase(), //  用户地址
        targetAddress: this.$store.state.address, //  用户存币的地址
        depositTxid: data.hash, //  用户存币哈希
      };
      baseApi.modifyTxId(params).then((res) => {
        if (res.resCode == "800") {
          //发币成功发送订单号成功成功
          //打开兑换详情页
          self.confirmHandle(order);
          //调取兑换记录
          self.$bus.emit("queryAllTradeHandle");
        } else {
          errorCode(res.resCode, this);
        }
      });
    },
    modifyTRXTxId(txid, orderId, order) {
      const self = this;
      const params = {
        orderId: orderId,
        depositAddress: this.$store.state.walletTRON,
        targetAddress: this.$store.state.address,
        depositTxid: txid,
      };
      baseApi.modifyTxId(params).then((res) => {
        if (res.resCode == "800") {
          self.confirmHandle(order);
          self.$bus.emit("queryAllTradeHandle");
        } else {
          errorCode(res.resCode, this);
        }
      });
    },
    confirmHandle(res) {
      this.$store.commit("setOrder", res.data);
      this.$bus.emit("showOrderHandle", true);
      this.$bus.emit("isShowStatus");
      this.$store.commit("setSwapConfirm", false);
      this.$bus.emit("clearAddress");
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
      return document.querySelector(".centerDiv");
    },
    closeOrderDialog() {
      this.$store.commit("setSwapConfirm", false);
      this.$refs.dialogConfirm.show = false;
      this.submitStatus = false;
    },
    openOrderDilog() {
      this.$store.commit("setSwapConfirm", true);
    },
    async approve() {
      const approveNumber =
        "0x" +
        (this.fromNumber * 10 ** this.fromToken.coinDecimal).toString(16);

      this.pathBridgeExchangeStatus = false;
      if (this.info.dex === "ClassZZ") {
        approveActions(
          this.info.swapData.from,
          provider.provider,
          this.$store.state.wallets.address
        )
          .then((resApprove) => {
            this.$refs.approve.loading = false;
            if (resApprove && resApprove.data.authorization) {
              this.getClassZZData();
              this.$refs.approve.$refs.dialog.show = false;
            } else {
              this.submitLoading = false;
            }
          })
          .catch((error) => {
            this.$refs.approve.loading = false;
            this.submitLoading = false;
            this.$AlertError(this.$t("rejected"));
          });
      } else if (this.connectType == "JoyIDWallet") {
        let self = this;
        const result = await joyIdMethids.approve(this.txData.data.txData.to);
        if (result) {
          self.transactionReceiptTimer = setInterval(() => {
            self.getTransactionReceipt(result);
          }, 2000);
        } else {
          Notify({
            message: self.$t("rejected"),
            color: "#ad0000",
            background: "#ffe1e1",
          });
          self.$refs.approve.loading = false;
          self.submitStatus = false;
        }
        return;
      } else if (
        this.connectType === "TronLink" ||
        (this.connectType == "imToken" && window.tronWeb) ||
        (this.connectType == "TokenPocket" && window.tronWeb && !this.isPC) ||
        (this.connectType == "BitpieWallet" && window.tronWeb && !this.isPC) ||
        (this.connectType == "Bitget" && window.tronWeb && !this.isPC)
      ) {
        const resData = this.txData;
        const tronWeb = window.tronWeb;
        let contract;
        if (this.fromToken.contact == "TMz2SWatiAtZVVcH2ebpsbVtYwUPT9EdjH") {
          contract = await tronWeb.contract(tronAbi, this.fromToken.contact);
        } else {
          contract = await tronWeb.contract().at(this.fromToken.contact);
        }
        contract
          .approve(resData.data.txData.to, approveNumber)
          .send()
          .then((hash) => {
            tronWeb.trx.getTransaction(hash).then((result) => {
              if (!this.pathBridgeExchangeStatus) {
                this.submitStatus = false;
                this.$refs.approve.loading = false;
                this.$refs.approve.$refs.dialog.show = false;
                this.pathBridgeExchangeStatus = true;
              }
            });
          })
          .catch((err) => {
            if (err.error == "BANDWITH_ERROR") {
              Notify({
                message: this.$t("gasnotEnough", { coin: "TRX" }),
                color: "#ad0000",
                background: "#ffe1e1",
              });
            } else {
              Notify({
                message: this.$t("rejected"),
                color: "#ad0000",
                background: "#ffe1e1",
              });
            }

            this.$refs.approve.loading = false;
            this.submitStatus = false;
          });
      } else {
        if (this.connectType === "OKExWallet") {
          provider = new ethers.providers.Web3Provider(okexchain, "any");
        } else if (this.connectType === "OpenBlock") {
          provider = new ethers.providers.Web3Provider(window.openblock, "any");
        } else if (this.connectType === "EchoooWallet") {
          provider = new ethers.providers.Web3Provider(window.echoooEth, "any");
        } else if (this.connectType === "Nabox") {
          provider = new ethers.providers.Web3Provider(NaboxWallet, "any");
        } else if (this.connectType === "ONTO") {
          provider = new ethers.providers.Web3Provider(window.onto, "any");
        } else if (this.connectType === "oneKey") {
          provider = new ethers.providers.Web3Provider(
            window.$onekey.ethereum,
            "any"
          );
        } else if (this.connectType === "Halo") {
          provider = new ethers.providers.Web3Provider(window.kucoin, "any");
        } else if (this.connectType === "CLVWallet") {
          provider = new ethers.providers.Web3Provider(window.clover, "any");
        } else if (this.connectType === "Crypto") {
          provider = new ethers.providers.Web3Provider(
            window.deficonnectProvider,
            "any"
          );
        } else if (this.connectType === "Bitget") {
          provider = new ethers.providers.Web3Provider(
            window.bitkeep.ethereum,
            "any"
          );
        } else if (this.connectType === "Patex") {
          provider = new ethers.providers.Web3Provider(
            window.patex.ethereum,
            "any"
          );
        } else {
          if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(
              window.ethereum,
              "any"
            );
          }
        }
        if (this.$store.state.isWalletConnect) {
        } else {
          signer = provider ? provider.getSigner() : null;
        }
        const resData = this.txData;
        let contract;
        if (this.connectType !== "walletConnect") {
          contract = await getContract(this.fromToken.contact);
        }

        if (
          this.connectType === "walletConnect" ||
          (this.connectType == "imToken" && this.isPC)
        ) {
          WalletConnectProvider = await EthereumProvider.init(
            this.connectType == "imToken"
              ? this.$store.getters.EthereumProviderInitImtoken
              : this.$store.getters.EthereumProviderInit
          );
          const module = await import("web3");
          const Web3 = module.default;
          const tokenChain = this.fromToken.mainNetwork;
          const netWork = supportNetWork.find((e) => {
            return e.netWork === tokenChain;
          });
          const fromNumber = this.$store.state.fromNumber.toString();
          const web3 = new Web3(WalletConnectProvider);
          const ethErc20Contract = new web3.eth.Contract(
            ETH_erc20,
            this.fromToken.contact
          );
          const amount = web3.utils.toWei(fromNumber, "ether");

          // 构造授权交易对象
          const approveTx = {
            from: this.$store.state.wallet.address,
            to: this.fromToken.contact,
            data: ethErc20Contract.methods
              .approve(resData.data.txData.to, approveNumber)
              .encodeABI(),
          };
          const self = this;
          WalletConnectProvider.request({
            method: "eth_sendTransaction",
            params: [approveTx],
          })
            .then((tx) => {
              self.transactionReceiptTimer = setInterval(() => {
                self.getTransactionReceipt(tx);
              }, 2000);
            })
            .catch((error) => {
              console.error("代币授权交易发送失败:", error);
              Notify({
                message: self.$t("rejected"),
                color: "#ad0000",
                background: "#ffe1e1",
              });
              self.$refs.approve.loading = false;
              self.submitStatus = false;
            });
          return;
        }
        const module = await import("web3");
          const Web3 = module.default;
          const web3 = new Web3(provider);
          const ethErc20Contract = new web3.eth.Contract(
            ETH_erc20,
            this.fromToken.contact
          );
          // 构造授权交易对象
          const approveTx = {
            from: this.$store.state.wallet.address,
            to: this.fromToken.contact,
            data: ethErc20Contract.methods
              .approve(resData.data.txData.to, approveNumber)
              .encodeABI(),
            gasLimit: '80000'
          };
          signer.sendTransaction(approveTx).then((data) => {
            let self = this;
            self.transactionReceiptTimer = setInterval(() => {
              self.getTransactionReceipt(data.hash);
            }, 2000);
          }).catch((error) => {
            Notify({
                  message: this.$t("rejected"),
                  color: "#ad0000",
                  background: "#ffe1e1",
                });
                this.$refs.approve.loading = false;
                this.submitStatus = false;
          })
      }
    },
    async getTransactionReceipt(hash) {
      const list = supportNetWork.filter(
        (item) => item.netWork === this.fromToken.mainNetwork
      );
      const rpc =
        this.$store.state.rpcObject[this.fromToken.mainNetwork][0] ||
        list[0].rpcUrl;
      const chainId = list[0].chainId;
      const result = await axios.post(rpc, [
        {
          jsonrpc: "2.0",
          id: parseInt(chainId),
          method: "eth_getTransactionReceipt",
          params: [hash],
        },
      ]);
      if (result[0].result) {
        //哈希成功
        clearInterval(this.transactionReceiptTimer);
        setTimeout(() => {
          this.submitStatus = false;
          this.$refs.approve.loading = false;
          this.$refs.approve.$refs.dialog.show = false;
          this.pathBridgeExchangeStatus = true;
        }, 6000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.centerDiv {
  .free-gas {
    width: calc(100% + 0.74rem);
    margin-left: -0.37rem;
    margin-top: -0.37rem;
    padding: 0.25rem 0;
    background: #2980fa;
    opacity: 1;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: 0.5rem 0.5rem 0 0;
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
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .free-icon {
      font-family: Poppins-Regular;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 0.1rem;
      font-size: 0.4rem;
      color: #ffffff;
    }
  }
  .imgDiv {
    width: 100%;
    height: auto;
    margin-bottom: 0.185rem;
    img {
      width: 2.98rem;
      margin: 0px auto;
      display: block;
    }
  }
  .content {
    width: 100%;
    margin: 0 auto;
    height: auto;
    &.pc {
      width: 90%;
    }
    .valDiv {
      .top,
      .bottom {
        height: 45px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 0.66rem;
          height: 0.66rem;
          margin-right: 0.27rem;
        }
        .info {
          width: calc(100% - 0.83rem);
          text-align: left;
          .tip {
            text-align: left;
            min-height: 16px;
            font-size: 10px;
            font-family: Poppins-SemiBold, Poppins;
            font-weight: 600;
            color: #000;
            line-height: 16px;
            // font-weight: 600;
            .span12 {
              font-size: 0.259rem;
              display: inline-block;
            }
            .span16 {
              font-size: 0.37rem;
              padding-left: 3px;
              font-family: Poppins-Bold;
            }
            .span14 {
              font-size: 0.296rem;
              font-family: Poppins-Bold;
            }
          }
          .addr {
            color: #cbcbcb;
            width: 100%;
            position: relative;
            height: 20px;
            .addrCut {
              font-size: 14px;
              font-family: Poppins-Regular;
              width: calc(100% - 25px);
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              position: absolute;
            }
            img {
              display: inline-block;
              margin-left: 5px;
              width: 0.296rem;
              height: 0.296rem;
              position: absolute;
              right: 0;
              top: 5px;
            }
          }
        }
      }
      .middle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .line {
          height: 24px;
          margin-left: 0.314rem;
          border-right: 1px dashed #bfbfbf;
        }
      }
    }
    .divider {
      width: 100%;
      height: 1px;
      background: #e5e5e5;
      margin: 20px auto;
    }
    .rate,
    .received {
      display: flex;
      justify-content: space-between;
      //align-items: center;
      margin: 8px 0;
      width: 100%;
      height: auto;
      .left {
        font-size: 12px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #aab0c8;
        text-align: left;
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
          cursor: pointer;
        }
      }
      .right {
        text-align: right;
        font-size: 12px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #292929;
        .bridge {
          cursor: pointer;
          display: flex;
          align-items: center;
          img {
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      }
    }
    .buttonDiv {
      div {
        .left {
          float: left;
        }
        .right {
          float: right;
          font-family: "DINPro-Medium, DINPro";
          font-weight: 500;
          color: #ffffff;
        }
      }
      button {
        width: 100%;
        background: #277ffa;
        border-radius: 18px;
        font-size: 18px;
        cursor: pointer;
        height: 55px;
        margin-top: 18px;
        font-family: Poppins;
        color: #ffffff;
        line-height: 55px;
        border: 0px;
      }
    }
  }
  .closeIcon {
    width: calc(100% - 32px);
    height: 0.74rem;
    position: absolute;
    bottom: -0.925rem;
    img {
      width: 0.925rem;
      height: 0.925rem;
      cursor: pointer;
    }
  }
  .tip-content {
    text-align: left;
    padding: 8px 8px;
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
  }
}
.fee-span {
  display: inline-block;
  height: 0.351rem;
  background: linear-gradient(180deg, #fad961 0%, #ffc078 100%);
  border-radius: 0.18rem;
  color: #7d5500;
  text-align: center;
  padding: 0 8px;
  line-height: 0.351rem;
  font-weight: 600;
  font-size: 12px;
}
</style>
