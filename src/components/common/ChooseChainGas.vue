<template>
  <div>
    <Dialog ref="ChooseChainGas" @open="openDialog" @close="closeDialog" :width="isPC ? '400px' : '90%'">
      <div class="content">
        <div :class="isPC ? 'searchMaxPC' : 'searchMaxM'">
          <input class="search" :placeholder="$t('search')" v-model="search" />
          <svg t="1618546697328" class="search_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1109" width="200" height="200">
            <path d="M797.0048 857.2928l60.8-60.7744 71.9104 72.32a21.504 21.504 0 0 1-0.0512 30.336l-30.3872 30.4128a21.504 21.504 0 0 1-30.464-0.0512l-71.808-72.2432z" fill="#000000" p-id="1110"></path>
            <path d="M506.624 76.8C269.2352 76.8 76.8 269.2352 76.8 506.624s192.4352 429.824 429.824 429.824 429.824-192.4352 429.824-429.824S744.0128 76.8 506.624 76.8z m0 85.9648c189.9008 0 343.8592 153.9584 343.8592 343.8592S696.5248 850.4832 506.624 850.4832 162.7648 696.5248 162.7648 506.624 316.7232 162.7648 506.624 162.7648z" fill="#000000" p-id="1111"></path>
          </svg>
        </div>
        <div class="chain-list">
          <div class="list" :class="toToken && toToken.chain == item.chain ? 'active' : ''" v-for="(item, index) in chainListArr" :key="index" @click="choosehandle(item)" >
            <img :src="'https://transfer.swft.pro/swft-v3/images/coins/' + item.coinCode + '.png'" alt="" />
            <div>
              {{ item.allName }}
              <div class="balance">{{ item.coinCodeShow }}</div>
            </div>
            <svg v-if="toToken && toToken.chain == item.chain" t="1623379876661" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1063" width="200" height="200">
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
export default {
  name: "ChooseChain",
  data() {
    return {
      search: "", // 查询字段
    };
  },
  props: ["chainList"],
  created() {},
  components: {
    Dialog,
  },
  computed: {
    toToken: {
      get() {
        return this.$store.state.gasToToken;
      },
      set(val) {
        this.$store.commit("setgasToToken", val);
      },
    },
    chainListArr() {
      const list = this.chainList;
      if (this.search == "") {
        return list;
      } else {
        const arr = [];
        list.forEach((e) => {
          const networkName = e.chain ? e.chain.toLowerCase() : "";

          const s = this.search.toLowerCase();
          if (networkName.indexOf(s) !== -1) {
            arr.push(e);
          }
        });
        return arr;
      }
    },
  },
  methods: {
    closeDialog() {},
    openDialog() {
      this.search = "";
    },
    choosehandle(item) {
      this.toToken = item
      this.$refs.ChooseChainGas.show = false;
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
    text-align: left;
    font-size: 12px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color: #8f98ae;
  }
  .list {
    text-align: left;
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
