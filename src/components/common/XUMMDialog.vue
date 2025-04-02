<template>
  <div>
    <Dialog ref="XUMMDialog" @close="closeDialog" :width="isPC ? '500px' : '90%'">
      <div class="qrcode">
        <div class="title">
          {{$t('useXumm')}}
        </div>
        <div class="qrcode-img" v-show="showStatus">
          <img :src="getQrcode" @load="loadHandle"/>
        </div>
        <div class="loading" v-show="!showStatus">
          <Loading color="#1989fa" />
        </div>
        <div class="info">{{ $t('xummscan') }}</div>
        <div class="jumpBtn" v-if="!isPC">
            <a :href="jumpXumm" target="_bank">
              {{ $t('openXumm') }}
            </a>  
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './dialog.vue'
import { Loading } from 'vant'
import { Toast } from 'vant'

export default {
    name:'XUMMDialog',
    data(){
        return{
          showStatus: false
        }
    },
    created(){

    },
    components: {
      Dialog,
      Loading,
    },
    computed: {
      getQrcode(){
        return this.$store.state.qrcode
      },
      jumpXumm(){
        return this.$store.state.qrcode ? this.$store.state.qrcode.split('_q.')[0] : ''
      },
    },
    methods:{
      show() {
       this.showStatus = false
        if(this.$store.state.qrcode){
          this.$refs.XUMMDialog.show = true
        }
        
      },
      dismiss() {
        this.$refs.XUMMDialog.show = false
      }, 
      closeDialog(){
        this.$parent.closeWebSocket()
        this.$parent.submitStatus = false
        this.$store.commit('setQRcode',null)
      }, 
      loadHandle(){
        this.showStatus = true
      },
      onCopySuccess(val) {
        Toast.success(this.$t('copy_success'))
      },
      onCopyError(val) {
      },
    }
}
</script>

<style lang="scss" scoped>
.qrcode{
 padding: 20px 0;
 .title{
  text-align: left;
  height: 25px;
  font-size: 18px;
  font-family: Poppins;
  color: #000000;
  line-height: 25px;
  font-weight: bold;
  }
  .qrcode-img{
    width: 80%;
    margin: 20px auto;
    background: #F4F8FF;
    border-radius: 34px;
    border: 10px solid #EBF3FF;
    padding: 20px;
    box-sizing: border-box;
    img{
      width: 100%;
    }
  }
  .loading{
    width: 80%;
    height: 300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info{
    height: 30px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0A4F93;
    line-height: 15px;
  }
  .jumpBtn {
      margin: 0px auto;
      margin-top: 15px;
      width: 3.2rem;
      background: #0A4F93;
      border-radius: 8px;
      cursor: pointer;
      height: 100%;
      line-height: 40px;
      border: 0px;
      a{
        font-size: 15px;
        color:#FFFFFF;
        font-family: Poppins;
      }      
    }
  /* .buttonView {
    margin: 0px auto;
    margin-top: 15px;
    width: 6rem;
    height: 40px;
    .jumpBtn {
      float: left;
      margin-left: 0px;
      width: 2.5rem;
      background: #0A4F93;
      border-radius: 8px;
      cursor: pointer;
      height: 100%;
      line-height: 40px;
      border: 0px;
      a{
        font-size: 15px;
        color:#FFFFFF;
        font-family: Poppins;
      }      
    }
    .copyBtn {
      float: right;
      width: 2.5rem;
      background: #0A4F93;
      border-radius: 8px;
      cursor: pointer;
      height: 100%;
      line-height: 40px;
      border: 0px;
      font-size: 15px;
      color:#FFFFFF;
      font-family: Poppins;
    }    
  }
  .xummTips {
    margin-top: 15px;
    height: 30px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 15px;
  } */
}
</style>>
