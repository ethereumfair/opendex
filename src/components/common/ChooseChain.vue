<template>
  <div>
    <Dialog ref="ChooseChain" @open="openDialog" @close="closeDialog" :width="isPC ? '400px' : '90%'">
      <div class="content">
        <div :class="isPC ? 'searchMaxPC' : 'searchMaxM'">
          <input class="search" :placeholder="$t('search')" v-model="search" />
          <svg t="1618546697328" class="search_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1109" width="200" height="200">
            <path d="M797.0048 857.2928l60.8-60.7744 71.9104 72.32a21.504 21.504 0 0 1-0.0512 30.336l-30.3872 30.4128a21.504 21.504 0 0 1-30.464-0.0512l-71.808-72.2432z" fill="#000000" p-id="1110"></path>
            <path d="M506.624 76.8C269.2352 76.8 76.8 269.2352 76.8 506.624s192.4352 429.824 429.824 429.824 429.824-192.4352 429.824-429.824S744.0128 76.8 506.624 76.8z m0 85.9648c189.9008 0 343.8592 153.9584 343.8592 343.8592S696.5248 850.4832 506.624 850.4832 162.7648 696.5248 162.7648 506.624 316.7232 162.7648 506.624 162.7648z" fill="#000000" p-id="1111"></path>
          </svg>
        </div>
        <div class="chain-list">
          <div class="list" v-for="(item, index) in chainListArr" :key="index" @click="choosehandle(item)" :class="
              (type == 'from'
                ? bridgeFromTokenchain.mainNetwork
                : bridgeToTokenchain.mainNetwork) == item.mainNetwork
                ? 'active'
                : ''
            ">
            <img :src="
                'https://transfer.swft.pro/swft-v3/images/coins/bridge-' +
                item.mainNetwork +
                '.png'
              " alt="" />
            <div>
              {{ item.networkName }}
              <div class="balance">{{ $t('balance') }}{{ item.balance }}</div>
            </div>
            <svg v-if="
                (type == 'from'
                  ? bridgeFromTokenchain.mainNetwork
                  : bridgeToTokenchain.mainNetwork) == item.mainNetwork
              " t="1623379876661" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1063" width="200" height="200">
              <path d="M512 102.4c226.21184 0 409.6 183.38816 409.6 409.6S738.21184 921.6 512 921.6 102.4 738.21184 102.4 512s183.38816-409.6 409.6-409.6z m180.95104 265.68704h-42.5984c-9.2672 0-18.08384 4.096-23.53152 11.1104L484.02432 561.3568l-64.67584-82.54464c-5.44768-6.94272-14.16192-11.12064-23.52128-11.12064h-42.5984c-5.90848 0-9.35936 6.18496-5.90848 10.61888l113.18272 144.384c11.53024 14.78656 35.4304 14.78656 46.96064 0l191.30368-243.98848c3.54304-4.42368 0.09216-10.60864-5.81632-10.60864z" fill="#526EFF" p-id="1064"></path>
            </svg>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "./dialog.vue";
