<template>
  <div ref="container">
    <div class="coupon-list" v-if="couponsList.length > 0">
      <div
        class="item acea-row row-center-wrapper"
        v-cloak
        v-for="(item, index) in couponsList"
        :key="index"
      >
        <div class="money" :class="item.isFail === 0 ? 'moneyGray' : ''">
            ￥<span class="num">{{ item.couponPrice }}</span>
            <div class="pic-num">满{{item.useMinPrice}}元可用</div>
        </div>
        <div class="text">
          <div class="condition line1">{{ item.couponTitle }}</div>
          <div class="data acea-row row-between-wrapper">
            <div v-if="item.endTime === 0">不限时</div>
            <div v-else>{{ item.addTime }}-{{ item.endTime }}</div>
            <div class="bnt gray" v-if="item.isFail === 0">不可用</div>
            <div class="bnt bg-color-red" v-else>可使用</div>
          </div>
        </div>
      </div>
    </div>
    <!--暂无优惠券-->
    <div
      class="noCommodity"
      v-if="couponsList.length === 0 && loading === true"
    >
      <div class="noPictrue">
        <img src="@assets/images/noCoupon.png" class="image" />
      </div>
    </div>
  </div>
</template>
<script>
import { getCouponsUser } from "@api/user";
import StorePoster from "../../../components/StorePoster";
const NAME = "UserCoupon";

export default {
  name: "UserCoupon",
  components: {StorePoster},
  props: {},
  data: function() {
    return {
      couponsList: [],
      loading: false
    };
  },
  watch: {
    $route: function(n) {
      var that = this;
      if (n.name === NAME) {
        that.getUseCoupons();
      }
    }
  },
  mounted: function() {
    this.getUseCoupons();
  },
  methods: {
    getUseCoupons: function() {
      let that = this,
        type = 0;
      getCouponsUser(type).then(res => {
        that.couponsList = res.data.authCouponUserViewDTOs;
        that.loading = true;
      });
    }
  }
};
</script>
