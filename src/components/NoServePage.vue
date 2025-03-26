<template>
  <div>
    <div class="noServe" :style="{ width: isPC ? '700px' : '90%' }">
      <img src="../assets/img/noServe.png" alt="" />
      <div v-if="sourceFlag == 'burndex'">
        <p v-if="lang == 'zh'">
          stablex AllChain 对您当前所在的国家/地区不提供服务
        </p>
        <p v-else>
          stablex AllChain services are currently unavailable in your
          country/area.
        </p>
      </div>
      <div v-else>
        <p v-if="lang == 'zh'">
          SWFT AllChain 对您当前所在的国家/地区不提供服务
        </p>
        <p v-else>
          SWFT AllChain services are currently unavailable in your country/area.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { sourceFlag: localStorage.getItem('sourceFlag') }
  },
  // 监听属性 类似于data概念
  computed: {
    // 监控data中的数据变化
    lang() {
      return this.$store.state.lang
    },
  },
  watch: {},
  // 方法集合
  methods: {},
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
  color: #000;
  text-align: center;
  font-size: 12px;
  font-family: Poppins-Medium;
  padding: 150px 0;
  margin: 0 auto;
  img {
    margin-bottom: 20px;
  }
}
</style>
