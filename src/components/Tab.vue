<template>
  <div class="tabDiv">
    <div v-if="sourceFlag == 'burndex'" class="BURN">
      {{ $t('bridgers') + $t('tabSwap') }}
    </div>
    <ul v-else>
      <li
        :class="tabActive == 'swap' ? 'active' : ''"
        @click="changeModule('swap')"
      >
        <img
          :class="animated ? 'imgL' : ''"
          v-if="tabActive == 'swap'"
          src="../assets/img/tabLeft.png"
          alt=""
        />
        <span class="spanText">{{ $t('tabSwap') }}</span>
      </li>
      <li
        v-if="sourceFlag == 'HN'"
        :class="tabActive == 'addLiquidity' ? 'active' : ''"
        @click="changeModule('addLiquidity')"
      >
        <img
          class="imgM"
          v-if="tabActive == 'addLiquidity'"
          src="../assets/img/tabRight1.png"
          alt=""
        />
        <span class="spanText">{{ $t('tabAddLiquidity') }}</span>
      </li>
      <li
        class="width"
        v-if="sourceFlag !== 'HN'"
        :class="tabActive == 'gasSwap' ? 'active' : ''"
        @click="changeModule('gasSwap')"
      >
        <img
          class="imgM"
          v-if="tabActive == 'gasSwap'"
          src="../assets/img/tabRight1.png"
          alt=""
        />
        <span class="spanText">
          {{ $t('gasSwap') }}
          <img class="imgNew" src="../assets/img/new.png" alt="" />
        </span>
      </li>
      <li
        :class="tabActive == 'bridge' ? 'active' : ''"
        @click="changeModule('bridge')"
      >
        <img
          class="imgR"
          v-if="tabActive == 'bridge'"
          src="../assets/img/tabRight.png"
          alt=""
        />
        <span class="spanText">{{ $t('bridgers') }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return { sourceFlag: localStorage.getItem('sourceFlag'), animated: false }
  },
  computed: {
    tabActive: {
      get() {
        return this.$store.state.tabActive
      },
      set(val) {
        this.$store.commit('setTabActive', val)
      },
    },
  },
  mounted(){
    const type = this.$route.query.type
    if(type == 'bridge'){
      this.tabActive = 'bridge'
    }else if(type == 'gasSwap'){
      this.tabActive = 'gasSwap'
    }else{
      this.tabActive = 'swap'
    }
  },
  // 方法集合
  methods: {
    // 切换模块
    changeModule(val) {
      this.tabActive = val
      this.animated = true
      this.$store.commit('setFromNumber', '')
      this.$store.commit('setToNumber', '')
      this.$store.commit('setInfo', null)
      if (val === 'NFT') {
        this.$store.commit('setNFTFromToken', null)
        this.$store.commit('setNFTToToken', null)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@keyframes animationL {
  0% {
    left: 1rem;
  }
  100% {
    left: 0;
  }
}
@keyframes animationR {
  0% {
    right: 1rem;
  }
  100% {
    right: 0;
  }
}
.BURN {
  height: 0.94rem;
  line-height: 0.94rem;
  background: #ffffff;
  color: #8135ff;
  font-family: Poppins;
  font-size: 0.33rem;
  border-radius: 30px 30px 0px 0px;
}
.tabDiv {
  width: 100%;
  background: #f7f8fa;
  border-radius: 30px 30px 0px 0px;
  // height: 0.94rem;
  ul {
    display: flex;
    justify-content: center;
    li {
      // width: 5rem;
      height: 0.94rem;
      line-height: 0.94rem;
      flex: 1;
      color: #9197a5;
      font-family: Poppins;
      font-size: 0.33rem;
      cursor: pointer;
      position: relative;
      text-align: center;
      &.width{
        flex: 1.3;
      }
      img {
        // width: 5.925rem;
        width: 118%;
        height: 1.018rem;
        z-index: 9;
        position: absolute;
        top: -0.074rem;
        left: 0;
        &.imgL {
          position: absolute;
          top: -0.074rem;
          left: 0;
          right: inherit;
          animation: animationL 0.3s ease;
        }
        &.imgM {
          height: 1.096rem;
          position: absolute;
          left: -0.304rem;
          top: -0.148rem;
        }
        &.imgR {
          position: absolute;
          left: inherit;
          right: 0;
          top: -0.074rem;
          animation: animationR 0.3s ease;
        }
        &.imgNew {
          width: 0.592rem;
          height: 0.259rem;
          z-index: 10;
         position: relative;
        }
      }
      .spanText {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 10;
        right: 0;
        top: 0;
      }
    }
    .active {
      color: #000000;
    }
  }
}
</style>
