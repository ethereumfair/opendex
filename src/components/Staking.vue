<template>
    <div class="main-body">
        <div class="main-content">
            <Header />
           <div class="staking">
                <div class="staking-top">
                    <div class="info-content" :class="screenWidth > 1000 ? 'pc' : ''">
                        <div class="title">
                            {{ $t("stakingTitle1") }}
                        </div>
                        <div class="hc">
                            <div class="c"></div>
                            {{ $t("stakingTitle2") }}
                        </div>
                        <div class="hc">
                            <div class="c"></div>
                            {{ $t("stakingText") }}
                        </div>
                    </div>
                    <div class="img" v-if="screenWidth > 1000">
                        <img src="../assets/img/staking-bag.svg" alt="">
                    </div>
                </div>
                <div class="staking-info" :class="screenWidth > 1000 ? 'pc' : 'mb'">
                    <div class="item">
                        <div class="title">
                            {{ $t('lockAll') }}($)
                        </div>
                        <div class="number">
                            {{ $formatNumber(totalLockPosition) }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            {{ $t('EarningsAll') }}($)
                        </div>
                        <div class="number">
                            {{ $formatNumber(totalRevenue) }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            {{ $t('lockPersonalAll') }}($)
                        </div>
                        <div class="number">
                           {{ $formatNumber(totalLockPositionPersonal) }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            {{ $t('UnclaimedAll') }}($)
                        </div>
                        <div class="number">
                            {{ $formatNumber(totalUnreceivedRevenue) }}
                        </div>
                    </div>
                </div>
                <div class="staking-tab">
                    <div class="tab">
                        <div class="item" @click="tabType = 'project'" :class="tabType == 'project' ? 'active' : ''">{{ $t('proList') }}</div>
                        <div class="item" @click="tabType = 'holding'" :class="tabType == 'holding' ? 'active' : ''">{{ $t('Holdings') }}</div>
                    </div>
                    <div class="search"></div>
                </div>
                <div class="pro-box" :class="screenWidth > 1000 ? 'pc' : ''" v-if="tabType == 'project'">
                    <div class="box" v-for="(item,index) in projectList" :key="index">
                        <div class="box-title">
                            {{ item.coinCode }}
                        </div>
                        <div class="box-info">
                            <img class="coin" src="../assets/img/staking-trx.svg" alt="">
                            <div class="sta-info">
                                <div class="type-list">
                                    <div class="list border">{{ item.redemptionDays }} {{ $t('day')}}</div>
                                </div>
                                <div class="nh">
                                    {{ $t('Annualized') }}
                                </div>
                                <div class="pre">
                                    {{ (item.interestRate*360*100).toFixed(2) - 0 }}%
                                </div>
                            </div>
                            <div class="price-box">
                                <div class="top">
                                    <div>{{ $formatNumber(item.lockPosition) }}</div>
                                    <div>{{ $formatNumber(item.totalDepositAmt) }}</div>
                                </div>
                                <div class="bottom">
                                    <div> {{ $t('LockedAmount') }}(TRX)</div>
                                    <div> {{ $t('Deposited') }}(TRX)</div>
                                </div>
                            </div>
                            <div class="button" @click="stakingHandle(item)">
                                {{ $t('Deposit') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pro-box" :class="screenWidth > 1000 ? 'pc' : ''" v-if="tabType == 'holding'">
                    <template v-if="positionListVos.length > 0">
                       
                        <div class="box" v-for="(item,index) in positionListVos" :key="index">
                            <div class="box-title">
                                {{ item.coinCode }}
                            </div>
                            <div class="box-info">
                                <img class="coin" src="../assets/img/staking-trx.svg" alt="">
                                <div class="sta-info">
                                    <div class="type-list">
                                        <div class="list border">{{ item.redemptionDays }}{{ $t('day') }}</div>
                                        <div class="list border" v-if="getDays(item.ransomTime) > 0 && item.status != 'wait_receive_send'">{{ $t('Earning') }}</div>
                                    </div>
                                    <div class="sy-box">
                                        <div class="list">
                                            <div class="nh">
                                                {{ $t('FixedAPR') }}
                                            </div>
                                            <div class="pre">
                                                {{ (item.interestRate*360*100).toFixed(2) - 0 }}%
                                            </div>
                                        </div>
                                        <div class="list">
                                            <div class="nh">
                                                {{ $t('EarningsAll') }}
                                            </div>
                                            <div class="pre black">
                                                {{ $formatNumber(item.totalRevenue) }}
                                                <span class="sm">TRX</span>
                                            </div>
                                        </div>
                                        <div class="list recordList">
                                            <div class="record" @click="recordHandle(item)">
                                                {{ $t('ReceiptRecords') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sta-list">
                                    <div class="list">
                                        <div class="left big">
                                            <template v-if="getDays(item.ransomTime) <= 0 && item.status == 'wait_receive_send'">
                                               <span class="blue">{{ $t('Expired') }},</span> {{ $t('Unlockable') }}
                                            </template>
                                            <template v-else>
                                                {{ $t('RemainingExpiryTime') }} <span class="bold">{{ getDays(item.ransomTime) }}</span> {{ $t('day') }} {{ $t('Unlockable') }}
                                            </template>
                                           
                                        </div>
                                        <div class="right">
                                                {{$t('ExpiryDate')}}: {{ item.ransomTime }}
                                        </div>
                                    </div>
                                    <div class="list">
                                        <div class="proess">
                                            <div class="proess-box"  :style="{'width': gerPersent(item)}"></div>
                                        </div>
                                    </div>
                                    <div class="list">
                                        <div class="left">{{ $t('SubscriptionTime') }}</div>
                                        <div class="right">{{ item.createTime }}</div>
                                    </div>
                                    <div class="list">
                                        <div class="left">{{ $t('Lockup') }}</div>
                                        <div class="right">{{ $formatNumber(item.amount) }} TRX</div>
                                    </div>
                                    <div class="list">
                                        <div class="left">{{ $t('AvailableEarnings') }}</div>
                                        <div class="right">{{ $formatNumber(item.unreceivedRevenue) }} TRX</div>
                                    </div>
                                    <div class="list" v-if="item.isRenewal == 'Y'">
                                       <MyprojectList  :item="item" :autoList="autoList" @upDateSuccess="upDateSuccess"/>
                                    </div>
                                </div>
                                <div class="btn-group">
                                    <Button class="btnleft" :loading="loading && unlockItem.orderId == item.orderId" @click="unlockHandle(item)" :class="getDays(item.ransomTime) > 0 || item.status != 'wait_receive_send' ? 'disabled' : ''">{{ $t('UnlockPrincipal') }}</Button>
                                    <Button class="btnright" :loading="loadingWithdraw && unlockItem.orderId == item.orderId" @click="withdrawHandle(item)">{{ $t('WithdrawEarnings') }}</Button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="nodata" v-if="positionListVos.length == 0">
                        <img src="../assets/img/staking-nodata.svg" alt="">
                        <div>{{ $t('nohold') }}</div>
                    </div>
                </div>
           </div>
    </div>   
    <Footer :text="false"/>
    <DialogStaking @stakingSuccess="stakingSuccess" @stakingFail="stakingFail" :stakingDialogStatus="stakingDialogStatus" @closetDialogStatus="closetDialogStatus" :stakingItem="stakingItem" :autoList="autoList"/>
    <DialogStakingWithdrawRecord :stakingWithdrawRecordStatus="stakingWithdrawRecordStatus" @closetDialogStatus="closetDialogStatus" :unlockItem="unlockItem"/>
    <Dialog
         class="staking"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="statusDialog"
        top="10vh"
        width="95%">
        <div class="status-content">
            <img v-if="status == 'success'" src="../assets/img/staking-success.svg" alt="">
            <img v-if="status == 'fail'" src="../assets/img/staking-fail.svg" alt="">
            <div class="status-text">
                {{ statusText }}
            </div>
        </div>
        <div class="status-btn">
            <template v-if="status == 'success'">
                <div class="left-btn" v-if="statusT == 'Depositsuccessful' || statusT == 'DepositFail'" @click="goHash">
                    {{ $t('ViewMyTransactions') }}
                </div>
                <div class="right-btn" @click="closeDialog">
                    {{ $t('iKnow') }}
                </div>
            </template>
            <template v-else>
                <div class="left-btn" @click="Retry" v-if="statusT != 'DepositFail'">
                    {{ $t('Retry') }}
                </div>
                <div class="right-btn" @click="closeDialog">
                    {{ $t('iKnow') }}
                </div>
            </template>
        </div>
    </Dialog>
    </div>
</template>

<script>
import Header from './Header.vue'
const Footer = () => import('./Footer.vue')
const DialogStaking = () => import('./DialogStaking.vue')
const DialogStakingWithdrawRecord = () => import('./DialogStakingWithdrawRecord.vue')
const MyprojectList = () => import('./MyprojectList.vue')

import baseApi from '../api/baseApi'
import { Notify } from "vant";

import { Dialog,Button } from 'element-ui'

export default {
    name: 'Index',

    data() {
        return {
           tabType: 'project',
           stakingDialogStatus: false, // 质押
           stakingWithdrawStatus: false, //解锁本金
           stakingWithdrawRecordStatus: false, // 提取记录
           projectList: [], // 项目列表
           autoList: [],  // 项目列表的天数
           positionListVos: [], // 我的项目
           totalLockPosition: '--', // 总锁仓量
           totalRevenue: '--', // 总收益
           totalLockPositionPersonal: '--', // 个人总锁仓
           totalUnreceivedRevenue: '--', //个人未提取收益
           stakingItem: null, // 质押的参数
           unlockItem: null, // 解锁的参数
           statusDialog: false,
           status: 'success',
           statusT: 'Depositsuccessful',
           loading: false, // 加载状态
           loadingWithdraw: false, // 提取收益状态
           screenWidth: document.body.clientWidth,
           depositHash: '', //质押的哈希

        };
    },
    components:{
        Header,
        Footer,
        DialogStaking,
        DialogStakingWithdrawRecord,
        Dialog,
        Button,
        MyprojectList
    },
    computed:{
        statusText(){
            return this.$t(this.statusT)
        },
        address(){
            return this.$store.state.walletTRON;
        },
    },
    watch:{
       'address'(val){
            this.signature = null
           if(val){
            this.queryPositionList()
           }else{
             this.positionListVos = []
             this.totalLockPositionPersonal = '--'
             this.totalUnreceivedRevenue = '--'
           }
       },
       'tabType'(a){
        if(a == 'holding'){
            this.queryPositionList()
        }
       }
    },
    async mounted() {
        this.queryPositionList()
        this.queryProjectList()
        const that = this
        window.onresize = () => {
        return (() => {
            that.screenWidth = document.body.clientWidth
        })()
        }
    },
    beforeDestroy(){
       
    },
    methods: {
        upDateSuccess(){
            this.queryPositionList()
        },
        goHash(){
            window.open('https://tronscan.org/#/transaction/'+ this.depositHash)
        },
        //重试
        Retry(){
            this. closeDialog()
            if( this.statusT= 'Principalunlockingfailed'){
                this.unlockHandle(this.unlockItem)
                return
            }
            if( this.statusT= 'Principalunlockingfailed'){
                this.withdrawHandle(this.unlockItem)
                return
            }
        },
        closeDialog(){
            this.statusDialog = false
        },
        gerPersent(item){
            const per = (item.redemptionDays - this. getDays(item.ransomTime))/item.redemptionDays*100
            if(per > 100){
                return '100%'
            }
            return  per + '%'
        },
        // 计算剩余天数
        getDays(d1){
            var date1 = new Date(d1);
            var today = new Date();
            var timeDiff = date1 - today;
            var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

           return daysRemaining > 0 ? daysRemaining : 0
        },
        //记录
        async recordHandle(item){
            this.unlockItem = item
            if(this.address == ''){
                return
            }
            let signature
            const userSignature = JSON.parse(localStorage.getItem('userSignature'))
            if(userSignature && userSignature[this.address]){
                signature = userSignature[this.address]
            }else{
                signature = await this.signMessageV2(this.address)
            }
            if(!signature) {
                return
            }
            localStorage.setItem('userSignature',JSON.stringify({
                [this.address]: signature
            }))
            this.openDialogStatus('stakingWithdrawRecordStatus')
        },
        stakingSuccess(hash){
            this.statusDialog = true
            this.status ='success'
            this.statusT= 'Depositsuccessful'
            this.depositHash = hash
            this.queryPositionList()
            this.queryProjectList()

        },
        stakingFail(hash){
            this.statusDialog = true
            this.status ='fail'
            this.statusT= 'DepositFail'
            this.depositHash = hash
        },
        //提取收益
        async withdrawHandle(item){
            this.unlockItem = item
            if(this.address == ''){
                return
            }
            if(!item.unreceivedRevenue || Number(item.unreceivedRevenue) < Number(item.minWithdrawAmt)){
                Notify({
                        message: this.$t('nowith',{
                            num: item.minWithdrawAmt
                        }),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
                return
            }
            const timeStamp = new Date().getTime()
            const signature = await this.signMessageV2(this.address + item.orderId + timeStamp)
            if(!signature) {
                return
            }
            this.loadingWithdraw = true
            baseApi.transferRevenue({
                "signMessage":signature,
                "orderId":item.orderId,
                "address":this.address,
                timeStamp: timeStamp
            }).then( res => {
                this.loadingWithdraw = false
                if(res.resCode == 800){
                    this.statusDialog = true
                    this.status ='success'
                    this.statusT= 'Withdrawalsuccessful'
                    this.queryPositionList()
                }else{
                    this.statusDialog = true
                    this.status ='fail'
                    this.statusT= 'Profitwithdrawalfailed'
                    Notify({
                        message: this.$t(res.resCode),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
                }
            })
        },
        //解锁
        async unlockHandle(item){
            this.unlockItem = item
            if(this.address == ''){
                return
            }
            if(this.getDays(item.ransomTime) > 0 || item.status != 'wait_receive_send'){
                return
            }
            const timeStamp = new Date().getTime()

            const signature = await this.signMessageV2(this.address + item.orderId + timeStamp)
            if(!signature) {
                return
            }
            this.loading = true
            baseApi.withdrawFund({
                "signMessage":signature,
                "orderId":item.orderId,
                "address":this.address,
                timeStamp: timeStamp
            }).then( res => {
                this.loading = false
                if(res.resCode == 800){
                    this.statusDialog = true
                    this.status ='success'
                    this.statusT= 'Unlocksuccessful'
                    this.queryPositionList()
                }else{
                    this.statusDialog = true
                    this.status ='fail'
                    this.statusT= 'Principalunlockingfailed'
                }
            })
        },
        //质押
        stakingHandle(item){
            if(this.address == '' || !this.address){
                 this.$bus.emit("checkTronLink");
                return
            }
            this.stakingItem = item
            this.openDialogStatus('stakingDialogStatus')
        },
        // 签名验证
       async signMessageV2(str){
            try{
                const  msg = tronWeb.toHex(str)
                const signature = await tronWeb.trx.signMessageV2(msg)
                return signature
            }catch(error){
                Notify({
                        message: this.$t('userDeclined'),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
                return false
            }
        },
        //查询我得项目
        async queryPositionList(){
            if(this.address == '' || !this.address){
                 this.$bus.emit("checkTronLink");

                return
            }
            let signature
            const userSignature = JSON.parse(localStorage.getItem('userSignature'))
            if(userSignature && userSignature[this.address]){
                signature = userSignature[this.address]
            }else{
                signature = await this.signMessageV2(this.address)
            }
            if(!signature) {
                return
            }
            localStorage.setItem('userSignature',JSON.stringify({
                [this.address]: signature
            }))
            baseApi.queryPositionList({
                address: this.address,
                signMessage: signature,
            }).then( res => {
                if(res.resCode == '800'){
                    this.positionListVos = res.data.positionListVos
                    this.totalLockPositionPersonal = res.data.totalLockPosition
                    this.totalUnreceivedRevenue = res.data.totalUnreceivedRevenue
                    
                }
            })
        },
        //查询项目列表
        queryProjectList(){
            baseApi.queryProjectList({
                address: this.address
            }).then( res => {
                if(res.resCode == '800'){
                    this.projectList = res.data.projectList
                    this.totalLockPosition = res.data.totalLockPosition
                    this.totalRevenue = res.data.totalRevenue
                    const list = []
                    this.projectList.forEach( item => {
                        if(Number(item.lockPosition) > 0){
                            list.push(item.redemptionDays)
                        }
                    })
                    this.autoList =  list
                }
            })
        },
        closetDialogStatus(type){
            this[type] = false
            this.unlockItem = null
            this.stakingItem = null

        },
        openDialogStatus(type){

            //判断是否连接钱包
            if(this.address == ''){
                return this.$bus.emit('showConnectDialog')
            }
            this[type] = true
        },
    }
};
</script>

<style lang="scss" scoped>
.main-body{
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    text-align: left;
    div{
        box-sizing: border-box;
    }
    .main-content{
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
        .staking{
            width: 100%;
            padding: 0 12px;
        }
        .staking-top{
            width: 100%;
            background: #FFFFFF;
            position: relative;
            border-radius: 0 .5rem .5rem .5rem;
            margin-top: 2rem;
            padding: .6rem .4rem .8rem;
            position: relative;
            .info-content{
                &.pc{
                    padding-right: 9rem;
                }
            }
            .title{
                font-size: .5rem;
                font-family: Poppins, Poppins;
                font-weight: bold;
                color: #000000;
                background: url('../assets/img/staking-title-bg.svg') no-repeat;
                background-size: 100%;
                position: absolute;
                top: -.8rem;
                left: 0;
                padding: 0.4rem;
                min-width: 300px;
                padding-right: 2rem;
                box-sizing: border-box;

            }
            .hc{
                display: flex;
                align-items: center;
                font-size: .3rem;
                font-family: Poppins, Poppins;
                font-weight: 400;
                color: #000000;
                margin-top: .5rem;
                line-height: .4rem;
                .c{
                    width: .2222rem;
                    height: .2222rem;
                    border-radius: 100px;
                    background: #2882FF ;
                    margin-right: .2rem;
                }
            }
            .img{
                position: absolute;
                right: 0;
                bottom: 0;
                img{
                    height: 5rem;
                }
            }

        }
        .staking-info{
            margin-top: .4rem;
            width: 100%;
            background: #FFFFFF;
            border-radius: .5rem;
            display: flex;
            padding: .4rem;
            flex-wrap: wrap;
            &.mb{
                padding-top: 0;
                .item{
                    margin-top: .4rem;
                    width: 50%;
                }
            }
            .item{
                width: 25%;
                .title{
                    font-size: .3rem;
                    font-family: Poppins, Poppins;
                    font-weight: 400;
                    color: #A8A8A8;
                }
                .number{
                    margin-top: .4rem;
                    font-size: .4444rem;
                    font-family: Poppins, Poppins;
                    font-weight: 600;
                    color: #000000;
                }
            }
        }
        .staking-tab{
            padding: .4rem;
            margin-top: .4rem;
            width: 100%;
            background: #FFFFFF;
            border-radius: .5rem;
            .tab{
                display: flex;
                .item{
                    font-size: .37rem;
                    font-family: Poppins, Poppins;
                    font-weight: bold;
                    color: #73787B;
                    cursor: pointer;
                    margin: .2rem .4rem .2rem .5rem;
                    &:first-child{
                        margin-left: 0;
                    }
                    &.active{
                        color: #000000;
                    }
                }
            }
        }
        .pro-box{
            display: flex;
            flex-wrap: wrap;
            padding-bottom: .6rem;
            &.pc{
                .box{
                    margin-right: .8rem;
                }
            }
            .box{
                margin-top: .6rem;
                width: 100%;
                max-width: 440px;
                background: url('../assets/img/staking-trx-bg-t.svg') no-repeat;
                background-size: 100%;
                border-radius: .37rem;
                .box-title{
                    height: .9rem;
                    line-height: .9rem;
                    font-size: .4rem;
                    font-family: Poppins, Poppins;
                    font-weight: bold;
                    color: #FFFFFF;
                    padding-left: 1rem;
                }
                .box-info{
                    width: 100%;
                    height: calc(100% - .9rem);
                    background: #FFFFFF;
                    border-radius: .37rem;
                    position: relative;
                    padding-bottom: .6rem;
                    .coin{
                        position: absolute;
                        right: 0;
                        height: 3rem;
                        top: -1rem;
                    }
                    .sta-info{
                        padding: .4rem;
                        padding-top: .5rem;
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
                                border: 1px solid #FFFFFF;
                                font-size: 14px;
                                font-family: Poppins, Poppins;
                                font-weight: 400;
                                color: #000000;
                                margin-left: .15rem;
                                cursor: pointer;
                                &:first-child{
                                    margin-left: 0;
                                }
                                &.border{
                                    border: 1px solid #FF1F00;
                                    color: #FF1F00;
                                }
                            }
                        }
                        .sy-box{
                            width: 100%;
                            display: flex;
                            .list{
                                margin-left: .4rem;
                                &:first-child{
                                    margin-left: 0;
                                }
                                &.recordList{
                                    flex: 1;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-end;
                                    .record{
                                        vertical-align: bottom;
                                        text-align: right;
                                        cursor: pointer;
                                        font-size: 12px;
                                        font-family: Poppins, Poppins;
                                        font-weight: 400;
                                        color: #0075FF;
                                    }
                                }
                            }
                        }
                        .nh{
                            margin-top: .5rem;
                            font-size: 14px;
                            font-family: Poppins, Poppins;
                            font-weight: 400;
                            color: #73787B;
                        }
                        .pre{
                            margin-top: .5rem;
                            font-size: 24px;
                            font-family: Poppins, Poppins;
                            font-weight: 600;
                            color: #FF1F00;
                            &.black{
                                color: #000000;
                                .sm{
                                    font-size: .259rem;
                                }
                            }
                        }
                    }
                    .sta-list{
                        padding: 0 .4rem;
                        .list{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: .4rem;
                            &:first-child{
                                margin-top: 0;
                            }
                            .proess{
                                width: 100%;
                                height: .37rem;
                                background: #F6F6F6;
                                border-radius: 40px 40px 40px 40px;
                                .proess-box{
                                        border-radius: 40px 40px 40px 40px;
                                        height: .37rem;
                                        background: #0075FF;

                                }
                            }
                            .left{
                                font-size: .259rem;
                                font-family: Poppins, Poppins;
                                font-weight: 400;
                                color: #73787B;
                                line-height: .37rem;
                                &.big{
                                    color: #000000;
                                    .blue{
                                        color: #0075FF;
                                    }
                                }
                                .bold{
                                    color: #0075FF;
                                    font-weight: bold;
                                }
                            }
                            .right{
                                font-size: .259rem;
                                font-family: Poppins, Poppins;
                                font-weight: 400;
                                color: #000000;
                                line-height: .37rem;
                            }
                        }
                    }
                    .price-box{
                        margin: 0 .4rem;
                        margin-top: .4rem;
                        background: #F6F7FA;
                        border-radius: .259rem;
                        padding: .4rem;
                        .top{
                            display: flex;
                            justify-content: space-between;
                            font-size: .3rem;
                            font-family: Poppins, Poppins;
                            font-weight: bold;
                            color: #000000;
                        }
                        .bottom{
                            margin-top: .3rem;
                            display: flex;
                            justify-content: space-between;
                            font-size: .259rem;
                            font-family: Poppins, Poppins;
                            font-weight: 400;
                            color: #73787B;
                        }
                    }
                    .btn-group{
                        margin: 0 .4rem;
                        margin-top: .5rem;
                        display: flex;
                        justify-content: space-between;
                        .btnleft{
                            width: 48%;
                            height: 1.2rem;
                            text-align: center;
                            background: #FFFFFF;
                            border-radius: .259rem;
                            font-size: .28rem;
                            font-family: Poppins, Poppins;
                            font-weight: 600;
                            color: #0075FF;
                            border: 1px solid #0075FF;
                            cursor: pointer;
                            &.disabled{
                                background: rgba(0,117,255,0);
                                border: 1px solid #E6E6E6;
                                color: #9D9D9D;
                                cursor: not-allowed;
                            }
                        }
                        .btnright{
                            width: 48%;
                            height: 1.2rem;
                            text-align: center;
                            background: #0075FF;
                            border-radius: .259rem;
                            font-size: .28rem;
                            font-family: Poppins, Poppins;
                            font-weight: 600;
                            color: #FFFFFF;
                            border: 1px solid #0075FF;
                            cursor: pointer;

                        }
                    }
                    .button{
                        margin: 0 .4rem;
                        margin-top: .5rem;
                        height: 1.2rem;
                        line-height: 1.2rem;
                        text-align: center;
                        background: #0075FF;
                        border-radius: .259rem;
                        font-size: .3rem;
                        font-family: Poppins, Poppins;
                        font-weight: 600;
                        color: #FFFFFF;
                        cursor: pointer;
                        &:hover{
                            background: #3682dd;
                        }
                    }
                }
            }
            .nodata{
                width: 100%;
                text-align: center;
                font-size: .3rem;
                font-family: Poppins, Poppins;
                font-weight: 400;
                color: #73787B;
                img{
                    width: 100%;
                    max-width: 400px;
                }
            }
        }
    }
}
.status-content{
    display: flex;
    justify-content: center;
    align-items: center;
    .status-text{
        font-size: .37rem;
        font-family: Poppins, Poppins;
        font-weight: bold;
        color: #000000;
        margin-left: .3rem;
    }
    img{
        width: .7777rem;
    }
}
.status-btn{
    margin-top: .6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    .left-btn{
        min-width: 2.8rem;
        height: .9rem;
        background: rgba(0,117,255,0);
        border-radius: 50px 50px 50px 50px;
        opacity: 1;
        border: 1px solid #0075FF;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 .4rem;
        cursor: pointer;
        color: #0075FF;
    }
    .right-btn{
        min-width: 2.8rem;
        margin-left: .4rem;
        height: .9rem;
        background: rgba(0,117,255,0);
        border-radius: 50px 50px 50px 50px;
        opacity: 1;
        border: 1px solid #0075FF;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 .4rem;
        cursor: pointer;
        background: #0075FF;
        color: #FFFFFF;
    }
}
</style>