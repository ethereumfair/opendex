<template>
    <div class="service-dialog" :class="isPC ? '' : 'mb'">
        <div class="top-title">
            <img @click="closeAIServiceDialog" class="close-AI" src="../../assets/img/close-AI.png" alt="">
            <div class="tabBox">
                <div class="itemTab" @click="openServiceDialog">
                    <img class="dialogImg_ser" src="../../assets/img/service_blue.png"/>
                    <div>{{$t('support')}}</div>
                </div>
                <div class="itemTab activeTab">
                    <img class="dialogImg_ser" src="../../assets/img/chatbot_white.jpg"/>
                    <div>Chatbot</div>
                </div>
            </div>
        </div>
        <div class="content" ref="chatContent">
            <div class="chat-list">
                <div class="answer">
                    <img src="../../assets/img/chatbot.png" alt="">
                    <div class="text-content">
                        <div class="inner">
                           {{ $t('chatBotWellcome') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-list" v-for="(item,index) in chatList" :key="index" :class="item.role == 'user' ? 'right-content' : ''">
                <div v-if="item.role == 'user'" class="question">
                    <div class="text-content">
                        <div class="inner">
                            {{item.content}}
                        </div>
                    </div>
                    <img src="../../assets/img/user.png" alt="">
                </div>
                <div v-if="item.role == 'assistant'" class="answer">
                    <img src="../../assets/img/chatbot.png" alt="">
                    <div class="text-content">
                        <div class="inner">
                            {{item.content}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-list" v-if="loading">
                <div class="answer">
                    <img src="../../assets/img/chatbot.png" alt="">
                    <div class="text-content">
                        <div class="inner">
                            <div v-if="step == 1" class="three-bounce"><div class="one"></div><div class="two"></div><div class="three"></div></div>
                            <TextComponents ref="TextComponents" @onComplete="onComplete"  v-if="step == 2" :text="showText" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-input">
            <button class="stop" v-if="loading && step == 2" @click="stop">
                <img src="../../assets/img/stop.png" alt="">
                {{ $t('stopGenerating') }}
            </button>
            <button class="regenerateResponse" v-if="!loading && step == 3" @click="regenerateResponse">
                <img src="../../assets/img/repeat.png" alt="">
                {{ $t('regenerateResponse') }}
            </button>
            <input class="input" :placeholder="$t('enterWord')" v-model="question" type="text" v-on:keyup.enter="send">
            <button class="send themeBg" @click="send">
                <img src="../../assets/img/iconsend.png" alt="">
            </button>
        </div>
    </div>
</template>

<script>
import baseApi from '../../api/baseApi'
import TextComponents from './TextComponents'
export default {
    name: 'WidgetServiceDialog',

    data() {
        return {
            question:'', // 用户的问题
            chatList: JSON.parse(localStorage.getItem('chatGptList')) || [], // 问题以及回答列表
            loading: false, // 请求加载的状态
            step: '1', //加载过程中的状态， 1 代表正在跟后台请求中， 2 代表 正在显示文字中 3 代表文字显示完毕或者用户中断回答
            showText: '', // 回答的文本
            sourceFlag: localStorage.getItem('sourceFlag'),
            twFlag: localStorage.getItem('twFlag'),
        };
    },
    components:{
        TextComponents
    },
    computed:{
        lang: {
            get() {
                return this.$store.state.lang
            },
            set(val) {
                this.$store.commit('setLang', val)
            },
        },
    },
    mounted() {
        const self = this
        this.randomWord()
        setTimeout(() => {
                self.scrollToBottom() 
            },100)
    },
    watch:{
       'chatList.length'(){
        localStorage.setItem('chatGptList',JSON.stringify(this.chatList))
       }
    },
    methods: {
        randomWord() {
            let str = '',
            arr = [
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
            ]
            for (let i = 0; i < 32; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1))
            str += arr[pos]
            }
            const randomWordText = localStorage.getItem('randomWord')
            if(!randomWordText || randomWordText== ''){
                localStorage.setItem('randomWord',str)
            }
        },
        async mpcbot(data){
            this.loading = true
            this.step = 1
            if(data){
                this.chatList.push(data)
            }
            try{
                const result = await baseApi.mpcbot({
                    content: this.chatList,
                    outer_user_id: localStorage.getItem('randomWord'),
                })
                if(result.resCode == 800 && result.data.length > 0){
                    this.showText = result.data[0].content
                    this.step = 2
                }else{
                    this.loading = false
                    this.step = 3
                }
            }catch(err){
                this.loading = false
                this.step = 3
            }
        },
        async send(){
            const self = this
            if(self.loading || this.question == ''){
                 return
            }
            const chat = {
                role: 'user',
                content:this.question,
            }
            self.chatList.push(chat)
            self.question = ''
            self.mpcbot()
            setTimeout(() => {
                self.scrollToBottom() 
            },500)
        },
        //文字展示完成的回调
        onComplete(text){
            const self = this
            const chat = {
                role: 'assistant',
                content:text,
            }
            self.chatList.push(chat)
            self.loading = false
            setTimeout(() => {
                self.step = 3
            },100)
        },
        // 保持滚动条在最底部
        scrollToBottom() {
            var element = this.$refs.chatContent;
            element.scrollTop = element.scrollHeight;
        },
        // 重新响应
        regenerateResponse(){
            const userList = this.chatList.filter( item => item.role == 'user')
            const data = {
                role: 'user',
                content: userList[userList.length - 1].content
            }
            this.mpcbot(data)
            const self = this
            setTimeout(() => {
                self.scrollToBottom() 
            },500)
        },
        //停止响应
        stop(){
            this.$refs.TextComponents.stop()
        },
        closeAIServiceDialog(){
            this.$emit('closeAIServiceDialog')
        },
        openServiceDialog() {
            this.$emit('openServiceDialog')
        },
    },
};
</script>

<style lang="scss" scoped>
.service-dialog{
    width: 100%;
    width: 450px;
    height: 80vh;
    position: fixed;
    bottom: calc(20px + 1rem);
    right: 25px;
    z-index: 90;
    background: #FFFFFF;
    border-radius: .5rem;
    opacity: 1;
    border: 1px solid #E2E2E2;
    box-sizing: border-box;
    padding: .8rem .3rem .3rem .3rem;
    display: flex;
    flex-direction: column;
   
    &.mb{
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        border-radius: 0;
    }
    .top-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: .2rem;
        position: relative;
        .close-AI{
            width: .45rem;
            position: absolute;
            right: 0;
            top: -.6rem;
            cursor: pointer;
        }
        // .left{
        //     font-size: .4rem;
        //     font-family: Poppins-SemiBold, Poppins;
        //     font-weight: 600;
        //     color: #000000;
        // }
        // .right{
        //     display: flex;
        //     align-items: center;
        //     height: .8rem;
        //     padding: 0 .2rem;
        //     background: #F4F8FF;
        //     border-radius: .8rem;
        //     opacity: 1;
        //     cursor: pointer;
        //     font-size: .25rem;
        //     font-family: Poppins-SemiBold, Poppins;
        //     font-weight: 600;
        //     color: #050505;
        //     .service-img{
        //         width: .6rem;
        //         margin-right: .1rem;
        //     }
        // }
        .tabBox{
            display: flex;
            // width: 60%;
            margin: 0 auto;
            justify-content: space-around;
            align-items: center;
            background: #F5F5F5;
            border-radius: 66px;
            opacity: 1;
            border: 1px solid #EDEDED;
            padding: 5px;
            color: #7D7D7D;
            font-weight: bold;
            .itemTab{
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                padding: 7px;
                font-size: .32rem;
                white-space: nowrap;
                cursor: pointer;
                &.activeTab{
                    background: #0066FF;
                    color: #fff;
                    border-radius: 57px;
                }
                img{
                    width: 28px;
                    height: 28px;
                    margin-right: 10px;
                    border-radius: 50%;
                }
            }
        }
    }
    .content{
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
        padding: .2rem 0 1.3rem;
        .chat-list{
            text-align: left;
            display: flex;
            margin-top: .3rem;
           &.right-content{
            justify-content: flex-end;
           }
            .question,.answer{
                display: flex;
                width: calc(100% - 1rem);
                img{
                    width: .8rem;
                    height: .8rem;
                }
               .text-content{
                    flex: 1;
                    min-height: 1rem;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    .inner{
                        padding: .2rem;
                        font-size: 14px;
                        font-family: Poppins-Regular, Poppins;
                        font-weight: 400;
                    }
                }
            }
            .question{
                .text-content{
                    justify-content: flex-end;
                    .inner{
                        margin-right: .1rem;
                        background: #277FFA;
                        border-radius: .25rem .1rem  .25rem  .25rem;
                        color: #FFFFFF;
                    }
                }
               
            }
            .answer{
                .text-content{
                   .inner{
                    margin-left: .1rem;
                    background: #F4F8FF;
                    border-radius:  .1rem  .25rem  .25rem .25rem;
                   }
                }
            }
        }
      
    }
    .bottom-input{
        position: relative;
        padding-top: .2rem;
        .input{
            width: 100%;
            height: 1rem;
            background: #FFFFFF;
            opacity: 1;
            border: 1px solid #E2E2E2;
            border-radius: .2rem;
            box-sizing: border-box;
            padding: 0 2rem 0 .2rem;
            font-size: 0.3rem;
            font-family: Poppins-Regular, Poppins;
            &::placeholder {
                font-family: Poppins-Regular, Poppins;
            }
        }
        .stop,.regenerateResponse{
            border: 1px solid #277FFA;
            border-radius: .1rem;
            background: #FFFFFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            height: .7rem;
            font-size: .26rem;
            font-family: Poppins-Regular, Poppins;
            font-weight: 400;
            color: #277FFA;
            position: absolute;
            bottom: .9rem;
            left: 50%;
            transform: translate(-50%, -50%);
            img{
                width: .4rem;
                height: .4rem;
                margin-right: .1rem;
            }
        }
        .send{
            position: absolute;
            right: .2rem;
            top: .3rem;
            width: 1.6rem;
            height: .8rem;
            border: none;
            cursor: pointer;
            border-radius: .1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            img{
                width: .6rem;
            }
        }
    }
}
</style>
<style>
.three-bounce {
    text-align: left;
    display: flex;
    align-items: center;
}
.three-bounce .one {
    -webkit-animation-delay: -.32s;
    animation-delay: -.32s;
}
.three-bounce .two {
    -webkit-animation-delay: -.16s;
    animation-delay: -.16s;
}
.three-bounce>div {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 100%;
    top: 50%;
    background: #aeadba;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

@keyframes bouncedelay {
    0%,100%,80% {
        transform: scale(0);
        -webkit-transform: scale(0)
    }

    40% {
        transform: scale(1);
        -webkit-transform: scale(1)
    }
}
</style>