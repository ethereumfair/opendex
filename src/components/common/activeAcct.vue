<template>
  <div :class="isPC ? 'activeAcctPC' : 'activeAcctM'">
    <Dialog :width="isPC ? '500px' : '90%'" ref="dialogAcct">
      <span class="titleWallet">{{ $t('connectWallet') }}</span>
      <div v-for="(item, index) in listAcct.addrSS58" :key="index">
        <div class="AcctP" @click="checkedAddr(index, objPolkdot)">
          <span class="headStyle"></span>
          <span class="addrSpan"
            >{{ cutAddress(item.address) }} ({{ item.meta.name }})</span
          >
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './dialog'
import { Notify } from 'vant'
export default {
  components: { Dialog },
  data() {
    return {
      objPolkdot: null,
    }
  },
  props: {
    listAcct: { type: Object, default: null },
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    cutAddress(adr) {
      const beforeAdr = adr.substring(0, 10)
      const afterAdr = adr.substring(adr.length - 10, adr.length)
      return beforeAdr + '.....' + afterAdr
    },
    openAcctDialog(val) {
      const _this = this
      this.objPolkdot = val
      if (_this.listAcct.addrSS58.length == 1) {
        _this.checkedAddr(0, val)
      } else {
        _this.$refs.dialogAcct.show = true
      }
    },
    async checkedAddr(index, objPolkdot) {
      const { stringToHex, stringToU8a, u8aToHex } = await import(
        '@polkadot/util'
      )
      const {
        web3Accounts,
        web3Enable,
        web3FromAddress,
        web3ListRpcProviders,
        web3UseRpcProvider,
        web3FromSource,
      } = await import('@polkadot/extension-dapp')
      // `account` 是 InjectedAccountWithMeta 类型
      //选择某一个账户

      const _this = this
      const checkAcct = {
        addr: _this.listAcct.addr[index].address,
        addrSS58: _this.listAcct.addrSS58[index].address,
        addrSS58CRU: _this.listAcct.addrSS58CRU[index].address,
        addrSS58DBC: _this.listAcct.addrSS58DBC[index].address,
        nameAcct: _this.listAcct.addrSS58[index].meta.name,
        source: _this.listAcct.addrSS58[index].meta.source,
        name: 'DOT',
      }
      //存入polkadot addr是substrate格式 addrSS58是polkadot 格式

      _this.$refs.dialogAcct.show = false
      // 能够从此帐户检索签名者接口
      // 我们可以使用 web3FromSource 它将返回一个 InjectedExtension 类型
      const injector = await web3FromSource(
        _this.listAcct.addr[index].meta.source,
      )
      // 这个注入器对象有一个签名者和一个 signRaw 方法
      // 能够对原始字节进行签名

      const signRaw = injector.signer.signRaw
      const addr = _this.listAcct.addr[index].address
      if (!!signRaw) {
        // 在确保定义了 signRaw 之后
        // 我们可以用它来签署我们的消息

        const dataObj = {
          address: addr,
          data: stringToHex('message to sign'),
          type: 'bytes',
        }
        try {
          const signature = await signRaw(dataObj).then((val) => {
            Notify({ type: 'success', message: this.$t('successLinkPolkadot') })
            _this.$store.commit('setWalletPolkadot', checkAcct)
            if (objPolkdot.network === 'CRU') {
              _this.$store.commit('setChainId', '222')
              localStorage.setItem('connectorId', 'CRU')
            } else if (objPolkdot.network === 'DBC') {
              _this.$store.commit('setChainId', '333')
              localStorage.setItem('connectorId', 'DBC')
            } else {
              _this.$store.commit('setChainId', '000')
              localStorage.setItem('connectorId', 'DOT')
            }

            _this.$store.commit('setWalletConnectType', 'Polkadot')
          })
        } catch (e) {
          if (e.message == 'Cancelled') {
            Notify({
              color: '#ad0000',
              background: '#ffe1e1',
              message: _this.$t('polkadotSignFail'),
            })
          }
        }
      }

    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$bus.on('openAcctdialog', this.openAcctDialog)
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {
    this.$bus.off('openAcctdialog', this.openAcctDialog)
  }, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.activeAcctPC {
  text-align: left;
  .titleWallet {
    font-size: 18px;
    font-family: Poppins;
    color: #000;
  }

  .AcctP {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border: 1px solid #d0d9e7;
    border-radius: 14px;
    font-size: 14px;
    color: #494949;
    margin: 10px 0;
    position: relative;
    background-color: #fff;
    cursor: pointer;
    .headStyle {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background-color: #e4effb;
      display: inline-block;
      position: absolute;
      top: 6px;
      left: 10px;
    }
    .addrSpan {
      position: absolute;
      left: 70px;
    }
  }
  .AcctP:hover {
    border: 1px solid #4c95ff;
    background-color: #f0f7ff;
  }
}
.activeAcctM {
  text-align: left;
  .titleWallet {
    font-size: 18px;
    font-family: Poppins;
    color: #000;
  }

  .AcctP {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: 1px solid #d0d9e7;
    border-radius: 14px;
    font-size: 12px;
    color: #494949;
    margin: 10px 0;
    position: relative;
    background-color: #fff;
    cursor: pointer;
    .headStyle {
      width: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: #e4effb;
      display: inline-block;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .addrSpan {
      position: absolute;
      left: 50px;
    }
  }
  .AcctP:hover {
    border: 1px solid #4c95ff;
    background-color: #f0f7ff;
  }
}
</style>
