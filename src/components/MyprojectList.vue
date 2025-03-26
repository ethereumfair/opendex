<template>
    <div class="list-info" v-if="item">
        <div class="auto-box">
            <div class="auto">
                <div class="left-info-text" v-if="item.renewalDays != '0' && item.renewalDays">
                    {{ $t('autoTime',{
                    num: item.renewalDays
                }) }}
                </div>
                <div class="left-info-text" v-else>
                    {{ $t('automaticrenewal') }}
                    <Tooltip popper-class="popper-item" style="cursor: pointer;" effect="dark" :content="$t('automaticrenewalTips')" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                    </Tooltip>
                </div>
                <div class="right-icon">
                    <div class="icon-box" @click="showAutoHandle">
                        <i class="el-icon-caret-bottom icon-color" v-if="!showAuto"></i>
                        <i class="el-icon-caret-top icon-color" v-else></i>
                    </div>
                </div>
            </div>
            <div class="auto-info" v-if="showAuto">
                <div class="auto-list">
                    
                    <template v-if="item.renewalDays != '0' && item.renewalDays">
                        <div class="list" :class="activeDays == '0' ? 'active' : ''" @click="chooseDays('0')">
                            {{ $t('autoClose') }}
                        </div>
                        
                    </template>
                    <template v-else>
                        <div class="list" v-for="(m,n) in autoList" :key="n" :class="activeDays == m ? 'active' : ''" @click="chooseDays(m)">
                        {{ $t('daysTips',{
                            num: m
                        }) }}
                    </div>
                    </template>
                </div>
                <div class="submit-btn">
                    <div class="btn" @click="submitEdit">
                        {{ $t('Confirm') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Dialog,Button,Tooltip } from 'element-ui'
import baseApi from '../api/baseApi'


export default {
    name: 'TronLeaseWebMyprojectList',
    props: ['item','autoList'],
    data() {
        return {
            showAuto: false, // 展示自动续存
            activeDays: '',
        };
    },

    mounted() {
        
    },
    computed:{
        address(){
            return this.$store.state.walletTRON;
        },
        connectWalletType(){
            return this.$store.state.connectWalletType
        },
    },
    components:{
        Tooltip
    },
    methods: {
        //确定按钮
        async submitEdit(){

            if(this.address == ''){
                return
            }
            if(this.activeDays == ''){
                this.$message({
                    showClose: true,
                    message: this.$t('selectSetItem'),
                    type: 'error',
                    duration: 5000,
                    center: true
                })
                return
            }
            const signature = await this.signMessageV2(this.address)
            if(!signature) {
                return
            }
            const res = await baseApi.renewal({
                "address": this.address,
                "orderId": this.item.orderId,
                "signMessage": signature,
                "renewalDays": this.showAuto ? this.activeDays : 120,
                "type": this.item.renewalDays == 0 ?'add' : this.activeDays > 0 ? 'modify' : 'delete'  
            })
            if(res.resCode == '800'){
                this.$message({
                    showClose: true,
                    message: this.$t('upDateSuccess'),
                    type: 'success',
                    duration: 5000,
                    center: true
                })
                this.$emit('upDateSuccess')
                this.showAuto = false
            }else{
                Notify({
                        message: this.$t(res.resCode),
                        color: "#ad0000",
                        background: "#ffe1e1",
                    });
            }
            
        },
        // 签名验证
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
        //开启关闭续存下拉
        showAutoHandle(){
            this.showAuto = !this.showAuto
        },
        //选择续存天数
        chooseDays(days){
            this.activeDays = days
        },
    },
};
</script>

<style lang="scss" scoped>
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
                cursor: pointer;
                height: .6rem;
                line-height: .6rem;
                padding: 0 .3rem;
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
                   height: .4rem;
                   width: .4rem;
                   background: #000000;
                   border-radius: 1rem;
                   opacity: 1;
                   border: 1px solid #000000;
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   cursor: pointer;
                   .icon-color{
                       color: #FFFFFF!important;
                       font-size: .3rem;
                   }
               }
           }
       }
</style>