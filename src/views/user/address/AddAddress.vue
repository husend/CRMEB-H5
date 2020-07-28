<template>
  <div class="addAddress absolute">
    <div class="list">
      <div class="item acea-row row-between-wrapper">
        <div class="name">姓名</div>
        <input
          type="text"
          placeholder="请输入姓名"
          v-model="userAddress.receiverName"
          required
        />
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">联系电话</div>
        <input
          type="text"
          placeholder="请输入联系电话"
          v-model="userAddress.receiverPhone"
          required
        />
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">所在地区</div>
        <div
          class="picker acea-row row-between-wrapper select-value form-control"
        >
          <div class="address">
            <div slot="right" @click.stop="show2 = true">
              {{ model2 || "请选择收货地址" }}
            </div>
            <CitySelect
              v-model="show2"
              :callback="result2"
              :items="district"
              provance=""
              city=""
              area=""
            ></CitySelect>
          </div>
          <div class="iconfont icon-dizhi font-color-red"></div>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">详细地址</div>
        <input
          type="text"
          placeholder="请填写具体地址"
          v-model="userAddress.receiverAddress"
          required
        />
      </div>
    </div>
    <div class="default acea-row row-middle">
      <div class="select-btn">
        <div class="checkbox-wrapper">
          <label class="well-check">
            <input type="checkbox" name="" value=""
              @click="ChangeIsDefault" :checked="userAddress.isToleration === 1 ? true : false"/>
            <i class="icon"></i>
            <span class="def">设置为默认地址</span>
          </label>
        </div>
      </div>
    </div>
    <div></div>
    <div class="keepBnt bg-color-red" @click="submit">立即保存</div>
    <div class="wechatAddress" v-if="isWechat && !id && false" @click="getAddress">
      导入微信地址
    </div>
  </div>
</template>
<script type="text/babel">
import { CitySelect } from "vue-ydui/dist/lib.rem/cityselect";
import District from "ydui-district/dist/jd_province_city_area_id";
import { getAddress, postAddress, upAddress } from "@api/user";
import attrs, { required, chs_phone } from "@utils/validate";
import { validatorDefaultCatch } from "@utils/dialog";
import { openAddress } from "@libs/wechat";
import { isWeixin } from "@utils";

export default {
  components: {
    CitySelect
  },
  data() {
    return {
      show2: false,
      model2: "",
      district: District,
      id: 0,
      userAddress: { isToleration: 0 },
      address: {},
      isWechat: isWeixin()
    };
  },
  mounted: function() {
    let id = this.$route.params.id;
    this.id = id;
    document.title = !id ? "添加地址" : "修改地址";
    this.getUserAddress();
  },
  methods: {
    getUserAddress: function() {
      if (!this.id) return false;
      let that = this;
      getAddress({id: that.id}).then(res => {
        that.userAddress = res.data;
        that.model2 =
          res.data.receiverProvince + " " + res.data.receiverCity + " " + res.data.receiverDistrict;
        that.address.province = res.data.receiverProvince;
        that.address.city = res.data.receiverCity;
        that.address.district = res.data.receiverDistrict;
      });
    },
    getAddress() {
        //导入微信地址暂时没用
      openAddress().then(userInfo => {
        this.$dialog.loading.open();
        postAddress({
          id: this.id,
          real_name: userInfo.userName,
          phone: userInfo.telNumber,
          address: {
            province: userInfo.provinceName,
            city: userInfo.cityName,
            district: userInfo.countryName
          },
          detail: userInfo.detailInfo,
          isToleration: 1,
          post_code: userInfo.postalCode
        })
          .then(() => {
            this.$dialog.loading.close();
            this.$dialog.toast({ mes: "添加成功" });
            this.$router.go(-1);
          })
          .catch(err => {
            this.$dialog.loading.close();
            this.$dialog.error(err.msg || "添加失败");
          });
      });
    },
    async submit() {
      let name = this.userAddress.receiverName,
        phone = this.userAddress.receiverPhone,
        model2 = this.model2,
        detail = this.userAddress.receiverAddress,
        isDefault = this.userAddress.isToleration;
      try {
        await this.$validator({
          name: [
            required(required.message("姓名")),
            attrs.range([2, 16], attrs.range.message("姓名"))
          ],
          phone: [
            required(required.message("联系电话")),
            chs_phone(chs_phone.message())
          ],
          model2: [required("请选择地址")],
          detail: [required(required.message("具体地址"))]
        }).validate({ name, phone, model2, detail });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      try {
        let that = this,
          data = {
            id: that.id || '',
            receiverName: name,
            receiverPhone: phone,
            address: this.address,
            receiverProvince: that.address.province,
            receiverCity: that.address.city,
            receiverDistrict: that.address.district,
            receiverAddress: detail,
            isToleration: isDefault,
            receiverZip: ""
          };
        if (that.id) {
          upAddress(data).then(function() {
              that.$dialog.toast({ mes: "修改成功" });
              that.$router.go(-1);
          });
        } else {
          postAddress(data).then(function() {
              that.$dialog.toast({ mes: "添加成功" });
              that.$router.go(-1);
          });
        }
      } catch (e) {
        this.$dialog.error(e.msg);
      }
    },
    ChangeIsDefault: function() {
        this.userAddress.isToleration = this.userAddress.isToleration === 0 ? 1 : 0;
    },
    result2(ret) {
      this.model2 = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      this.address.province = ret.itemName1;
      this.address.city = ret.itemName2;
      this.address.district = ret.itemName3;
    }
  }
};
</script>
