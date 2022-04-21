<template>
  <div class="container">
    <van-notice-bar wrapable left-icon="volume-o" :scrollable="false" text="本地仓商品和保税仓商品请分别结算" />
    <SpainList v-model="listLoading">
      <template v-if="list.length">
        <div class="goods">
          <div class="goods-header van-hairline--bottom">
            <div class="goods-header-hd">
              <van-icon name="shopping-cart-o" size="18" />
              <span class="goods-header-carText">购物车</span>
            </div>
            <div class="goods-header-bd" @click="onEditStatusChange">
              {{ editStatus === 1 ? '编辑' : '完成' }}
            </div>
          </div>
          <div class="list">
            <div v-for="(item, index) in list" :key="item.key" class="list-item">
              <div class="list-item-selected">
                <van-checkbox v-model="item.selected"></van-checkbox>
              </div>
              <van-image fit="contain" class="list-item-pic" :src="item.primaryPicUrl" />
              <div class="list-item-content">
                <div class="list-item-title">
                  <span v-if="item.buyNumber > item.goodsNumber" style="color: var(--gray-color-5)">【库存不足】</span>
                  {{ item.name }}
                </div>
                <div class="list-item-desc">
                  <div class="list-item-prop">商品类型：{{ item.goodsType === '0' ? '检验' : '营养素' }}</div>
                  <div v-if="item.warehourseType" class="list-item-prop">
                    仓库类型：{{ item.warehourseType === '0' ? '国内仓' : '保税仓' }}
                  </div>
                </div>
                <div class="list-item-bottom">
                  <div class="list-item-price">
                    <span class="list-item-price-symbol">¥</span>
                    <span class="list-item-price-integer">{{ item.counterPrice | decimalFormat }}</span>
                  </div>
                  <template>
                    <!-- :max="item.goodsNumber" -->
                    <van-stepper
                      :value="item.buyNumber"
                      async-change
                      class="sku-num-stepper"
                      @change="onGoodChange($event, index)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <van-empty v-else class="empty" :image="listEmptyImage">
        <template v-if="hasLogin">
          <div class="empty-title">购物车快饿瘪了 T.T</div>
          <div class="empty-txt">快给我挑点宝贝</div>
          <van-button class="empty-btn" round plain type="primary" @click="goHome">去逛逛</van-button>
        </template>
        <template v-else>
          <div class="empty-title">登录后才能看到您的购物车</div>
          <van-button class="empty-btn" type="primary" round @click="goLogin">去登录</van-button>
        </template>
      </van-empty>
    </SpainList>
    <!--结算栏 -->
    <div class="submit-bar-wrap">
      <div v-if="list.length" class="submit-bar">
        <van-checkbox v-model="selectedAll">全选</van-checkbox>
        <template v-if="editStatus === 2">
          <div class="submit-bar-hd"></div>
          <van-button class="submit-bar-button" round plain @click="onDelete">删除</van-button>
        </template>
        <template v-else>
          <div class="submit-bar-hd">
            <span class="submit-bar-total">合计：</span>
            <div class="submit-bar-price">
              <span class="submit-bar-price-symbol">¥</span>
              <span class="submit-bar-price-integer">{{ totalPrice | decimalFormat }}</span>
            </div>
          </div>
          <van-button class="submit-bar-button" round type="primary" @click="onSubmit"
            >去结算({{ totalGoodCount }})</van-button
          >
        </template>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import NP from 'number-precision'
import API_CART from '@/apis/cart'
import Tabbar from '@/components/Tabbar'
import SpainList from '@/components/SpainList'
import usePage from '@/mixins/usePage'
import { decimalFormat } from '@/utils/format'
import { throttle } from '@/utils'

