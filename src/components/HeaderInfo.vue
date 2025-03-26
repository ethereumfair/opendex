<template>
  <div class="headermax">
    <div v-if="isBanner == true" class="logo-info">
      <img
        :class="isPC ? 'imgInfoPC' : 'imgInfoM'"
        :src="headerInfo()"
        alt=""
      />
    </div>
    <div v-if="isAd == true" class="logo-banner" :class="isPC ? 'pc' : 'mb'">
      <img
      v-if="bannerList.length > 0 && bannerList[0].imgUrl != ''"
        @click="closeBanner"
        class="imgClose"
        src="../assets/img/close.png"
        alt=""
      />
      <div class="bannerDiv" :class="isBanner ? '' : 'margin'">
        <van-swipe
          class="my-swipe"
          :class="isPC ? 'pcmystyle' : 'mbmystyle'"
          :autoplay="5000"
          indicator-color="white"
        >
          <van-swipe-item v-for="(items, index) in bannerList" :key="index">
            <img
              :src="items.imgUrl"
              alt=""
              class="imgFee"
              :class="isPC ? 'pcFee' : 'mbFee'"
              @click="toWebUrl(items.clickUrl)"
            />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- <img
          v-if="lang != 'cn' && isBanner"
          class="imgFee"
          :class="isPC ? 'pcFee' : 'mbFee'"
          src="../assets/img/halfFee_banner_cn.png"
          alt=""
        /> -->
      <!-- <div class="imgFee" :class="isPC ? 'pcFee' : 'mbFee'" v-on:mouseover="stop()" v-on:mouseout="move()"  v-if="isBanner">
            <transition-group tag="ul" name="image">
                <li v-for="(items,index) in bannerList" v-show="index===num" :key="index"   >
                    <img :src="items" alt="">
                </li>
            </transition-group>
        </div> -->

      <!-- <img
          v-if="lang != 'en' && isBanner"
          class="imgFee"
          :class="isPC ? 'pcFee' : 'mbFee'"
          src="../assets/img/halfFee_banner_en.png"
          alt=""
        /> -->
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import baseApi from '../api/baseApi'
export default {
  name: 'HeaderInfo',
  data() {
    return {
      isBanner: false,
      isAd: false,
      time: '',
      num: 0,
      bannerList: '',
      bannerList_cn: [],
      bannerList_en: [],
      sourceFlag:localStorage.getItem('sourceFlag'),
      twFlag:localStorage.getItem('twFlag'),
    }
  },
  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.lang
      },
      set(val) {
        this.$store.commit('setLang', val)
      },
    },
  },
  created() {
    this.lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : ''
    this.getBannerImg()
    // this.play();
  },
  watch: {
    lang() {
      this.showImgLang()
    },
  },
  methods: {
    headerInfo(){
      if( this.sourceFlag == 'ShibaNFT'){
        return require('../assets/img/headerInfo-ShibaNFT.png')
      }
      if(this.twFlag == 'miningtw'){
        return require('../assets/img/headerInfo-miningtw.png')
      }
      return require('../assets/img/headerInfo-en.svg')
    },
    closeBanner() {
      this.isAd = false
    },
    // play(){
    //   this.time=setInterval(()=>{
    //       this.num++;
    //       if(this.num==3){
    //           this.num=0
    //       }

    //   },3000)
    //   },
    //   stop(){
    //       clearInterval(this.time)
    //   },
    //   move(){
    //       this.play();
    //   },
    showImgLang() {
      if (this.lang == 'en' || this.lang == 'korea') {
        this.bannerList = this.bannerList_en
      } else {
        this.bannerList = this.bannerList_cn
      }
    },
    toWebUrl(url){
      if(url != ''){
        window.open(url)
      }
      return
    },
    getBannerImg(){
      const params = {
        sourceFlag: this.sourceFlag,
      }
      baseApi.widgetBannerImg(params).then((res) => {
        if (res.resCode == '800') {
          if(res.data.cn && res.data.en){
            this.isAd = true;
            this.isBanner = true;
            this.bannerList_cn = res.data.cn;
            this.bannerList_en = res.data.en;
            this.showImgLang()
          } 
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.headermax{
  margin-top: 18px;
  // display: grid;
  :deep(.van-swipe__indicators) {
    bottom: 2px !important;
  }
}
.logo-info {
  .imgInfoPC {
    width: 400px;
  }
  .imgInfoM {
    width: 99%;
  }
}
.logo-banner {
  margin: 0 auto;
  position: relative;
  width: 10rem;
  img {
    display: block;
    margin: 0 auto;
  }
  .bannerDiv {
    height: auto;
    &.margin{
      margin-top: .9rem;
    }
  }
  .pcmystyle {
    margin-top: -50px;
  }
  .mbmystyle {
    margin-top: -30px;
  }
  &.pc {
    width: 540px;
  }
  &.mb {
    width: 95%;
  }
  .imgFee {
    &.pcFee {
      width: 540px;
      // margin-top: -50px;
    }
    &.mbFee {
      width: 99%;
      // margin-top: -30px;
    }
  }
  .imgClose {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 10px;
    top: 0.1rem;
    z-index: 10;
    // &.pc {
    //   top: 7px;

    // }
    // &.mb {
    //   top: 2px;
    //   z-index: 10;
    // }
  }
}

</style>
