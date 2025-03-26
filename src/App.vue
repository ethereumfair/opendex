<template>
  <div id="app" :class="[isPC ? 'pc' : '',sourceFlag,twFlag]">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data(){
    return {
      sourceFlag: localStorage.getItem('sourceFlag'),
      twFlag:localStorage.getItem('twFlag'),
      utm_source: localStorage.getItem('utm_source'),
    }
  },
  created(){
    let loading = document.getElementById('Loading')
    if(loading !== null){
     document.body.removeChild(loading)
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        let query = { ...this.$route.query}
        if(this.sourceFlag && this.sourceFlag != ''){
          query.sourceFlag = this.sourceFlag
        }
        if(this.utm_source && this.utm_source != ''){
          query.utm_source = this.utm_source
        }
        this.$router
          .replace({
            query: query,
            params: { ...this.$route.params },
          })
          .catch(() => {})
      },
      deep: true,
    },
  }
};
</script>
<style lang="scss">
@import './assets/css/theme.scss';
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  position: relative;
}
.pc {
  max-width: 100% !important;
}
#nav {
  padding: 30px;
}

aside {
  z-index: 999;
}
</style>