export default {
  components: { Tabbar, SpainList },
  filters: {
    decimalFormat,
    propTitle(list) {
      return list.map(v => v.optionValueName).join(',')
    },
  },
  mixins: [usePage],
  data() {
    return {
      editStatus: 1, // 编辑, 取消
      list: [],
      listLoading: true,
      listEmptyText: '暂无数据',
      listEmptyImage: require('@/assets/images/empty/cart.png'),
      cartVideoSrc: require('@/assets/videos/shopping-cart.mp4'),
    }
  },
  computed: {
    selectedList() {
      return this.list.filter(v => v.selected)
    },
    totalGoodCount() {
      return this.selectedList.reduce((acc, cur) => NP.plus(acc, cur.buyNumber), 0)
    },
    totalPrice() {
      return this.selectedList.reduce((acc, cur) => NP.plus(acc, NP.times(cur.counterPrice||0, cur.buyNumber)), 0)
    },
    selectedAll: {
      get() {
        return this.selectedList.length === this.list.length
      },
      set(val) {
        this.list.forEach(v => {
          v.selected = val
        })
      },
    },
  },
  created() {
    if (this.hasLogin) {
      this.getList()
    } else {
      this.listLoading = false
    }
  },
  methods: {
    ...mapActions({
      setTradeGoods: 'order/setTradeGoods',
    }),
    getList() {
      this.listLoading = true
      API_CART.shoppingCartInfo()
        .then(res => {
          let list = res.data?.rows ?? []
          list.forEach(item => {
            item.selected = false
          })
          this.list = list
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    onEditStatusChange() {
      this.editStatus = this.editStatus === 1 ? 2 : 1
    },
    onGoodChange: throttle(function (number, index) {
      const { id } = this.list[index]
      this.cartNumberHandle(index, { id, number })
    }, 1000),
    onDelete() {
      if (!this.selectedList.length) {
        this.$toast({
          message: '您还没有选择商品哦',
          duration: 1500,
        })
        return
      }

      const type = this.selectedList.length === this.list.length ? 'empty' : 'remove'
      const message = type === 'empty' ? `确定要清空购物车吗？` : `确定要删除这${this.selectedList.length}个商品吗？`
      this.$dialog
        .confirm({
          message: message,
        })
        .then(() => {
          if (type === 'empty') {
            this.cartEmptyHandle()
          } else {
            this.cartRemoveHandle()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    cartNumberHandle(index, { id, number }) {
      this.$toast.loading({
        forbidClick: true,
        message: '修改中...',
        duration: 0,
      })

      API_CART.shoppingCartModifyNumber({ number, goodsId: id })
        .then(res => {
          this.$toast.clear()
          this.list[index].buyNumber = number
        })
        .catch(error => {
          console.log(error)
        })
    },
    cartEmptyHandle() {
      API_CART.shoppingCartEmpty()
        .then(() => {
          this.list = []
        })
        .catch(error => {
          console.log(error)
        })
    },
    cartRemoveHandle() {
      const keyStr = this.selectedList.map(v => v.id)
      API_CART.shoppingCartRemove({ goodsIds: keyStr })
        .then(res => {
          this.getList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    goHome() {
      this.$router.replace('/home')
    },
    goLogin() {
      this.$router.push({
        path: '/login',
        query: {
          redirect: this.$route.path,
        },
      })
    },
    onSubmit() {
      if (!this.selectedList.length) {
        this.$toast({
          message: '您还没有选择商品哦',
          duration: 1500,
        })
        return
      }
      let tag = true
      // 因为 for循环可以提前停止 所以这里使用for进行验证
      for (let i = 0; i < this.selectedList.length - 1; i++) {
        if (this.selectedList[i].goodsType !== this.selectedList[i + 1].goodsType) {
          tag = false
          break
        }
      }
      if (!tag) {
        this.$toast({
          message: '请选择相同类型商品下单',
          duration: 1500,
        })
        return
      }
      for (let i = 0; i < this.selectedList.length - 1; i++) {
        if (this.selectedList[i].warehourseType !== this.selectedList[i + 1].warehourseType) {
          tag = false
          break
        }
      }
      if (!tag) {
        this.$toast({
          message: '请选择相同仓库商品下单',
          duration: 1500,
        })
        return
      }
      if (this.selectedList.some(v => v.buyNumber > v.goodsNumber)) {
        this.$toast({
          message: '请减少库存不足商品的数量',
          duration: 1500,
        })
        return
      }
      this.setTradeGoods({
        origin: 'cart',
        list: this.selectedList,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.goods {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 10px;
  border-radius: 8px;
  background-color: var(--white);

  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
    font-size: 14px;

    &.van-hairline--bottom::after {
      right: -40%;
      left: -40%;
    }

    &-hd,
    &-bd {
      flex: 1;
    }

    &-hd {
      display: flex;
      align-items: center;
      justify-items: center;
    }
    &-carText {
      margin-left: 6px;
    }
    &-bd {
      position: relative;
      overflow: hidden;
      color: #38f;
      text-align: right;
    }

    &-cart {
      margin-left: -10px;
      width: 40px;
      height: 40px;
    }
  }
}

.list {
  padding-top: 10px;

  &-item {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

    &-selected {
      margin-left: -10px;
      min-width: 40px;
      display: flex;
      justify-content: center;
    }

    &-pic {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    &-content {
      min-width: 0;
      min-height: 90px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-title {
      font-size: 14px;
      line-height: 18px;
      color: var(--gray-color-8);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--gray-color-6);
    }

    &-price {
      color: var(--brand-color);
      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }
  }
}

.submit-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: calc(50px + constant(safe-area-inset-bottom));
  bottom: calc(50px + env(safe-area-inset-bottom));
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  &-wrap {
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    color: var(--gray-color-8);
  }

  &-price {
    color: var(--brand-color);
    font-weight: bold;

    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 20px;
      font-family: @font-family-price-integer;
    }
  }

  &-button {
    width: 110px;
    height: 40px;
  }
}

.empty {
  text-align: center;

  &-title {
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--gray-color-8);
  }

  &-txt {
    font-size: 14px;
    color: var(--gray-color-6);
  }

  &-btn {
    box-sizing: border-box;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px auto 0;
    border-radius: 16px;
  }

}
</style>
