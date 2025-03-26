<!-- 出售 -->
<template>
    <div>
        <Dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="$t('Deposit')"
            :visible.sync="show"
            :before-close="handleClose"
            class="staking"
            top="10vh"
            width="95%">
            <div class="content" v-if="item">
                <div class="list-info">
                   <div class="icon">
                    <img src="../assets/img/tronicon.svg" alt="">
                    <div class="text">{{ item.coinCode }}</div>
                   </div>
                </div>
                <div class="list-info">
                    <div class="qixian">
                        {{ $t('ChooseLockupDuration') }}
                        <div class="type-list">
                            <div class="list border">{{ item.redemptionDays }}{{ $t('day') }}</div>
                        </div>
                    </div>
                </div>
                <div class="list-info">
                    <div>
                        <div class="title">{{ $t('Annualized') }}</div>
                        <div class="nh">
                            {{ (item.interestRate*360*100).toFixed(2) - 0 }}%
                        </div>
                    </div>
                </div>
                <div class="list-info">
                    <div class="title">
                        {{ $t('accountBalance') }}
                    </div>
                    <div class="text">
                        {{ getBalance }} TRX
                    </div>
                </div>
                <div class="list-info">
                    <div class="title">
                        {{ $t('Expiretime') }}
                    </div>
                    <div class="text">
                        {{ getFinishDay(item.redemptionDays) }}
                    </div>
                </div>
                <div class="list-info">
                    <Input v-model="number" :placeholder="$t('sellNum',{min: item.minDepositAmt,max: item.maxDepositAmt})"  @input="validateNumberInput">
                        <span slot="suffix" @click="getMaxNumber" class="max">{{ $t('max') }}</span>
                    </Input>
                    <div class="tip" v-if="showTips">{{ $t('sellNum',{min: item.minDepositAmt,max: item.maxDepositAmt}) }}</div>
                </div>
                <div class="list-info">
                    <div class="auto-box">
                        <div class="auto">
                            <div class="left-info-text">
                                {{ $t('automaticrenewal') }}
                                <Tooltip popper-class="popper-item" style="cursor: pointer;" effect="dark" :content="$t('automaticrenewalTips')" placement="top-start">
                                    <i class="el-icon-warning-outline"></i>
                                </Tooltip>
                            </div>
                            <div class="right-icon">
                                <el-switch v-model="showAuto" active-color="#0075FF">
                                </el-switch>
                            </div>
                        </div>
                        <div class="auto-info" v-if="showAuto">
                            <div class="auto-list">
                                <div class="list" v-for="(m,n) in autoList" :key="n" :class="activeDays == m ? 'active' : ''" @click="chooseDays(m)">
                                    {{ $t('daysTips',{
                                        num: m
                                    }) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-info">
                    <Button :loading="loading" class="button" @click="submit">
                        {{ $t('Deposit') }}
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { Dialog, Button, Input, Tooltip,Switch } from 'element-ui'
import baseApi from '../api/baseApi'

import BigNumber from 'bignumber.js'
import { Notify } from "vant";

export default {
    name: 'TronLeaseWebSellDialog',
    props:['stakingDialogStatus','stakingItem','autoList'],
    data() {
        return {
            show: this.stakingDialogStatus,
            number: '',
            item: null,
            tronInfo: null,
            loading: false,
            showAuto: false, // 展示自动续存
            activeDays: '',
        };
    },
    components:{
        Dialog,Button,Input,Tooltip,
        'el-switch': Switch
    },
    watch:{
        'stakingDialogStatus'(a){
            this.show = a
            this.number = ''
            this.item = this.stakingItem
            this.getTronInfo()
        },
        'showAuto'(val){
            if(val){
                if(this.activeDays == ''){
                    this.activeDays = this.autoList[0]
                }
            }
        }
    },
    computed:{
        address(){
            return this.$store.state.walletTRON;
        },
        getBalance(){
            if(!this.tronInfo) return '--'
            const balance = new BigNumber( this.tronInfo.balance)
                  .shiftedBy(
                    -(6),
                  )
                  .toFixed(2, BigNumber.ROUND_DOWN)
            this.$store.commit('setBalance', balance)
            return balance - 0
        },
        showTips(){
            return ((Number(this.number) < Number(this.item.minDepositAmt) || Number(this.number) > Number(this.item.maxDepositAmt)) && this.number != '' )
        },
    },
    mounted() {
        
    },

    methods: {
         //选择续存天数
         chooseDays(days){
            this.activeDays = days
        },
        //获取最大值
        getMaxNumber(){
            if(Number(this.getBalance) > Number(this.item.maxDepositAmt)){
                this.number = this.item.maxDepositAmt
            }else{
                this.number = Math.floor(this.getBalance - 1)
            }
        },
        //质押
        async submit(){
            if(Number(this.number) > this.getBalance){
                Notify({
                    message: this.$t("insufficient",{
                        coin: 'TRX'
                    }),
                    color: "#ad0000",
                    background: "#ffe1e1",
                });
                return 
            }
            if(Number(this.number) == 0 || Number(this.number) == ''){
                Notify({
                    message: this.$t("enterNumber"),
                    color: "#ad0000",
                    background: "#ffe1e1",
                });
                return
            }
            this.loading = true
            baseApi.pledge({
                "userAddress":this.address,
                "depositCoinAmt": this.number*1000000,
                "depositCoinCode":this.item.coinCode,
                "configId":this.item.id,
                "renewalDays": this.showAuto ? this.activeDays : 0,
            }).then( res => {
                if(res.resCode == '800'){
                    this.signTron(res.data)
                }else{
                    this.loading = false
                    Notify({
                        message: this.$t(res.resCode),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
                }
            })
        },
        async signTron(response){
            const self = this
            const tronWeb = window.tronWeb
           
            let signedTx
            try {
                let parameter = response.parameter
                let options = response.options
                const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                    response.tronRouterAddress,
                    response.functionName,
                    options,
                    parameter,
                    response.fromAddress,
                )
                signedTx = await tronWeb.trx.sign(transaction.transaction)
            } catch(error) {
                this.loading = false
                console.log(error)
                Notify({
                        message: this.$t('cancelExchange'),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
                return
            }
            tronWeb.trx.sendRawTransaction(signedTx)
            .then((broastTx) => {
                setTimeout(() => {
                    self.addsSwapTransData({ hash: broastTx.txid,response: response })
                },2000)
            })
            .catch((error) => {
                this.loading = false
                Notify({
                        message: this.$t('cancelExchange'),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
            })
        },
        addsSwapTransData(data){
            baseApi.addOrder({
                    "userAddress":this.address,
                    "toAddress":data.response.to,
                    "depositCoinAmt":this.number,
                    "depositCoinCode":this.item.coinCode,
                    "hash":data.hash,
                    "configId": this.item.id
                }).then( res => {
                    if(res.resCode == 800){
                        this.loading = false
                        this.$emit('stakingSuccess',data.hash)
                        this.show = false
                        this.$emit('closetDialogStatus','stakingDialogStatus')
                    }else{
                        this.loading = false
                        this.$emit('stakingFail',data.hash)
                        this.show = false
                        this.$emit('closetDialogStatus','stakingDialogStatus')
                    }
                })
        },
        validateNumberInput() {
            // 使用正则表达式验证输入是否为数字或浮点数
            this.number = this.number.replace(/[^0-9.]|(\..*)\./g, '$1')
        },
        //获取结束日期
        getFinishDay(n){
            var today = new Date();
            var futureDate = new Date(today);
            futureDate.setDate(today.getDate() + Number(n));

            var formattedDate = futureDate.getFullYear() + '-' + 
                                String(futureDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(futureDate.getDate()).padStart(2, '0');

            return formattedDate
        },
        async getTronInfo(){
            try{
                const info = await baseApi.getTronInfo({address: this.address})
                if(info.bandwidth){
                    this.tronInfo = info
                }
            }catch(err){

            }
        },
        handleClose(done){
            done()
            this.show = false
            this.$emit('closetDialogStatus','stakingDialogStatus')
        },
    },
};
</script>

<style lang="scss" scoped>
.content{
    margin-top: -10px;
    width: 100%;
    .list-info{
        width: 100%;
        background: #FFFFFF;
        border-radius: .15rem;
        opacity: 1;
        font-size: .26rem;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #000000;
        margin-top: .35rem;
        .tip{
            margin-top: .2rem;
            color: #FF1F00;
        }
        &:first-child{
            margin-top: 0;
        }
        display: flex;
        flex-wrap: wrap;
        .icon{
            height: .76rem;
            display: flex;
            align-items: center;
            background: #F6F7FA;
            border-radius: 100px;
            padding: 0 .3rem 0 0;
            img{
                height: 100%;
            }
            .text{
                font-size: .296rem;
                font-family: Poppins, Poppins;
                font-weight: bold;
                color: #000000;
                margin-left: .2rem;
            }
        }
        .qixian{
            display: flex;
            align-items: center;
            .type-list{
                display: flex;
                flex-wrap: wrap;
                .list{
                    height: 28px;
                    line-height: 28px;
                    padding: 0 .2rem;
                    background: #FFFFFF;
                    border-radius: 5px 5px 5px 5px;
                    opacity: 1;
                    border: 1px solid #E9E9E9;
                    font-size: 14px;
                    font-family: Poppins, Poppins;
                    font-weight: 400;
                    color: #BABABA;
                    margin-left: .5rem;
                    cursor: pointer;
                    &.border{
                        border: 1px solid #FF1F00;
                        color: #FF1F00;
                    }
                }
            }
        }
        .title{
            font-size: .259rem;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #73787B;
        }
        .text{
            font-size: .259rem;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #000000;
            flex: 1;
            text-align: right;
        }
        .nh{
            margin-top: .2rem;
            font-size: .4444rem;
            font-family: Poppins, Poppins;
            font-weight: 600;
            color: #FF1F00;
        }
        .max{
            height: 100%;
            display: flex;
            align-items: center;
            padding-right: 10px;
            font-size: .259rem;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #0075FF;
            cursor: pointer;
        }
        .button{
            width: 100%;
            margin-top: 0.5rem;
            height: 1.2rem;
            text-align: center;
            background: #0075FF;
            border-radius: 0.259rem;
            font-size: 0.3rem;
            font-family: Poppins, Poppins;
            font-weight: 600;
            color: #FFFFFF;
            cursor: pointer;
            &:hover{
                background: #3682dd;
            }
        }
        .auto-box{
            flex: 1;
            background: #FFF2F2;
            border-radius: .2rem;
            opacity: 1;
            border: 1px solid rgba(221,65,67,0.07);
            padding: 15px;
            color: #000000;
            font-size: .259rem;
            user-select: none;
            .auto-info{
                padding:  15px  0 0 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .auto-list{
                    display: flex;
                    .list{
                        margin-right: .2rem;
                        font-size: .259rem;
                        font-weight: 400;
                        color: #73787B;
                        background: #FFFFFF;
                        border-radius: .1rem;
                        padding: .1rem .2rem;
                        cursor: pointer;
                        border: 1px solid #FFFFFF;
                        &.active{
                            border: 1px solid #FF2D0F;
                            color: #FF2D0F;
                        }
                    }
                }
                .submit-btn{
                    .btn{
                        background: #000000;
                        border-radius: .12rem;
                        color: #FFFFFF;
                        font-size: .259rem;
                        padding: .15rem .3rem;
                        cursor: pointer;
                    }
                   
                }
            }
        }
        .auto{
           
            display: flex;
            justify-content: space-between;
            .left-info-text{
                display: flex;
                align-items: center;
            }
            .right-icon{
                .icon-box{
                    padding: .05rem;
                    background: #000000;
                    border-radius: 1rem;
                    opacity: 1;
                    border: 1px solid #000000;
                    cursor: pointer;
                    .icon-color{
                        color: #FFFFFF!important;
                        font-size: .3rem;
                    }
                }
            }
        }
    }
}
</style>