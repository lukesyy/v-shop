<template>
  <div class="container">
    <div class="group">
      <van-field v-model="form.name" label="收货人" placeholder="收货人姓名" clearable />
      <van-field v-model="form.phoneNumber" type="tel" label="手机号码" placeholder="收货人手机号" clearable />
      <van-field
        readonly
        :value="areaStr"
        label="所在地区"
        placeholder="选择省 / 市 / 区"
        is-link
        @click="showPicker = true"
      />
      <van-field
        v-model="form.detailAddress"
        label="详细地址"
        placeholder="街道门牌、楼层房间号等信息"
        rows="1"
        autosize
        type="textarea"
        clearable
      />
      <van-field
        v-model="form.postCode"
        label="邮编"
        placeholder="邮编信息"
        rows="1"
        autosize
        type="number"
        clearable
      />
    </div>
    <div class="group">
      <van-cell center title="设为默认收货地址">
        <template #right-icon>
          <van-switch v-model="form.defaultStatus" size="24px" :active-value='1' :inactive-value='0'/>
        </template>
      </van-cell>
    </div>
    <van-button class="btn-submit" block type="primary" round @click="onSubmit">保存</van-button>
    <van-button v-if="form.id" class="btn-submit" block type="default" round @click="onDelete">删除收货地址</van-button>
    <!-- 所在地 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-area :area-list="areaList" :value="form.regionCode" @cancel="showPicker = false" @confirm="onAreaConfirm" />
    </van-popup>
  </div>
</template>

<script>
import API_USER from '@/apis/user'
import { isEmpty, isMobile } from '@/utils/validate'
import { areaList } from '@vant/area-data'

export default {
  data() {
    return {
      areaStr: '',
      form: {
        id: '',
        name: '',
        phoneNumber: '',
        detailAddress: '',
        defaultStatus: '0',
        provinceCode: '',
        city: '',
        region: '',
        regionCode: '',
      },
      showPicker: false,
      areaList,
    }
  },

  created() {
    let info = sessionStorage.getItem('addressInfo') || ''
    if (info) {
      sessionStorage.removeItem('addressInfo');
      this.form = JSON.parse(info)
      this.areaStr = this.formatAreaStr(this.form.province, this.form.city, this.form.region)
    }
  },
  methods: {
    onAreaConfirm(values) {
      this.form.province = values[0].name
      this.form.city = values[1].name
      this.form.region = values[2].name
      this.form.regionCode = values[2].code
      this.areaStr = this.formatAreaStr(values[0].name, values[1].name, values[2].name)
      this.showPicker = false
    },
    formatAreaStr(provinceStr, cityStr, countyStr) {
      let str = provinceStr
      cityStr.length > 1 && cityStr !== provinceStr && (str += ` / ${cityStr}`)
      countyStr.length > 1 && (str += ` / ${countyStr}`)

      return str
    },
    onSubmit() {
      let {  name, phoneNumber, province, detailAddress } = this.form
      if (isEmpty(name)) return this.$toast('收货人不能为空')

      if (!isMobile(phoneNumber)) return this.$toast('请填写正确的电话')

      if (isEmpty(province)) return this.$toast('所在地不能为空')

      if (isEmpty(detailAddress)) return this.$toast('详细地址不能为空')

      this.$toast.loading({
        forbidClick: true,
        message: '地址数据提交中...',
        duration: 0,
      })
      if (this.form.id) {
        API_USER.userShoppingAddressUpdate(this.form)
          .then(() => {
            this.$toast(this.form.id ? '修改成功' : '添加成功')
            this.$router.back()
          })
          .catch(error => {
            console.error(error)
          })
      } else {
        API_USER.userShoppingAddressAdd(this.form)
          .then(() => {
            this.$toast(this.form.id ? '修改成功' : '添加成功')
            this.$router.back()
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    onDelete() {
      this.$toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      })

      API_USER.userShoppingAddressDelete({ id: this.form.id })
        .then(() => {
          this.$toast('删除成功')
          this.$router.back()
        })
        .catch(error => {
          console.error(error)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
}

.group {
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: var(--white);
}

.btn-submit {
  margin-top: 10px;
}
</style>
