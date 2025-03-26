<template>
   <Dialog :width="isPC ? '500px' : '90%'" ref="dialog" @close="closeDialog">
        <div class="Intercept" v-if="interceptData">
           <div class="img">
                <img src="../assets/img/Intercept.png" alt="">
           </div>
           <div class="address">
                {{ $t('interceptAddress') }}
           </div>
           <div class="address-text">
                {{ interceptData.address}}
                <svg class="icon wallet-icon" aria-hidden="true" @click="viewHandler">
                    <use xlink:href="#icon-select"></use>
                </svg>
           </div>
           <div class="draing">
                <div class="draing-text">
                    {{ $t('theaddress') }}
                    <span class="red">{{ $t('riskscore') }}</span>
                    {{ $t('riskscoreHigh') }}
                </div>
           </div>
           <div class="service">
            {{ $t('Anyquestions') }}
            <div class="ser" @click="openService">
                <img src="../assets/img/lxkf.png" alt="">
                {{ $t('support') }}
            </div>
           </div>
           <Button @click="confirmHandle" class="ok-btn">{{$t('ConfirmNFT')}}</Button>
        </div>
    </Dialog>
</template>

<script>
import Dialog from '@/components/common/dialog'
import { supportNetWork } from "../config/index";
import { Button } from 'vant'

export default {
    name: 'WidgetProInterceptDialog',
    props: ['interceptData'],
    data() {
        return {
            sourceFlag: localStorage.getItem('sourceFlag'),
            twFlag: localStorage.getItem('twFlag'),
        };
    },
    components: {
        Button,
        Dialog,
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
            serviceUrl() {
            //defi.swft.pro 全域名显示中文客服
            //首先判断此域名
            const urlStr = window.location.href
            if (urlStr.indexOf('defi.swft.pro') !== -1) {
                return 'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha'
            }
            //判断语言
            if (this.lang == 'zh' || this.lang == 'zht' || this.lang == 'korea') {
                if (this.twFlag == 'miningtw') {
                return 'https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=782460&uid=&customSource=miningtw'
                } else if (this.twFlag == 'burndex') {
                return 'https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=782460&uid=&customSource=stablexbridge'
                } else {
                return 'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha'
                }
            } else {
                return 'https://tawk.to/chat/6433ae444247f20fefeabe57/1gtku1fhl'
            }
        },
    },
    mounted() {
        
    },

    methods: {
        confirmHandle(){
            this.$parent.submitStatus = false
            this.$refs.dialog.show = false
        },
        closeDialog(){
            this.$parent.submitStatus = false
        },
        openService(){
            const url = this.serviceUrl
            window.open(url)
        },
        viewHandler() {
            const net = this.interceptData.mainNetwork == 'TRX' ? 'TRON' : this.interceptData.mainNetwork
            //浏览器查看
            const data = supportNetWork.find(
                (e) => net === e.netWork
            );
            if (!data) return;
            if (
                net === "TRON" ||
                net === "TRX" ||
                net === "OKExChain" ||
                net === "TT" ||
                net === "BSC" ||
                net === "ETH" ||
                net === "POLYGON" ||
                net === "ETHF" ||
                net === "ETHW" ||
                net === "ARB" ||
                net === "AVAXC" ||
                net === "FTM" ||
                net === "SOL" ||
                net === "HECO" ||
                net === "BTC" ||
                net === "LUNA" ||
                net === "ORC" ||
                net === "SGB" ||
                net === "HPB" ||
                net === "CRONOS" ||
                net === "AME" ||
                net === "ECH" ||
                net === "CUBE" ||
                net === "GNOSIS" ||
                net === "ETC" ||
                net === "KCC" ||
                net === "BRISE" ||
                net === "CELO" ||
                net === "Optimism" ||
                net === "DRAC" ||
                net === "KLAY" ||
                net === "FSC" ||
                net === "FRZ" ||
                net === "GRC30" ||
                net === "CORE" ||
                net === "DC" ||
                net === "MTR" ||
                net === "BTTC" ||
                net === "ZKSYNC" ||
                net === "CFX" ||
                net === "EOS(EVM)" ||
                net === "FVM" ||
                net === "SUI" ||
                net === "PulseChain" ||
                net === "LINEA" ||
                net === "PEGO" ||
                net === "opBNB" ||
                net === "OZO" ||
                net === "QITMEER" ||
                net === "PATEX" ||
                net === "ETRC20" ||
                net === "zkEVM" ||
                net === "SCROLL" ||
                net === "MNT" ||
                net === "BASE" ||
                net === "Metis" ||
                net === "Moonriver" ||
                net === "Manta" ||
                net === "CMEMO" ||
                net === "Blast" ||
                net === "Moonbeam"
                
            ) {
                window.open(data.blockExplorerUrls + "/address/" + this.interceptData.address);
            } else if (
                net === "CRU" ||
                net === "DBC" ||
                net === "Polkadot" ||
                net === "XRP" ||
                net === "EOS" ||
                net === "APT"
            ) {
                window.open(data.blockExplorerUrls + "/account/" + this.interceptData.address);
            } else if (net === "FIL") {
                window.open(data.blockExplorerUrls + this.interceptData.address);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.Intercept{
    text-align: left;
    .img{
        margin: 0 auto;
        text-align: center;
        img{
            width: 2.5rem;
        }
    }
    .address{
        margin-top: .15rem;
        font-size: .37rem;
        font-family: Poppins, Poppins;
        font-weight: bold;
        color: #000000;
    }
    .address-text{
        margin-top: .1rem;
        font-size: .296rem;
        font-family: Poppins, Poppins;
        font-weight: 600;
        color: #000000;
        word-break:break-all;
        svg{
            cursor: pointer;
            width: 13px;
            height: 15px;
            margin-left: 10px;
            vertical-align: middle;
        }
    }
    .draing{
        margin-top: .3rem;
        display: flex;
        width: 100%;
        background: #FFEAEA;
        border-radius: .2rem;
        opacity: 1;
        align-items: center;
        min-height: .85rem;
        padding: .14rem;
        box-sizing: border-box;
        .info{
            display: flex;
            align-items: center;
            height: .667rem;
            background: #FFFFFF;
            border-radius: .16rem;
            overflow: hidden;
            text-align: center;
            .f1{
                font-size: .3rem;
                font-family: Poppins, Poppins;
                font-weight: 600;
                color: #EA2929;
                padding: 0 .3rem;
            }
            .red{
                height: .667rem;
                background: #EA2929;
                font-size: .3rem;
                color: #FFFFFF;
                line-height: .667rem;
            }
        }
        .draing-text{
            flex: 1;
            padding-left: .2rem;
            font-size: .259rem;
            color: #020202;
            .red{
               color: #9F0000;
               font-weight: bold;
            }
        }
        
    }
    .service{
        margin-top: .3rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: .259rem;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #020202;
        .ser{
            padding: .1rem .2rem;
            background: #F0F6FF;
            border-radius: .2rem;     
            display: flex;
            align-items: center;
            margin-left: .2rem;
            cursor: pointer;
            img{
                width: .42rem;
                margin-right: .1rem;
            }
        }
    }
    .ok-btn{
            width: 100%;
            height: 1.2rem;
            line-height: 1.2rem;
            background: #000000;
            border-radius: .445rem;
            font-size: .37rem;
            border: none;
            cursor: pointer;
            margin-bottom: .2rem;
            margin-top: .6rem;
            color:#ffffff;
            font-size: .37rem;
            &[disabled] {
                color: white !important;
                background: #213148 !important;
                cursor: default;
            }
        }
}
</style>