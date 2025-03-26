<!-- 出售 -->
<template>
    <div>
        <Dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="$t('ReceiptRecords')"
            :visible.sync="show"
            :before-close="handleClose"
            class="staking"
            top="10vh"
            width="95%">
            <div class="content" v-if="item">
                <div class="list-info">
                   <div class="product">
                        {{ $t('product') }}
                   </div>
                   <div class="info-box">
                        <div class="icon">
                            <img src="../assets/img/tronicon.svg" alt="">
                            <div class="text">{{ item.coinCode}}</div>
                        </div>
                        <div class="nh">
                            <div class="title">
                                {{ $t('Annualized') }}
                            </div>
                            <div class="number">
                                {{ (item.interestRate*360*100).toFixed(2) - 0 }}%
                            </div>
                        </div>
                   </div>
                </div>
                <div class="list-info">
                    <div class="header">
                        <div class="th">{{ $t('shulaing') }}</div>
                        <div class="th">{{ $t('time') }}</div>
                    </div>
                    <div class="table">
                        <template v-if="list.length > 0">
                                <div class="list"  v-for="(list,index) in list" :key="index">
                                <div class="td">+{{ list.revenue }} TRX</div>
                                <div class="td">{{ list.createTime }}</div>
                            </div>
                        </template>
                        <div class="list" v-else>
                            <div class="td2">{{ $t('nodata') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { Dialog, Button, Input } from 'element-ui'
import baseApi from '../api/baseApi'
import { Notify } from "vant";

export default {
    name: 'TronLeaseWebSellDialog',
    props:['stakingWithdrawRecordStatus','unlockItem'],
    data() {
        return {
            show: this.stakingWithdrawRecordStatus,
            number: '',
            item: null,
            list: []
        };
    },
    components:{
        Dialog,Button,Input
    },
    watch:{
        'stakingWithdrawRecordStatus'(a){
            this.show = a
           if(a){
            this.item = this.unlockItem
            this.queryRewardList()
           }
        }
    },
    mounted() {
        
    },
    computed:{
        address(){
            return this.$store.state.walletTRON;
        },
    },
    methods: {
        //查询记录
        queryRewardList(){
            baseApi.queryRewardList({
                "signMessage":JSON.parse(localStorage.getItem('userSignature'))[this.address],
                "address":this.address,      
                "orderId":this.item.orderId
            }).then( res => {
                this.list = res.data
            })
        },
        handleClose(done){
            done()
            this.show = false
            this.$emit('closetDialogStatus','stakingWithdrawRecordStatus')
            this.list = []
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
        &:first-child{
            margin-top: 0;
        }
        .product{
            font-size: .296rem;
            font-family: Poppins, Poppins;
            font-weight: bold;
            color: #73787B;
        }
        .info-box{
            margin-top: .2rem;
            background: #F6F7FA;
            border-radius: .37rem;
            opacity: 1;
            display: flex;
            padding: .4rem .3rem;
            align-items: center;
            justify-content: space-between;
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
            .nh{
                .title{
                    font-size: .259rem;
                    font-family: Poppins, Poppins;
                    font-weight: 400;
                    color: #73787B;
                }
                .number{
                    margin-top: .2rem;
                    font-size: .4rem;
                    font-family: Poppins, Poppins;
                    font-weight: 600;
                    color: #FF1F00;
                }
            }
        }
        .header{
            display: flex;
            justify-content: space-between;
        }
        .table{
            width: 100%;
            max-height: 300px;
            overflow: hidden;
            overflow-y: auto;
            .list{
                display: flex;
                justify-content: space-between;
                .td{
                    font-size: 12px;
                    font-family: Poppins, Poppins;
                    font-weight: 400;
                    color: #000000;
                    line-height: .9rem;
                }
                .td2{
                    width: 100%;
                    font-size: 12px;
                    font-family: Poppins, Poppins;
                    font-weight: 400;
                    color: #000000;
                    line-height: .9rem;
                    text-align: center;
                }
            }
        }
    }
}
</style>