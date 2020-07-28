<template>
  <div>
    <div class="userCoupon" ref="container" :class="show ? 'up' : ''">
      <div class="coupon-list" v-if="couponsList.length > 0">
        <div class="item acea-row row-center-wrapper" @click="selCoupon(item)"
          v-cloak v-for="(item, index) in couponsList" :key="index">
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
      <div class="noCommodity" v-if="couponsList.length === 0 && loading === true">
        <div class="noPictrue">
          <img src="@assets/images/noCoupon.png" class="image" />
        </div>
      </div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="!show" @click="closeAttr"></div>
  </div>
</template>
<script>
import { getCouponsUser } from "@api/user";
const NAME = "UserCoupon";

export default {
  name: "UserCoupon",
  props: {
      show: {
          type: Boolean,
          default: false
      }
  },
  data: function() {
    return {
      couponsList: [],
      loading: false
    };
  },
  watch: {},
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
    },
    closeAttr: function() {
        this.$emit("closeCoupon");
    },
    selCoupon(coupon) {
        this.$emit("closeCoupon", { coupon: coupon });
    }
  }
};
</script>
<style scoped>
  .userCoupon{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80%;
    z-index: 101;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -o-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    transform: translate3d(0, 100%, 0);
    -webkit-transform: translate3d(0, 100%, 0);
    -ms-transform: translate3d(0, 100%, 0);
    -moz-transform: translate3d(0, 100%, 0);
    -o-transform: translate3d(0, 100%, 0);
  }
  .userCoupon.up{
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
  }
  .mask{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:100;
    height: 100%;
    background-color:rgba(0,0,0,0.5);
  }
  .coupon-list{
    padding:0 0.3rem;
    margin-top:0.25rem;
  }
  .coupon-list .item{
    width:100%;
    height:1.7rem;
    margin-bottom:0.16rem;
  }
  .coupon-list .item .money{
    background-image:url('../assets/images/coupon1.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    width:32%;
    height:100%;
    color:#fff;
    font-size:0.36rem;
    font-weight:bold;
    text-align:center;
    padding-top: 0.3rem}
  .coupon-list .item .money.moneyGray{
    background-image:url('../assets/images/coupon2.png');
  }
  .coupon-list .item .money .num{font-size:0.6rem;}
  .coupon-list .item .money .pic-num{font-size:0.25rem;}
  .coupon-list .item .text{
    width:68%;
    height:100%;
    padding:0 0.17rem 0 0.24rem;
    background-color:#fff;
    border: 1px solid #ccc;
  }
  .coupon-list .item .text .condition{
    font-size:0.3rem;
    color:#282828;
    height:0.93rem;
    line-height:0.93rem;
  }
  .coupon-list .item .text .data{font-size:0.2rem;color:#999;height:0.76rem;}
  .coupon-list .item .text .data .bnt{width:1.36rem;height:0.44rem;border-radius:0.22rem;font-size:0.22rem;color:#fff;text-align:center;line-height:0.44rem;}
  .coupon-list .item .text .data .bnt.gray{background-color:#ccc;}
  /*优惠券列表弹窗*/
  .coupon-list-window{position:fixed;bottom:0;left:0;width:100%;background-color:#f5f5f5;border-radius:0.16rem 0.16rem 0 0;z-index:111;transition:all .3s cubic-bezier(.25,.5,.5,.9);-webkit-transition:all .3s cubic-bezier(.25,.5,.5,.9);-moz-transition:all .3s cubic-bezier(.25,.5,.5,.9);-o-transition:all .3s cubic-bezier(.25,.5,.5,.9);transform:translate3d(0,100%,0);
    -webkit-transform:translate3d(0,100%,0);-ms-transform:translate3d(0,100%,0);-moz-transform:translate3d(0,100%,0);
    -o-transform:translate3d(0,100%,0);}
  .coupon-list-window.on{transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);}
  .coupon-list-window .title{height:1.24rem;width:100%;text-align:center;line-height:1.24rem;font-size:0.32rem;
    font-weight:bold;position:relative;color: #333;}
  .coupon-list-window .title .iconfont{position:absolute;right:0.3rem;top:50%;transform:translateY(-50%);font-size:0.35rem;
    color:#8a8a8a;font-weight:normal;}
  .coupon-list-window .coupon-list{margin:0 0 0.5rem 0;height:5.5rem;overflow:auto;}
  .coupon-list-window .pictrue{width:4.14rem;height:3.36rem;margin:0 auto 0.5rem auto;}
  .coupon-list-window .pictrue .image{width:100%;height:100%;}
</style>
