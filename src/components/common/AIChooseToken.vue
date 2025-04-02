<template>
    <div>
    <DialogContent
      :width="isPC ? '500px' : '90%'"
      ref="dialogAIChooseToken"
      @close="dialogClose"

    >
     <div v-if="tokenData">
        <img class="ai-img" src="../../assets/img/ai-dialog.svg" alt="">
        <div class="aiTip">
            <div class="ai">AI</div>
            <div class="text">
                {{ $t('aiTips') }}
            </div>
        </div>
        <div class="token-content">
            <div class="token">
                <img :src="'https://transfer.swft.pro/swft-v3/images/coins/' + tokenData.from.coinCode + '.png'" alt="">
                <div>{{ tokenData.from.coinCodeShow }}</div>
            </div>
            <svg
            t="1623380158754"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1319"
            width="200"
            height="200"
            >
            <path
                d="M955.574857 505.947429c-1.993143 145.627429-27.282286 266.203429-101.229714 338.102857-71.917714 73.947429-192.493714 99.236571-338.102857 101.229714-145.627429-1.993143-266.203429-27.282286-338.121143-101.229714-73.947429-71.899429-99.236571-192.475429-101.229714-338.102857 2.011429-145.627429 27.282286-266.203429 101.229714-338.102858 71.917714-73.947429 192.493714-99.254857 338.102857-101.248 145.627429 2.011429 266.203429 27.300571 338.121143 101.229715 73.947429 71.917714 99.236571 192.493714 101.229714 338.121143z"
                fill="#F8FBFF"
                p-id="1320"
            ></path>
            <path
                d="M438.528 358.089143v-82.779429s0.237714-4.352-8.301714-6.4c-7.021714-1.554286-13.805714 3.328-13.805715 3.328-3.017143 2.304-142.884571 103.533714-142.884571 103.533715s-13.293714 6.930286-13.293714 20.772571c0 13.330286 9.526857 18.962286 9.526857 18.962286l143.634286 100.717714s9.051429 3.346286 16.822857 1.810286c8.301714-1.810286 8.301714-7.954286 8.301714-7.954286v-77.659429h139.849143s110.244571 15.122286 110.244571 56.905143c0 0-1.755429-131.236571-113.737143-131.236571h-136.356571z"
                fill="#000000"
                p-id="1321"
            ></path>
            <path
                d="M581.394286 691.547429v82.779428s1.517714 5.12 10.550857 6.144c6.034286 0.768 9.801143-2.304 11.044571-3.328 3.017143-2.048 143.140571-103.533714 143.140572-103.533714s13.312-6.930286 13.312-20.772572c0-13.586286-9.545143-18.962286-9.545143-18.962285l-143.890286-100.717715s-6.034286-3.602286-14.061714-1.554285c-10.057143 2.56-10.550857 7.954286-10.550857 7.954285v77.403429h-140.617143s-110.226286-15.122286-110.226286-56.905143c0 0 1.755429 131.236571 113.993143 131.236572l136.850286 0.256z"
                fill="#0A4F93"
                p-id="1322"
            ></path>
            </svg>
            <div class="token">
                <img :src="'https://transfer.swft.pro/swft-v3/images/coins/' + tokenData.to.coinCode + '.png'" alt="">
                <div>{{ tokenData.to.coinCodeShow }}</div>
            </div>
        </div>
        <div class="btn-group">
            <button @click="submit" class="sure">{{ $t('ConfirmNFT') }}</button>
            <button @click="cancel" class="cancel">{{ $t('btnCancel') }}</button>
        </div>
     </div>
    </DialogContent>
    </div>
</template>

<script>
import DialogContent from './dialog'

export default {
    name: 'WidgetProAIChooseToken',
    props:['tokenData'],
    data() {
        return {
            show: false
        };
    },
    watch:{
        show(a){
            this.$refs.dialogAIChooseToken.show = a
        }
    },
    components:{
        DialogContent
    },
    computed:{
        fromToken: {
            get() {
                if (this.tabActive == 'bridge') {
                return this.bridgeFromTokenchain
                }
                return this.$store.state.fromToken
            },
            set(val) {
                this.$store.commit('setFromToken', val)
            },
        },
        toToken: {
            get() {
                if (this.tabActive == 'bridge') {
                return this.bridgeToTokenchain
                }
                return this.$store.state.toToken
            },
            set(val) {
                this.$store.commit('setToToken', val)
            },
        },
    },
    mounted() {
        
    },

    methods: {
        dialogClose(){
            this.show = false
        },
        submit(){
            this.fromToken = this.tokenData.from
            this.toToken = this.tokenData.to
            this.cancel()
        },
        cancel(){
            this.$refs.dialogAIChooseToken.show = false
            this.dialogClose()
        }
    },
};
</script>

<style lang="scss" scoped>
.ai-img{
    width: 3rem;
}
.aiTip{
    width: 100%;
    background: #F2F8FF;
    border-radius: .2rem;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .2rem;
    box-sizing: border-box;
    text-align: left;
    .ai{
        width: .9rem;
        height: .667rem;
        background: #0A4F93;
        border-radius: .2rem;
        opacity: 1;
        text-align: center;
        line-height: .667rem;
        font-size: .44rem;
        font-family: Poppins-Bold, Poppins;
        font-weight: bold;
        color: #FFFFFF;
        box-sizing: border-box;
    }
    .text{
        flex: 1;
        font-size: .259rem;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #000000;
        padding-left: .2rem;
    }
}
.token-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.5rem;
    .icon{
        width: .6rem;
        height: .6rem;
        margin: 0 .3rem;
    }
    .token{
        flex:1;
        width: 3.33rem;
        height: 1.05rem;
        background: #F7F8FA;
        border-radius: .26rem;
        opacity: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .296rem;
        font-family: Poppins-Bold, Poppins;
        font-weight: bold;
        color: #000000;
        &>div{
            width: 2rem;
            height: .5rem;
            line-height: .5rem;
            white-space:nowrap;
            overflow: hidden;
        }
        img{
            width: .66rem;
            height: .66rem;
            border-radius: .66rem;
            margin-right: .1rem;
        }
    }
}
.btn-group{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .sure{
        width: 4rem;
        height: 1.11rem;
        background: #0A4F93;
        opacity: 1;
        border: 1px solid #0A4F93;
        border-radius: .3rem;
        font-size: .296rem;
        font-family: Poppins-Bold, Poppins;
        font-weight: bold;
        color: #FFFFFF;
    }
    .cancel{
        width: 4rem;
        height: 1.11rem;
        background: #FFFFFF;
        opacity: 1;
        border: 1px solid #0A4F93;
        border-radius: .3rem;
        font-size: .296rem;
        font-family: Poppins-Bold, Poppins;
        font-weight: bold;
        color: #0A4F93;
    }
}
</style>