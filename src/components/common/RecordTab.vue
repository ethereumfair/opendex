<template>
  <div class="record-tab">
    <div class="tab">
      <div class="activeDiv" :style="{ left: leftAtive }"></div>
      <span
        :class="recordType == 'swft' ? 'active' : ''"
        @click="changeRecordType('swft')"
        >{{
          twFlag == 'miningtw'
            ? 'SWAP'
            : twFlag == 'burndex'
            ? 'Stablex'
            : 'SWFT'
        }}</span
      >
      <span
        :class="recordType == 'bridgers1' ? 'active' : ''"
        @click="changeRecordType('bridgers1')"
        >bridgers</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecordRab',
  data() {
    return {
      leftAtive: '1%',
      twFlag: localStorage.getItem('twFlag'),
    }
  },
  computed: {
    recordType: {
      get() {
        return this.$store.state.recordType
      },
      set(val) {
        this.$store.commit('setRecordType', val)
      },
    },
  },
  methods: {
    changeRecordType(val) {
      if (val == 'swft') {
        this.leftAtive = '1%'
      } else if (val == 'bridgers1') {
        this.leftAtive = '49%'
      } else if (val == 'NFT') {
        this.leftAtive = '66%'
      }
      this.recordType = val
    },
  },
}
</script>

<style lang="scss" scoped>
.record-tab {
  height: 36px;
  text-align: left;

  .tab {
    width: 6.75rem;
    height: 100%;
    display: flex;
    align-items: center;
    background: #eaf2ff;
    border-radius: 36px;
    padding: 0 2px;
    cursor: pointer;
    position: relative;
    .activeDiv {
      display: block;
      width: 50%;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: Poppins;
      color: #adbad0;
      border-radius: 32px;
      color: #292929;
      background: #ffffff;
      transition: 0.5s ease;
      position: absolute;
      top: 2px;
      z-index: 0;
      left: 1%;
    }
    span {
      display: block;
      width: 50%;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 13px;
      font-family: Poppins;
      color: #adbad0;
      border-radius: 32px;
      z-index: 1;
      &.active {
        color: #292929;
      }
    }
  }
}
</style>
