<script>
import { Loading } from "vant";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
// const { ApiPromise, WsProvider } = require('@polkadot/api')
// const { typesBundleForPolkadot } = require('@crustio/type-definitions')
// import * as solanaWeb3 from '@solana/web3.js'
// import getTerraBalanceHandle from '../../utils/getTerraBalance'
import BtcExchangeHandle from "../../utils/getBtcBalance";
import getEOSBalance from "../../utils/getEOSBalance";
import { Notify, Dialog } from "vant";
import getPolkadotBalance from "../../utils/getPolkadotBalance";
import baseApi from "../../api/baseApi";
import suiWalletMethods from "../../utils/suiWalletConnect";
import PortkeyMethods from "@/utils/PortkeyMethods";

export default {
  name: "item",
  components: {
    Loading,
  },
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
    currentCoin: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default() {
        return "";
      },
    },
    balanceLoading: {
      type: Boolean,
      default() {
        return true;
      },
    },
    isSupportAdvanced: {
      type: String,
      default() {
        return "";
      },
    },
    activeNetwork: {
      type: String,
      default() {
        return "";
      },
    },
  },
  computed: {
    showNFTInfo() {
      //判断状态 noOrders 无卖单 Orders 有卖单
      const asset = this.source.asset;
      let info = "";
      switch (asset.status) {
        case "noOrders":
          info = this.$t("noOrder", {
            type: asset.type === "to" ? "卖" : "买",
          });
          break;
        case "Orders":
          info = this.$t("price") + "：" + asset.info;
          break;
        case "noHave":
          info = this.$t("noHave");
          break;
        default:
          break;
      }
      return info;
    },
    chainId() {
      return this.$store.state.chainId;
    },
    supportArr() {
      return this.$store.state.allSupportChianArr;
    },
    tabActive: {
      get() {
        return this.$store.state.tabActive;
      },
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
  },
  watch: {
    balanceLoading(val) {
      this.loading = val;
    },
  },
  data() {
    return {
      balance: "",
      loading: true,
    };
  },
  mounted() {
    this.loading = this.balanceLoading;
    if (this.source.mainNetwork === "NFT") {
      
    } else if (
      this.type === "from" &&
      (this.$store.state.chainId === "000" ||
        this.$store.state.chainId === "222" ||
        this.$store.state.chainId === "333" ||
        this.$store.state.chainId === "1993" ||
        this.$store.state.chainId === "1994" ||
        this.$store.state.chainId === "7299" ||
        this.$store.state.chainId === "1040")
    ) {
      this.getCoinBalance();
    }
  },
  methods: {
    chooseCoin(data) {
      if (this.isSupportAdvanced === "N") {
        Notify({
          color: "#ad0000",
          background: "#ffe1e1",
          message: this.$t("218"),
        });
        return;
      }
      if (data.mainNetwork == "BRC20") {
        Dialog.confirm({
          message: this.$t("sendBRC20"),
          messageAlign: "left",
          confirmButtonColor: "#0A4F93",
          confirmButtonText: this.$t("ConfirmNFT"),
          cancelButtonText: this.$t("btnCancel"),
        })
          .then(() => {})
          .catch(() => {});
      }
      this.$bus.emit("chooseCoinHandle", data, this.type);
    },
    async getCoinBalance() {
      const coin = this.source;

      if (this.$store.state.chainId === "1993" && coin.mainNetwork === "LUNA") {
        const module = await import("../../utils/getTerraBalance");
        this.source.balance = await module.default(
          this.source,
          this.$store.state.wallet.address
        );
        this.loading = false;
      } else if (
        this.$store.state.chainId === "1994" &&
        coin.mainNetwork == "BTC"
      ) {
        if (this.$store.state.wallet.connectType == "Unisat") {
          this.loading = true;

          let resBalance = await window.unisat.getBalance();
          const balanceNewBTC = Number(resBalance.total) / 10 ** 8;
          this.source.balance = balanceNewBTC;
          this.loading = false;
        } else {
          try {
            const balance = await BtcExchangeHandle.getBtcBalanceHandle();
            this.source.balance = balance;
            this.loading = false;
          } catch {
            this.loading = false;
          }
        }
      } else if (
        this.$store.state.chainId === "1994" &&
        coin.mainNetwork == "BRC20"
      ) {
        if (this.$store.state.wallet.connectType == "Unisat") {
          this.loading = true;
          const res = await baseApi.queryBRC20({
            address: this.walletAddress,
            ticker:
              this.source.coinCode === "1000SATS"
                ? "SATS"
                : this.source.coinCode,
          });
          if (res.resCode == 800) {
            if (res.data.data.detail.length > 0) {
              this.source.balance = res.data.data.detail[0].data.amt;
            } else {
              this.source.balance = 0;
            }
          } else {
            this.source.balance = 0;
          }
          this.loading = false;
        }
      } else if (
        this.$store.state.chainId === "1040" &&
        coin.mainNetwork == "EOS"
      ) {
        try {
          const balance = await getEOSBalance(this.source);
          this.source.balance = balance;
          this.loading = false;
        } catch {
          this.loading = false;
        }
      } else if (
        this.$store.state.chainId === "7299" &&
        coin.mainNetwork == "SUI"
      ) {
        this.loading = true;
        const balance = await suiWalletMethods.getSuiBalance(coin.contact);
        let etherString = ethers.utils.formatUnits(balance, coin.coinDecimal);
        const number = Number(
          new BigNumber(etherString).toFixed(6, BigNumber.ROUND_DOWN)
        );
        this.source.balance = number;
        this.loading = false;
      } else if (
        this.$store.state.chainId === "000" &&
        coin.mainNetwork == "DOT"
      ) {
        this.loading = true;
        try {
          let balance1;
          const balance = await getPolkadotBalance(this.source);
          balance1 =
            balance.slice(0, balance.length - 10) + "." + balance.slice(1);
          if (this.source.contact == "1984") {
            balance1 = new BigNumber(freeBalance)
              .dividedBy(BigNumber(10).pow(coin.coinDecimal))
              .toFixed(4, BigNumber.ROUND_DOWN);
          }
          this.source.balance = balance1;
          this.loading = false;
        } catch {
          this.loading = false;
        }
      } else if (
        this.$store.state.chainId === "520520" &&
        coin.mainNetwork == "AELF"
      ) {
        this.loading = true;
        const balance = await PortkeyMethods.getBalance(coin)
        this.source.balance = balance;
        this.loading = false;
        } 
    },
    getNFTOrderBalance(info) {
      return (
        info.current_price.toString() /
          10 ** info.payment_token_contract.decimals +
        " " +
        info.payment_token_contract.symbol
      );
    },
    handleBalance(coin, value) {
      let etherString = ethers.utils.formatUnits(value, coin.coinDecimal);
      const number = Number(
        new BigNumber(etherString).toFixed(6, BigNumber.ROUND_DOWN)
      );
      this.source.balance = number;
      this.loading = false;
    },
  },
  render() {
    if (this.$store.state.toToken) {
      if (
        `${this.type}` === "from" &&
        this.$store.state.toToken.coinCode === this.source.coinCode &&
        this.tabActive != "gasSwap"
      ) {
        return;
      }
    }
    if (this.$store.state.fromToken) {
      if (
        `${this.type}` === "to" &&
        this.$store.state.fromToken.coinCode === this.source.coinCode
      ) {
        return;
      }
    }
    if (
      this.type === "from" &&
      this.source.mainNetwork !== "NFT" &&
      this.activeNetwork == "" &&
      this.supportArr.indexOf(this.source.mainNetwork) == -1
    ) {
      return;
    }
    return (
      <div
        id="coin_list"
        onclick={() => {
          this.chooseCoin(this.source);
        }}
        class={this.isSupportAdvanced === "N" ? "bgOpacity" : ""}
      >
        <div class="left">
          {this.source.mainNetwork === "NFT" ? (
            <img
              class={this.isPC ? "imgPC" : "imgM"}
              src={this.source.logoURI}
              alt=""
            />
          ) : (
            <img
              class={this.isPC ? "imgPC" : "imgM"}
              src={`https://transfer.swft.pro/swft-v3/images/coins/${this.source.coinCode}.png`}
              alt=""
            />
          )}
          <div
            class={
              this.currentCoin &&
              this.currentCoin.coinCode === this.source.coinCode
                ? "active"
                : ""
            }
          >
            <div class="coin">
              {this.source.coinCodeShow}
              <span>
                {this.source.mainNetwork || this.source.coinCode}
                {this.source.mainNetwork === "NFT" ? (
                  <b class="nft-info">
                    {this.source.asset ? this.showNFTInfo : ""}
                  </b>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
        </div>
        <div class="right">
          {this.currentCoin &&
          this.currentCoin.coinCode === this.source.coinCode ? (
            <svg
              t="1623379876661"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1063"
              width="200"
              height="200"
            >
              <path
                d="M512 102.4c226.21184 0 409.6 183.38816 409.6 409.6S738.21184 921.6 512 921.6 102.4 738.21184 102.4 512s183.38816-409.6 409.6-409.6z m180.95104 265.68704h-42.5984c-9.2672 0-18.08384 4.096-23.53152 11.1104L484.02432 561.3568l-64.67584-82.54464c-5.44768-6.94272-14.16192-11.12064-23.52128-11.12064h-42.5984c-5.90848 0-9.35936 6.18496-5.90848 10.61888l113.18272 144.384c11.53024 14.78656 35.4304 14.78656 46.96064 0l191.30368-243.98848c3.54304-4.42368 0.09216-10.60864-5.81632-10.60864z"
                fill="#526EFF"
                p-id="1064"
              ></path>
            </svg>
          ) : (
            ""
          )}
          {this.type === "from" &&
          this.chainId &&
          this.source.mainNetwork !== "NFT" &&
          this.activeNetwork != "" ? (
            <div class="blance-box">
              {this.loading ? (
                <Loading color="#1989fa" />
              ) : (
                <span
                  class={
                    this.currentCoin &&
                    this.currentCoin.coinCode === this.source.coinCode
                      ? "active"
                      : ""
                  }
                >
                  {this.source.balance}
                </span>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  },
};
</script>

<style scoped lang="scss">
.blance-box {
  height: 27px;
  line-height: 27px;
}
#coin_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 5px 0;
  border-radius: 2px;
  // border-bottom: 1px solid #eee;
  color: #8f98ae;
  &.bgOpacity {
    opacity: 0.4;
  }
  &.M {
    margin-bottom: 5px;
    padding: 5px 0;
  }
  &:hover {
    // background: #f5f6f7;
    color: #000;
    box-shadow: 0 0 3px 0 #eee;
  }
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .imgM {
      width: 25px;
      height: 25px;
      margin-right: 15px;
    }
    .imgPC {
      width: 35px;
      height: 35px;
      margin-right: 15px;
    }
    .active {
      // background: #f5f6f7;
      color: #000;
    }
    .coin {
      text-align: left;
      font-family: Poppins-SemiBold, Poppins;
      word-break: break-all;
      span {
        width: 100%;
        display: inherit;
        font-size: 10px;
        color: #8f98ae;
        font-family: Poppins-Regular, Poppins;
      }
    }
  }
  .right {
    text-align: right;
    .active {
      // background: #f5f6f7;
      color: #000;
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
  :deep(.van-loading__spinner) {
    width: 20px;
    height: 20px;
  }
}
li {
  &.active {
    // background: #f5f6f7;
    color: #000;
  }
}
li:hover {
  // background: #f5f6f7;
  color: #000;
  box-shadow: 0 0 3px 0 #eee;
}
.list::-webkit-scrollbar {
  display: none !important;
}
.nft-info {
  display: inline-block;
  margin-left: 10px;
}
</style>
