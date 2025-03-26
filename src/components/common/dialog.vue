<script>
export default {
  name: 'Dialog',
  props: {
    title: {
      type: String,
      default: '',
    },
    opacity: {
      type: String,
      default: '0.7',
    },
    width: {
      type: String,
      default: '330px',
    },
    bgc: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      show: false,
    }
  },
  watch:{
    show(val){
      if(val){
         this.$emit("open")
      }
    }
  },
  methods: {
    closeDialog(e) {
      const className = e.target.className.toString()

      if (
        className === 'dialog-box' ||
        className.indexOf('close-dialog') !== -1
      ) {
        this.show = false
        this.$emit('close')
      }
    },
  },
  render() {
    return (
      <div>
        {this.show ? (
          <div
            class="dialog-box"
            style={`background: rgba(0, 0, 0,${this.opacity});`}
            onclick={this.closeDialog}
          >
            <div
              class="dialog"
              style={`width:${this.width};background: ${this.bgc};`}
            >
              <div class="cont">{this.$slots.default}</div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  },
}
</script>
<style lang="scss" scoped>
.dialog-box {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog {
    position: relative;
    // top: -15%;
    // width: 330px;
    height: auto;
    // background: #fff;
    border-radius: .5rem;
    // box-shadow: 0 20px 60px -2px rgba(100, 33, 58, 0.4);
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      .title {
        height: 30px;
        line-height: 30px;
        font-weight: bold;
      }
      .close-dialog {
        height: 30px;
        width: 30px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .cont {
      box-sizing: border-box;
      padding: .37rem;
    }
  }
}
</style>
