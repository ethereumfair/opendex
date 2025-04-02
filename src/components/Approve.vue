<!-- 授权 -->
<template>
    <Dialog ref="dialog" @close="closeDialog">
        <div>
           <div class="top" v-if="fromToken">
               <img class="coinimg" :src="'https://transfer.swft.pro/swft-v3/images/coins/' + fromToken.coinCode +'.png'" alt="">
               <div class="coinname">
                   Approve {{fromToken.coinCode}}
               </div>
           </div>
           <div class="info-text">
               {{$t('approve')}}
           </div>
           <div>
               <Button @click="approveHandle" :loading="loading" :loading-text="$t('approveText')" class="approve-btn">{{$t('approveText')}}</Button>
           </div>
            <div class="closeIcon">
                <svg @click.stop="closeOrderDialog" class="icon close-icon" aria-hidden="true">
                     <use xlink:href="#icon-cha1"></use>
                </svg>
           </div>
        </div>
    </Dialog>
</template>

<script>
import Dialog from '@/components/common/dialog'
import { Button } from 'vant'
export default {
    name:'Approve',
    data() {
        return {
            loading:false,
        }
    },
    components: {
        Dialog,
        Button
    },
    computed: {
        tabActive: {
        get() {
            return this.$store.state.tabActive
        },
        },
        bridgeFromTokenchain:{ // from 网络
            get(){
                return this.$store.state.bridgeFromTokenchain
            },
            set(val){
                this.$store.commit('setBridgeFromTokenchain', val)
            }
            
        },
        fromToken: {
            get() {
                if(this.tabActive == 'bridge'){
                    return this.bridgeFromTokenchain
                }
                return this.$store.state.fromToken
            },
            set(val) {
                this.$store.commit('setFromToken', val)
            },
        },
    },
    methods:{
        approveHandle(){
            this.loading = true
            this.$emit('approve')
        },
        closeDialog(){
            if(this.loading){
               return  this.loading = false
            }
            this.loading = false
            this.$parent.submitStatus = false
        },
        closeOrderDialog() {
            this.closeDialog()
            this.$refs.dialog.show = false
        },
    }
}
</script>

<style lang="scss" scoped>
.top{
    padding: 1rem 0 .6rem;
}
.coinimg{
    width: 1.55rem;
    height: 1.55rem;
}
.coinname{
    font-size: .333rem;
    font-family: Poppins;
}
.info-text{
    font-size: .296rem;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #AAB0C8;
    margin: .4rem 0;
}
.approve-btn{
  width: 100%;
  height: 55px;
  line-height: 55px;
  background: #0A4F93;
  border-radius: .445rem;
  font-size: .37rem;
  border: none;
  cursor: pointer;
  margin-bottom: .4rem;
  margin-top: .8rem;
  color:#ffffff;
  font-size: .37rem;
  &[disabled] {
    color: white !important;
    background: #213148 !important;
    cursor: default;
  }
}
.closeIcon {
  position: absolute;
  top: 0.5rem;
  right:0.5rem;
  .close-icon{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>