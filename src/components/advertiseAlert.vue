<template>
  <div class="">
    <Dialog
      :width="isPC ? '540px' : '90%'"
      ref="advertiseAlert"
      bgc="transparent"
    >
       <img
        v-if="lang == 'en' && alertImgObj.en.isShow=='Y'"
        class="imgAlert"
        :src="alertImgObj.en.imgUrl"
        @click="openUrl(alertImgObj.en.clickUrl)"
        alt=""
      />
      <img
        v-if="lang != 'en' && alertImgObj.cn.isShow=='Y'"
        class="imgAlert"
        :src="alertImgObj.cn.imgUrl"
        @click="openUrl(alertImgObj.cn.clickUrl)"
        alt=""
      />
      <div class="closeDiv" :class="isPC ? 'pc' : 'mb'" @click="closeAlert">
        <span>{{ second }}s</span>
        <span class="iconfont" style="color:#fff">&#xe68a;</span>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './common/dialog'
export default {
  components: {
    Dialog,
  },
  data() {
    return {
      second: 5,
      sourceFlag: localStorage.getItem('sourceFlag'),
    }
  },
  props:{
    alertImgObj: {
      type: Object,
      default() {
        return {}
      },
    },

  },
  computed: {
    lang: {
      get() {
        return this.$store.state.lang
      },
    },
  },
  watch: {},
  methods: {
    closeAlert() {
      this.$refs.advertiseAlert.show = false
    },
    secondChange() {
      const _this = this
      _this.$refs.advertiseAlert.show = true
      clearInterval(_this.timer)
      self.timer = null
      self.timer = setInterval(() => {
        _this.second = this.second - 1
        if (_this.second === 0) {
          _this.$refs.advertiseAlert.show = false
        }
      }, 1000)
    },
    //设置cookie
    setCookie(cname, cvalue, exdays) {
      var d = new Date()
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
      var expires = 'expires=' + d.toUTCString()
      document.cookie = cname + '=' + cvalue + '; ' + expires
    },
    //获取cookie
    getCookie(cname) {
      var name = cname + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
      }
      return ''
    },
    openUrl(url){
      if(url != ""){
        window.open(url)
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.$refs.advertiseAlert.show = true
    const num = this.getCookie('advertiseSWFTC')
    if (num) {
      this.setCookie('advertiseSWFTC', Number(num) + 1, 365)
      const time = (Number(num) + 1) % 10
      if (time == 1) {
        this.secondChange()
      } else {
        this.$refs.advertiseAlert.show = false
      }
    } else {
      this.setCookie('advertiseSWFTC', 1, 365)
      this.secondChange()
    }
  },
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
// @import url(); 引入公共css类
.imgAlert {
  width: 100%;
  height: 100%;
}
.closeDiv {
  &.pc {
    width: 100px;
    height: 40px;
    border: 1px solid #ffffff;
    border-radius: 50px;
    color: #ffffff;
    line-height: 40px;
    margin: 0 auto;
    cursor: pointer;
    font-size: 16px;
  }
  &.mb {
    width: 80px;
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
  }
  span:first-child {
    margin-right: 30px;
  }
}
</style>
