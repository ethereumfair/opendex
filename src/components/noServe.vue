<template>
  <div>
    <Dialog :width="isPC ? '500px' : '90%'" ref="dialogServe">
      <div class="noServe">
        <img
          width="200px"
          height="200px"
          src="../assets/img/noServe.png"
          alt=""
        />
        <p>
          AllChain Bridge current is not available in the country you are in
          Follow us to be notified when we add support for your country.
        </p>
      </div>
      <div class="closeIcon">
        <img @click="closeOrderDialog" src="../assets/img/close.png" alt="" />
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './common/dialog'
export default {
  components: { Dialog },
  data() {
    return {}
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    serveShow() {
      this.$refs.dialogServe.show = true
    },
    closeOrderDialog() {
      this.$refs.dialogServe.show = false
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
}
</script>
<style lang="scss" scoped>
.noServe {
  color: #95a3c6;
  text-align: center;
  font-size: 12px;
  font-family: Poppins-Medium;
  padding: 50px 0;
}
.closeIcon {
  width: calc(100% - 32px);
  height: 40px;
  position: absolute;
  bottom: -50px;
  img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
</style>