import getAllBalance from "../../utils/getAllBalance";
import BigNumber from "bignumber.js";
import getTronBalance from "../../utils/getTronBalance";
import getSolTokenBalance from "../../utils/getSolTokenBalance";
import getEOSBalance from "../../utils/getEOSBalance";
export default {
  name: "ChooseChain",
  data() {
    return {
      search: "", // 查询字段
    };
  },
  props: ["type", "chainList"],
  created() {},
  components: {
    Dialog,
  },
  computed: {
    chainListArr() {
      const list = this.chainList;
      if (this.search == "") {
        return list;
      } else {
        const arr = [];
        list.forEach((e) => {
          const networkName = e.networkName ? e.networkName.toLowerCase() : "";

          const s = this.search.toLowerCase();
          if (networkName.indexOf(s) !== -1) {
            arr.push(e);
          }
        });
        return arr;
      }
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
    connectType() {
      return this.$store.state.wallet.connectType;
    },
    walletAddress() {
      if (this.$store.state.chainId == "000") {
        return this.$store.state.walletPolkadot.addrSS58;
      }
      if (this.$store.state.chainId == "222") {
        return this.$store.state.walletPolkadot.addrSS58CRU;
      } else if (this.$store.state.chainId == "0") {
        return this.$store.state.walletTRON;
      } else {
        return this.$store.state.wallet.address;
      }
    },
    bridgeChooseToken: {
      get() {
        return this.$store.state.bridgeChooseToken;
      },
      set(val) {
        this.$store.commit("setBridgeChooseToken", val);
      },
    },
  },
  methods: {
    closeDialog() {},
    openDialog() {
      this.search = "";
      //弹窗打开 计算余额
      this.chainListArr.forEach((item) => {
        this.getTokenBalance(item);
      });
    },
    choosehandle(item) {
      if (this.type == "from") {
        this.bridgeFromTokenchain = item;
      } else {
        this.bridgeToTokenchain = item;
      }
      this.$refs.ChooseChain.show = false;
    },
    async getTokenBalance(item) {
      //获取代币余额
      if (this.connectType == "") {
        return "--";
      }
      //trx获取余额
      if (item.mainNetwork === "TRX" && this.connectType == "TronLink") {
        if (this.connectType != "TronLink") return;
        const reslt = await getTronBalance();
        let tronWeb = window.tronWeb;
        if (this.bridgeChooseToken.coin === "TRX") {
          item.balance = tronWeb.fromSun(reslt.balance).toString();
        } else {
          if (item.contact.length > 10) {
            const contract = await tronWeb.contract().at(item.contact);
            const trc20 = await contract
              .balanceOf(this.$store.state.walletTRON)
              .call();
            const bal = tronWeb
              .toBigNumber(trc20)
              .shiftedBy(-(item.coinDecimal != null ? item.coinDecimal : 18))
              .toFixed(6, BigNumber.ROUND_DOWN);
          } else {
            let assets = reslt.assetV2;
            if (assets && assets.length !== 0) {
              let token = assets.find((e) => {
                if (e.key === item.contact) {
                  item.balance = 0;
                }
              });
              if (token) {
                const bal = new BigNumber(token.value)
                  .shiftedBy(
                    -(item.coinDecimal != null ? item.coinDecimal : 18)
                  )
                  .toFixed(6, BigNumber.ROUND_DOWN);
                item.balance = bal > 0 ? bal : 0;
              } else {
                item.balance = 0;
              }
            } else {
              item.balance = 0;
            }
          }
        }
        return;
      }
      // SOL获取余额
      if (item.mainNetwork === "SOL" && this.connectType == "Phantom") {
        const solanaWeb3 = await import("@solana/web3.js");
        const connection = new solanaWeb3.Connection(
          this.$store.state.rpcObject.SOL[0] || "https://rpc.ankr.com/solana",
          "confirmed"
        );
        if (item.contact === "") {
          let account = await connection.getAccountInfo(
            window.solana.publicKey
          );
          if (account) {
            const balanceSOL = (Number(account.lamports) / 1000000000).toFixed(
              6
            );
            item.balance = balanceSOL;
          } else {
            item.balance = 0;
          }
        } else {
          const balance = await getSolTokenBalance(
            this.walletAddress,
            item.contact
          );
          // const account = await window.solana.connect()
          // const tokenPublic = new solanaWeb3.PublicKey(coin.contact) //9pBLiojTZMxbAPcsCWs8TQEiuCedRudzEFFakJFRCAoS
          // const tokenAccount = await connection.getParsedTokenAccountsByOwner(
          //   window.solana.publicKey,
          //   { mint: tokenPublic },
          // )
          // const value = tokenAccount.value
          if (balance > 0) {
            item.balance = balance;
          } else {
            item.balance = 0;
          }
        }
        return;
      }
      // EOS 获取余额
      if (item.mainNetwork === "EOS" && this.connectType == "LeafWallet") {
        const res = await getEOSBalance(item);
        item.balance = new BigNumber(res).toFixed(6, BigNumber.ROUND_DOWN);
        return;
      }
      // EVM 链获取余额
      if (
        (item.mainNetwork === "BSC" ||
          item.mainNetwork === "ETH" ||
          item.mainNetwork === "HECO" ||
          item.mainNetwork === "POLYGON" ||
          item.mainNetwork === "ETHF" ||
          item.mainNetwork === "ETHW" ||
          item.mainNetwork === "Optimism" ||
          item.mainNetwork === "OKExChain" ||
          item.mainNetwork === "ARB" ||
          item.mainNetwork === "AVAXC" ||
          item.mainNetwork === "TT" ||
          item.mainNetwork === "XDC" ||
          item.mainNetwork === "KLAY" ||
          item.mainNetwork === "CELO" ||
          item.mainNetwork === "ORC" ||
          item.mainNetwork === "SGB" ||
          item.mainNetwork === "HPB" ||
          item.mainNetwork === "CRONOS" ||
          item.mainNetwork === "ECH" ||
          item.mainNetwork === "AME" ||
          item.mainNetwork === "CUBE" ||
          item.mainNetwork === "GNOSIS" ||
          item.mainNetwork === "ETC" ||
          item.mainNetwork === "KCC" ||
          item.mainNetwork === "BRISE" ||
          item.mainNetwork === "FTM" ||
          item.mainNetwork === "DRAC" ||
          item.mainNetwork === "FSC" ||
          item.mainNetwork === "FRZ" ||
          item.mainNetwork === "GRC30" ||
          item.mainNetwork === "CORE" ||
          item.mainNetwork === "DC" ||
          item.mainNetwork === "MTR" ||
          item.mainNetwork === "BTTC" ||
          item.mainNetwork === "ZKSYNC" ||
          item.mainNetwork === "CFX" ||
          item.mainNetwork === "FVM" ||
          item.mainNetwork === "EOS(EVM)" ||
          item.mainNetwork === "LINEA" ||
          item.mainNetwork === "PEGO" ||
          item.mainNetwork === "opBNB" ||
          item.mainNetwork === "ETRC20" ||
          item.mainNetwork === "OZO" ||
          item.mainNetwork === "QITMEER" ||
          item.mainNetwork === "PATEX" ||
          item.mainNetwork === "BASE" ||
          item.mainNetwork === "zkEVM" ||
          item.mainNetwork === "SCROLL" ||
          item.mainNetwork === "PulseChain"|| 
          item.mainNetwork === "Metis"|| 
          item.mainNetwork === "Moonriver"|| 
          item.mainNetwork === "Manta"|| 
          item.mainNetwork === "CMEMO"|| 
          item.mainNetwork === "Blast"|| 
          item.mainNetwork === "Moonbeam") &&
        this.connectType != "LeafWallet" &&
        this.connectType != "LiqualityWallet" &&
        this.connectType != "TokenPocketBTC" &&
        this.connectType != "TerraStation" &&
        this.connectType != "Phantom" &&
        this.connectType != "TronLink" &&
        this.connectType != "Polkadot" &&
        this.connectType != "Unisat" &&
        this.connectType != "Petra"
      ) {
        const data = await getAllBalance([item], item.mainNetwork);
        const coinDecimalNum = item.coinDecimal == null ? 0 : item.coinDecimal;
        const balance = new BigNumber(data[0].result)
          .shiftedBy(-(coinDecimalNum != 0 ? coinDecimalNum : 18))
          .toFixed(7, BigNumber.ROUND_DOWN)
          .slice(0, -1);
        item.balance = balance > 0 ? balance : 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.searchMaxPC {
  position: relative;
  .search {
    box-sizing: border-box;
    // border: 1px solid rgba(187, 187, 187, 100);
    width: 100%;
    position: relative;
    padding-left: 48px;
    border-radius: 10px;
    font-size: 16px;
    height: 48px;
    background: #f9fafb;
    border-radius: 22px;
    // box-shadow: 0 0 3px 0 #eee;
    border: 1px solid rgba(0, 0, 0, 0.06);
    font-family: Poppins-Medium, Poppins;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
  }
  .search_icon {
    position: absolute;
    top: 10px;
    left: 15px;
    width: 25px;
    height: 25px;
    color: #000000;
  }
}
.searchMaxM {
  position: relative;
  .search {
    box-sizing: border-box;
    // border: 1px solid rgba(187, 187, 187, 100);
    width: 100%;
    position: relative;
    padding-left: 38px;
    border-radius: 10px;
    font-size: 16px;
    height: 38px;
    background: #f9fafb;
    border-radius: 22px;
    // box-shadow: 0 0 3px 0 #eee;
    border: 1px solid rgba(0, 0, 0, 0.06);
    font-family: Poppins-Medium, Poppins;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
  }
  .search_icon {
    position: absolute;
    top: 10px;
    left: 15px;
    width: 15px;
    height: 15px;
    color: #000000;
  }
}
.content {
  width: 100%;
}
.chain-list {
  height: 50vh;
  overflow: hidden;
  overflow-y: auto;
  margin-top: 0.2rem;
  .balance {
    font-size: 12px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color: #8f98ae;
  }
  .list {
    display: flex;
    align-items: center;
    height: 1.2rem;
    font-size: 0.3rem;
    font-family: Poppins;
    color: #8f98ae;
    padding: 0 10px;
    position: relative;
    cursor: pointer;
    .icon {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -7.5px;
    }
    &.active {
      background: #f7f8fa;
      border-radius: 15px;
      color: #000000;
    }
    img {
      width: 0.7037rem;
      height: 0.7037rem;
      margin-right: 0.2rem;
    }
  }
}
</style>
>
