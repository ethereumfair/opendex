<template>
  <div class="preference">
       <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-dazhe1"></use>
        </svg>
      <span class="text" v-html="$t('preference')"></span>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.preference{
    margin-top: -15px;
    margin-bottom: 10px;
    width: 100%;
    background: #F2F7FF;
    border-radius: 6px;
    border: 1px solid #E4EFFF;
    display: flex;
    align-items: center;
    min-height: 24px;
    .icon{
        width: 34px;
        height: 24px;
    }
    .text{
        flex: 1;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        color: #287FFA;
        font-weight: normal;
        padding-left: 5px;
        :deep(.orange){
            color:#FF9100;
            .big{
                font-size: 14px;
            }
        }
    }
}
</style>