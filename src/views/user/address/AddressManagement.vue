<template>
  <div
    class="address-management"
    :class="addressList.length < 1 && page > 1 ? 'on' : ''"
    ref="container"
  >
    <div class="line" v-if="addressList.length > 0">
      <img src="@assets/images/line.jpg" />
    </div>
    <div class="item" v-for="(item, index) in addressList" :key="index">
      <div class="address" @click="selAddress(item)">
        <div class="consignee">
          收货人：{{ item.receiverName}}
          <span class="phone">{{ item.receiverPhone }}</span>
        </div>
        <div>
          收货地址：{{ item.receiverProvince }}
                    {{ item.receiverCity }}
                    {{ item.receiverDistrict}}
                    {{ item.receiverAddress }}
        </div>
      </div>
      <div class="operation acea-row row-between-wrapper">
        <div class="select-btn">
          <div class="checkbox-wrapper">
            <label class="well-check">
              <input type="radio" name="default" value=""
                     :checked="item.isToleration === 1 ? true : false" @click="radioChange(index)"/>
              <i class="icon"></i>
              <span class="default">设为默认</span>
            </label>
          </div>
        </div>
        <div class="acea-row row-middle">
          <div @click="editAddress(index)">
            <span class="iconfont icon-bianji"></span>编辑
          </div>
          <div @click="delAddress(index)">
            <span class="iconfont icon-shanchu"></span>删除
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <div class="noCommodity" v-if="addressList.length < 1 && page > 1">
      <div class="noPictrue">
        <img src="@assets/images/noAddress.png" class="image" />
      </div>
    </div>
    <div style="height:1.2rem;"></div>
    <div class="footer acea-row row-between-wrapper">
      <div class="addressBnt on bg-color-red" v-if="isWechat" @click="addAddress">
        <span class="iconfont icon-tianjiadizhi"></span>添加新地址
      </div>
      <div class="addressBnt on bg-color-red" v-else @click="addAddress">
        <span class="iconfont icon-tianjiadizhi"></span>添加新地址
      </div>
      <div class="addressBnt wxbnt" v-if="isWechat && false" @click="getAddress">
        <span class="iconfont icon-weixin2"></span>导入微信地址
      </div>
    </div>
  </div>
</template>
<style scoped>
.address-management.on {
  background-color: #fff;
  height: 100vh;
}
</style>
<script type="text/babel">
import {
  getAddressList,
  getAddressRemove,
  getAddressDefaultSet,
  postAddress,
  upAddress
} from "@api/user";
import Loading from "@components/Loading";
import { isWeixin } from "@utils";
import { openAddress } from "@libs/wechat";
let NAME = "AddressManagement";
export default {
  name: NAME,
  components: {
    Loading
  },
  data() {
    return {
      page: 1,
      limit: 20,
      addressList: [],
      loadTitle: "",
      loading: false,
      loadend: false,
      isWechat: isWeixin(),
      isPay: 0, // 是否是从支付页面过来，如果是，点击地址会返回来的页面
      orderNo: 0, // 从来的页面传过来，会原样返回，可能是订单号也可能是课程id，因为返回原页面后不知道是哪个订单或哪个课程
      isFirstPay: 0, // 是否第一次支付，因为会从两个页面过来，为了返回正确的页面
      payType: 0 // 支付类型，可能值为拼团1，砍价2，直接购买0
    };
  },
  watch: {
    $route(n) {
      if (n.name === NAME) {
          this.addressList = [] // 清空原始数据,使得数据不会重复
          this.loadend = false // 使得可以重新请求
          this.AddressList();
      }
    }
  },
  mounted: function() {
    this.isPay = this.$route.query.isPay;
    this.orderNo = this.$route.query.payOrderNo;
    this.isFirstPay = this.$route.query.isFirstPay;
    this.payType = this.$route.query.payType;
    this.AddressList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.AddressList();
    });
  },
  activated () {
      this.isPay = this.$route.query.isPay;
      this.orderNo = this.$route.query.payOrderNo;
      this.isFirstPay = this.$route.query.isFirstPay;
      this.payType = this.$route.query.payType;
  },
  methods: {
    /**
     * 获取地址列表
     *
     */
    AddressList: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      getAddressList({ pageCurrent: that.page, pageSize: that.limit }).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.addressList.push.apply(that.addressList, res.data.list);
        that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    },
    /**
     * 编辑地址
     */
    editAddress: function(index) {
      this.$router.push({
        path: "/user/add_address/" + this.addressList[index].id
      });
    },
    /**
     * 删除地址
     */
    delAddress: function(index) {
      let that = this;
      let address = this.addressList[index];
      let id = address.id;
      getAddressRemove(id).then(function() {
        that.$dialog.toast({
          mes: "删除成功!",
          callback: () => {
            that.addressList.splice(index, 1);
            that.$set(that, "addressList", that.addressList);
          }
        });
      });
    },
    /**
     * 设置默认地址
     */
    radioChange: function(index) {
      let that = this,
        address = this.addressList[index],
        id = address.id;
        upAddress({id: id, isToleration: 1}).then(function() {
        for (let i = 0, len = that.addressList.length; i < len; i++) {
          if (i === index) that.addressList[i].isToleration = 1;
          else that.addressList[i].isToleration = 0;
        }
        that.$set(that, "addressList", that.addressList);
      });
    },
    /**
     * 新增地址
     */
    addAddress: function() {
      this.$router.push({
        path: "/user/add_address"
      });
    },
    getAddress() {
      openAddress().then(userInfo => {
        this.$dialog.loading.open();
        postAddress({
          real_name: userInfo.userName,
          phone: userInfo.telNumber,
          address: {
            province: userInfo.provinceName,
            city: userInfo.cityName,
            district: userInfo.countryName
          },
          detail: userInfo.detailInfo,
          post_code: userInfo.postalCode,
          wx_export: 1
        }).then(() => {
            this.page = 1;
            this.loading = false;
            this.loadend = false;
            this.addressList = [];
            this.AddressList();

            this.$dialog.loading.close();
            this.$dialog.toast({ mes: "添加成功" });
          })
          .catch(err => {
            this.$dialog.loading.close();
            this.$dialog.error(err.msg || "添加失败");
          });
      });
    },
    selAddress(address) {
        let that = this
        if (this.isPay === 1 || this.isPay === "1") {
            if (this.isFirstPay === 1 || this.isFirstPay === "1") {
                this.$router.replace({
                    path: "/detail/" + that.orderNo,
                    query: {
                        payType: that.payType,
                        addressId: address.id
                    }
                });
            } else {
                this.$router.replace({
                    path: "/order/list/1",
                    query: {
                        addressId: address.id,
                        payOrderNo: this.orderNo
                    }
                });
            }
        }
    }
  }
};
</script>
