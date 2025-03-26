<template>
  <div class="addLiquidity">
    <ul>
      <li>
        <div class="tardePairDiv">
          <div class="leftPart">
            <div class="imgDiv">
              <img
                src="https://www.swftc.info/swft-v3/images/coins/HN(HECO).png"
                alt=""
                srcset=""
              />
              <img
                class="afterImg"
                src="https://www.swftc.info/swft-v3/images/coins/HT.png"
                alt=""
                srcset=""
              />
            </div>
            <div class="pair">HN/HT</div>
          </div>
          <div class="btn">
            <button @click="toUrl('ht')">{{ $t('add') }}</button>
          </div>
        </div>
      </li>
      <li>
        <div class="tardePairDiv">
          <div class="leftPart">
            <div class="imgDiv">
              <img
                src="https://www.swftc.info/swft-v3/images/coins/HN(HECO).png"
                alt=""
                srcset=""
              />
              <img
                class="afterImg"
                src="https://www.swftc.info/swft-v3/images/coins/USDT.png"
                alt=""
                srcset=""
              />
            </div>
            <div class="pair">HN/USDT</div>
          </div>
          <div class="btn">
            <button @click="toUrl('usdt')">{{ $t('add') }}</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  // 方法集合
  methods: {
    toUrl(url) {
      if (url == 'ht') {
        window.open(
          'https://ht.mdex.com/#/add/HT/0x7fc7b1c464f16f8ccc20b17eb95231a8bab8b7f4',
        )
      } else {
        window.open(
          'https://ht.mdex.com/#/add/0xa71EdC38d189767582C38A3145b5873052c3e47a/0x7fc7b1c464f16f8ccc20b17eb95231a8bab8b7f4',
        )
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.addLiquidity {
  width: 100%;
  background: #ffffff;
  padding: 0.8rem 0;
  border-radius: 0 0 0.5rem 0.5rem;
  ul {
    li {
      &:nth-child(2) {
        margin-top: 0.74rem;
      }

      .tardePairDiv {
        background: #f7f8fa;
        border-radius: 0.259rem;
        border: 1px solid #f2f5fa;
        width: 81%;
        height: 1.1rem;
        margin: 0px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 0.27rem;
        .leftPart {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .imgDiv {
            // flex: 2;
            height: 0.629rem;
            margin-right: 0.2rem;
            margin-right: 0.41rem;
            img {
              height: 0.629rem;
              width: 0.629rem;
            }
            .afterImg {
              margin-left: -5px;
            }
          }
          .pair {
            flex: 1;
            font-size: 0.29rem;
            font-family: Poppins;
            color: #000000;
          }
        }
        .btn {
          button {
            width: 2.38rem;
            height: 0.85rem;
            background: #ee0f00;
            border-radius: 0.259rem;
            font-size: 0.29rem;
            font-family: Poppins;
            color: #ffffff;
            line-height: 0.48rem;
            border: none;
          }
        }
      }
    }
  }
}
</style>
