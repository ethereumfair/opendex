<template>
  <div>
    <Dialog @close="closeHandle" :width="isPC ? '500px' : '90%'" ref="dialogSlidingPoint">
      <div>
        <div class="title">
          {{$t('slippage')}}
        </div>
        <div class="sliding-info">
          {{$t('slidingInfo')}}
        </div>
        <div class="sliding-content">
          <div class="input"><input @click="changeSlidingPoint(1)" :class="slidingPoint == 1 ? 'active' : ''" value="1 %" readonly /></div>
          <div class="input"><input @click="changeSlidingPoint(2)" :class="slidingPoint == 2 ? 'active' : ''" value="2 %" readonly /></div>
          <div class="input"><input @click="changeSlidingPoint(5)" :class="slidingPoint == 5 ? 'active' : ''" value="5 %" readonly /></div>
          <div class="input"><input class="input1" @focus="inputFocus" :placeholder="$t('customize')" :class="slidingPoint != 1 && slidingPoint != 2 && slidingPoint != 5 ? 'active' : ''" v-model="inputslidingPoint"/> %</div>
        </div>
        <div class="error-info">
          <span v-if="slidingPoint >= 10 && slidingPoint <= 10">*{{$t('slippageTip1')}}</span>
          <span v-if="slidingPoint > 15">*{{$t('slippageTip2')}}</span>
          <span v-if="slidingPoint <= 0">*{{$t('slippageTip3')}}</span>
          <span v-if="slidingPoint >0 && slidingPoint < 1">*{{$t('slippageTip4')}}</span>
        </div>
        <div class="closeIcon">
          <img @click="closeOrderDialog" src="../../assets/img/close.png" alt="" />
        </div>
      </div>

    </Dialog>
  </div>
</template>

<script>
import Dialog from './dialog'
export default {
  components: { Dialog },
  data() {
    return {
      inputslidingPoint:''
    }
  },
  props: {
    
  },
  computed: {
    slidingPoint:{
      get(){
        return this.$store.state.slidingPoint
      },
      set(val){
        this.$store.state.slidingPoint = val
      }
    }
  },
  watch: {
    inputslidingPoint(val){
      this.slidingPoint = val
    }
  },
  methods: {
    inputFocus(){
      this.slidingPoint = this.inputslidingPoint
    },
    closeOrderDialog() {
      this.closeHandle()
      this.$refs.dialogSlidingPoint.show = false
    },
    changeSlidingPoint(val){
      this.slidingPoint = val
    },
    closeHandle(){
      if(this.slidingPoint == 0){
        this.slidingPoint = 1
      }
      if(this.slidingPoint >= 50){
        this.slidingPoint = 15
      }
    }
  },
  created() {
  },
  mounted() {
    
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {
  }, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
.title{
  font-size: .4rem;
  font-family: Poppins;
  color: #000000;
  text-align: left;
  font-weight: bold;
  margin-bottom: .2rem;
}
.sliding-info{
  text-align: left;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #999999;
  margin-bottom: .2rem;
}
.sliding-content{
  display: flex;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #999999;
  margin-bottom: .5rem;
  font-size: .29rem;
  .input{
    color:#000000;
    margin-right: .4rem;
    display: flex;
    align-items: center;
    input{
      cursor: pointer;
      width:1.4rem;
      height: .7rem;
      box-sizing: border-box;
      text-align: center;
      border:1px solid #F1F3F5;
      background: #F1F3F5;
      border-radius: .12rem;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: #B8BFCF;
      &.input1{
        width:1.9rem;
      }
      &.active{
        background: #F0F7FF;
        border-radius: 7px;
        border: 1px solid #6FA9FF;
        color:#0068FF;
      }
    }
  }
}
.error-info{
  color:#ad0000;
  text-align: left;
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  margin-bottom: .5rem;
}
.closeIcon {
  width: calc(100% - 32px);
  height: 0.74rem;
  position: absolute;
  bottom: -0.925rem;
  img {
    width: 0.925rem;
    height: 0.925rem;
    cursor: pointer;
  }
}
</style>
