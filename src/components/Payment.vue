<template>
  <div>
    <div class="payment" :class="value === true ? 'on' : ''">
      <div class="title acea-row row-center-wrapper">
        付款详情<span class="iconfont icon-guanbi" @click="close"></span>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="isNeedAddress === 2" @click="toAddress()">
        <div class="left acea-row row-between-wrapper">
          <div class="iconfont icon-dizhi"></div>
          <div class="text">
            <div v-if="userAddress.receiverName">
              <div class="name">
                {{userAddress.receiverName}}
                {{userAddress.receiverPhone}}
              </div>
              <div class="info">
                {{userAddress.receiverProvince}}
                {{userAddress.receiverCity}}
                {{userAddress.receiverDistrict}}
                {{userAddress.receiverAddress}}
              </div>
            </div>
            <div class="name" v-else>选择地址</div>
          </div>
        </div>
        <div class="iconfont icon-xiangyou"></div>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="false" @click="toCoupon()">
        <div class="left acea-row row-between-wrapper">
          <div class="iconfont icon-youhuiquan"></div>
          <div class="text">
            <div v-if="userCoupon.couponTitle">
              <div class="name">
                {{userCoupon.couponTitle}}
              </div>
              <div class="info">
                ￥{{ userCoupon.couponPrice }}
                满{{userCoupon.useMinPrice}}元可用
              </div>
            </div>
            <div class="name" v-else>选择优惠券</div>
          </div>
        </div>
        <div class="iconfont icon-xiangyou"></div>
      </div>
      <div class="total acea-row row-between-wrapper">
        <div>支付总额</div>
        <div v-if="isNeedCoupon === 2" class="money">¥{{payOrder.pricePayable - userCoupon.couponPrice}}</div>
        <div v-else class="money">{{payOrder.pricePaid}}</div>
      </div>
      <div class="payBnt" @click="goPay">确认支付</div>
    </div>
    <div class="mask" v-show="value" @click="close"></div>
    <UserCoupon v-on:closeCoupon="closeCoupon" :show="showCoupon"></UserCoupon>
  </div>
</template>
<script>
import UserCoupon from "@components/UserCoupon";
export default {
  name: "Payment",
  components: { UserCoupon },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    payOrder: {
      type: Object,
      default: () => {}
    },
    userAddress: {
      type: Object,
      default: () => {}
    },
    isNeedAddress: {
        type: Number,
        default: 1
    },
    isNeedCoupon: {
        type: Number,
        default: 1
    }
  },
  data: function() {
    return {
        showCoupon: false,
        userCoupon: {}
    };
  },
  mounted: function() {},
  methods: {
    toAddress () {
        this.$router.push({
            path: "/user/add_manage",
            query: {
                isPay: 1,
                isFirstPay: 0,
                payOrderNo: this.payOrder.orderNo
            }
        });
    },
    toCoupon() {
        this.showCoupon = true
    },
    closeCoupon: function(coupon) {
        if (coupon) {
            this.userCoupon = coupon.coupon
        }
        this.showCoupon = false;
    },
    close: function() {
      this.$emit("input", false);
    },
    goPay() {
        this.$emit("checked", { coupon: this.userCoupon });
        this.close();
    }
  }
};
</script>
<style scoped>
.payment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 0.16rem 0.16rem 0 0;
  background-color: #fff;
  padding-bottom: 0rem;
  z-index: 99;
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

.payment.on {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
}

/*.payment .title {*/
/*  text-align: center;*/
/*  height: 1.23rem;*/
/*  font-size: 0.32rem;*/
/*  color: #282828;*/
/*  font-weight: bold;*/
/*  padding-right: 0.3rem;*/
/*  margin-left: 0.3rem;*/
/*  position: relative;*/
/*  border-bottom: 0.01rem solid #eee;*/
/*}*/

.payment .title .iconfont {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.43rem;
  color: #8a8a8a;
  font-weight: normal;
  padding-right: 0.1rem;
  text-align: right;
}

.payment .item {
  border-bottom: 0.01rem solid #eee;
  height: 1.3rem;
  margin-left: 0.3rem;
  padding-right: 0.3rem;
}

.payment .item .left {
  width: 6.1rem;
}

.payment .item .left .text {
  width: 5.4rem;
}

.payment .item .left .text .name {
  font-size: 0.28rem;
  color: #282828;
}

.payment .item .left .text .info {
  font-size: 0.24rem;
  color: #999;
}

.payment .item .left .text .info .money {
  color: #ff9900;
}

.payment .item .left .iconfont {
  font-size: 0.45rem;
  color: #09bb07;
}

.payment .item .left .iconfont.icon-zhifubao {
  color: #00aaea;
}

.payment .item .left .iconfont.icon-yuezhifu {
  color: #ff9900;
}

.payment .item .left .iconfont.icon-yuezhifu1 {
  color: #eb6623;
}

.payment .item .iconfont {
  font-size: 0.3rem;
  color: #999;
}
.payment .payBnt {
  font-size: 0.36rem;
  color: #333333;
  font-weight: bold;
  width: 6.9rem;
  height: 1rem;
  background-color: #f9e067;
  border-radius: 0.1rem;
  text-align: center;
  line-height: 1rem;
  margin: 0.1rem auto;
}
</style>
