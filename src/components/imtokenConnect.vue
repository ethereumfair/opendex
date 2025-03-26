<template>
  <div class="">
    <Dialog :width="isPC ? '540px' : '90%'" ref="dialogImtoken">
      <div class="title">{{$t('Scan_to_use_imToken')}}</div>
      <vue-qr style="width:300px;height:300px;" :logoSrc="logoURL" :size="1000" :text="walletConnect_uri"></vue-qr>
      <div class="closeDiv" :class="isPC ? 'pc' : 'mb'" @click="closeAlert">
        <span class="iconfont" style="color:#fff">&#xe68a;</span>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "./common/dialog";
import VueQr from "vue-qr";
export default {
  components: {
    Dialog,
    VueQr,
  },
  data() {
    return {
      sourceFlag: localStorage.getItem("sourceFlag"),
    };
  },
  props: {},
  // 监听属性 类似于data概念
  computed: {
    lang: {
      get() {
        return this.$store.state.lang;
      },
    },
    walletConnect_uri: {
      get() {
        return this.$store.state.walletConnect_uri;
      },
    },
    logoURL() {
      return require("../assets/img/imtoken.svg");
    },
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    closeAlert() {
      this.$refs.dialogImtoken.show = false;
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.imgAlert {
  width: 100%;
  height: 100%;
}
.title {
  font-size: 14px;
  text-align: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #d1d6df;
  margin-bottom: 20px;
}
.closeDiv {
  &.pc {
    width: 40px;
    height: 40px;
    border: 1px solid #ffffff;
    border-radius: 40px;
    color: #ffffff;
    line-height: 40px;
    margin: 0 auto;
    cursor: pointer;
    font-size: 16px;
    position: absolute;
    bottom: -70px;
    left: 250px;
  }
  &.mb {
    width: 30px;
    height: 30px;
    border: 1px solid #ffffff;
    border-radius: 30px;
    color: #ffffff;
    line-height: 30px;
    margin: 0 auto;
    cursor: pointer;
    font-size: 12px;
    span:nth-child(2) {
      font-size: 12px;
    }
    position: absolute;
    bottom: -70px;
    left: 50%;
  }
}
</style>
