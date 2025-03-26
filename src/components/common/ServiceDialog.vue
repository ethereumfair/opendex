<template>
  <div class="service-dialog" :class="isPC ? '' : 'mb'">
    <div class="top-title">
      <img
        @click="closeServiceDialog"
        class="close-AI"
        src="../../assets/img/close-AI.png"
        alt=""
      />
      <div class="tabBox">
        <div class="itemTab activeTab">
          <img class="dialogImg_ser" src="../../assets/img/service_blue.png" />
          <div>{{ $t('support') }}</div>
        </div>
        <div class="itemTab" @click="openbAIServiceDialog">
          <img class="dialogImg_ser" src="../../assets/img/chatbot_white.jpg" />
          <div>Chatbot</div>
        </div>
      </div>
    </div>
    <div class="content" ref="chatContent">
      <div v-if="loading" class="three-bounce">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
      <iframe
        v-show="!loading"
        id="ifra"
        class="iframe"
        :src="serviceUrl"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WidgetServiceDialog',
  data() {
    return {
      loading: false, // iframe加载状态
      sourceFlag: localStorage.getItem('sourceFlag'),
      twFlag: localStorage.getItem('twFlag'),
    }
  },
  components: {},
  computed: {
    lang: {
      get() {
        return this.$store.state.lang
      },
      set(val) {
        this.$store.commit('setLang', val)
      },
    },
    serviceUrl() {
      //defi.swft.pro 全域名显示中文客服
      //首先判断此域名
      const urlStr = window.location.href
      if (urlStr.indexOf('defi.swft.pro') !== -1) {
        return 'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha'
      }
      //判断语言
      if (this.lang == 'zh' || this.lang == 'zht' || this.lang == 'korea') {
        if (this.twFlag == 'miningtw') {
          return 'https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=782460&uid=&customSource=miningtw'
        } else if (this.twFlag == 'burndex') {
          return 'https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=782460&uid=&customSource=stablexbridge'
        } else {
          return 'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha'
        }
      } else {
        return 'https://tawk.to/chat/6433ae444247f20fefeabe57/1gtku1fhl'
      }
    },
  },
  mounted() {
    const self = this
    self.loading = true
    this.$nextTick(() => {
      const iframe = document.querySelector('#ifra')
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', function () {
          self.loadSuccess()
        })
      } else {
        iframe.onload = function () {
          self.loadSuccess()
        }
      }
    })
  },
  watch: {},
  methods: {
    openbAIServiceDialog() {
      //打开AI对话框
      this.$emit('openbAIServiceDialog')
    },
    loadSuccess() {
      const self = this
      setTimeout(() => {
        self.loading = false
      }, 200)
    },
    closeServiceDialog() {
      this.$emit('closeServiceDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.service-dialog {
  width: 450px;
  height: 80vh;
  position: fixed;
  bottom: calc(20px + 1rem);
  right: 25px;
  z-index: 90;
  background: #ffffff;
  border-radius: 0.5rem;
  opacity: 1;
  border: 1px solid #e2e2e2;
  box-sizing: border-box;
  padding: 0.8rem 0.3rem 0.3rem 0.3rem;
  display: flex;
  flex-direction: column;

  &.mb {
    width: 100%;
    height: 100%;
    max-width: auto;
    right: 0;
    top: 0;
    border-radius: 0;
  }
  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.2rem;
    position: relative;
    .close-AI {
      width: 0.45rem;
      position: absolute;
      right: 0;
      top: -0.6rem;
      cursor: pointer;
    }
    // .left{
    //     font-size: .4rem;
    //     font-family: Poppins-SemiBold, Poppins;
    //     font-weight: 600;
    //     color: #000000;
    // }
    // .right{
    //     display: flex;
    //     align-items: center;
    //     height: .8rem;
    //     padding: 0 .2rem;
    //     background: #F4F8FF;
    //     border-radius: .8rem;
    //     opacity: 1;
    //     cursor: pointer;
    //     font-size: .25rem;
    //     font-family: Poppins-SemiBold, Poppins;
    //     font-weight: 600;
    //     color: #050505;
    //     .service-img{
    //         width: .6rem;
    //         margin-right: .1rem;
    //     }
    // }
    .tabBox {
      display: flex;
      // width: 60%;
      margin: 0 auto;
      justify-content: space-around;
      align-items: center;
      background: #f5f5f5;
      border-radius: 66px;
      opacity: 1;
      border: 1px solid #ededed;
      padding: 5px;
      color: #7d7d7d;
      font-weight: bold;
      .itemTab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        padding: 7px;
        font-size: 0.32rem;
        white-space: nowrap;
        cursor: pointer;
        &.activeTab {
          background: #0066ff;
          color: #fff;
          border-radius: 57px;
        }
        img {
          width: 28px;
          height: 28px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style>
.three-bounce {
  text-align: left;
  display: flex;
  align-items: center;
}
.three-bounce .one {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.three-bounce .two {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.three-bounce > div {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  top: 50%;
  background: #aeadba;
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@keyframes bouncedelay {
  0%,
  100%,
  80% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }

  40% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
