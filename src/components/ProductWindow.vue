<template>
  <div>
    <div class="payment" :class="attr.cartAttr ? 'up' : ''">
      <div class="title">
        付款详情
        <span class="iconfont icon-guanbi" @click="closeAttr"></span>
      </div>
      <div class="item acea-row row-between-wrapper" v-if="storeInfo.hasTrainaid === 2" @click="toAddress()">
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
      <div class="item acea-row row-between-wrapper" v-if="!attr.isAssemble && !attr.isBargain && attr.couponList.length > 0" @click="toCoupon()">
        <div class="left acea-row row-between-wrapper">
          <div class="iconfont icon-youhuiquan"></div>
          <div class="text">
            <div v-if="userCoupon.couponTitle">
              <div class="name">
                {{userCoupon.couponTitle}}
                ￥{{ userCoupon.couponPrice }}
              </div>
              <div class="info">
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
        <div v-if="attr.isBargain" class="money">¥0</div>
        <div v-else-if="attr.isAssemble" class="money">¥{{attr.price}}</div>
        <div v-else class="money">¥{{(attr.price - couponPrice) > 0 ? (attr.price - couponPrice) : 0}}</div>
      </div>
<!--      <div class="mode" v-if="!attr.isAssemble && !attr.isBargain && attr.couponList.length > 0">优惠券</div>-->
<!--      <div class="select-btn" v-if="!attr.isAssemble && !attr.isBargain && attr.couponList.length > 0" style="height: auto;overflow: auto">-->
<!--        <div class="checkbox-wrapper" :class="couponIndex === attr.couponList.length ? 'on' : ''" @click="selCoupon(attr.couponList.length, 0)">-->
<!--          <label class="well-check">-->
<!--            <span class="iconfont icon-youhuiquan" style="color: gray;"></span>-->
<!--            <span class="sex">不使用优惠券</span>-->
<!--          </label>-->
<!--        </div>-->
<!--        <div v-if="item.useMinPrice <= attr.price" v-for="(item, index) in attr.couponList" :key="index">-->
<!--          <div class="checkbox-wrapper" :class="couponIndex === index ? 'on' : ''" @click="selCoupon(index, item.couponPrice)">-->
<!--            <label class="well-check">-->
<!--              <span class="iconfont icon-youhuiquan" style="color: rgb(252, 153, 44);"></span>-->
<!--              <span class="sex">{{item.couponTitle}}{{item.couponPrice}}</span>-->
<!--            </label>-->
<!--          </div>-->
<!--        </div>-->
<!--&lt;!&ndash;        <div class="checkbox-wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;          <label class="well-check">&ndash;&gt;-->
<!--&lt;!&ndash;            <input type="radio" name="payType" value="yue">&ndash;&gt;-->
<!--&lt;!&ndash;            <i class="icon"></i>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="iconfont icon-umidd17" style="color: rgb(0, 160, 233);"></span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="sex">支付宝</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </label>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--      </div>-->
      <div v-if="attr.isBargain" class="payBnt" @click="goBargain">开始砍价</div>
      <div v-else class="payBnt" @click="goPay">确认支付</div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></div>
    <UserCoupon v-on:closeCoupon="closeCoupon" :show="showCoupon"></UserCoupon>
  </div>
</template>
<script>
  import { combinationPart, getBargainStart } from "@api/activity"
  import { createOrder } from "@api/order"
  import { isWeixin } from "@utils/index";
  import { mapGetters } from "vuex";
  import UserCoupon from "@components/UserCoupon";
export default {
  name: "ProductWindow",
  components: { UserCoupon },
  props: {
    attr: {
      type: Object,
      default: () => {}
    },
    storeInfo: {
        type: Object,
        default: () => {}
    },
    userAddress: {
        type: Object,
        default: () => {}
    }
  },
  watch: {
      'attr.couponList'(val) {
          this.coupons = val
      }
  },
  computed: {
      ...mapGetters(["userNo"])
  },
  data: function() {
    return {
      order: {
          channelType: 1,
          courseId: 0,
          pricePaid: 0, // 实际支付金额
          payType: 1,
          tradeType: 'JSAPI',
          remarkCus: '',
          orderType: 1
      },
      couponIndex: 0,
      couponPrice: 0, // 优惠券金额
      showCoupon: false,
      userCoupon: {}
    };
  },
  mounted: function() {
      if (this.attr.couponList.length > 0) {
          this.couponPrice = this.attr.couponList[0].couponPrice
          this.userCoupon = this.attr.couponList[0]
      }
  },
  methods: {
    toAddress () {
        let that = this
        let payType;
        if (that.attr.isAssemble) {
            payType = 1
        } else if (that.attr.isBargain) {
            payType = 2
        } else {
            payType = 0
        }
        this.$router.replace({
            path: "/user/add_manage",
            query: {
                isPay: 1,
                isFirstPay: 1,
                payType: payType,
                payOrderNo: that.storeInfo.id, //课程id
            }
        });
    },
    toCoupon() {
      this.showCoupon = true
    },
    selCoupon: function(index, price) {
      this.couponIndex = index
      this.couponPrice = price
    },
    closeCoupon: function(coupon) {
        if (coupon) {
          this.userCoupon = coupon.coupon
        }
        this.showCoupon = false;
    },
    closeAttr: function() {
      this.$emit("changeFun", { action: "changeattr", value: false });
    },
    goPay: function () {
      let that = this
      that.order.courseId = that.storeInfo.id
      that.order.orderType = 1
      if (that.attr.isAssemble) {
          that.order.pricePaid = that.attr.price
          that.order.orderType = 2
          // 如果是拼团，则传入拼团信息
          let assembleId;
          if (this.attr.assembleDtail) {
              assembleId = this.attr.assembleDtail.assembleId
          }
          let assemble = {
              uid: this.userNo,
              price: this.attr.price,
              totalPrice: this.attr.price,
              cid: this.storeInfo.authAssembleCourseViewDTO.id,
              pid: this.storeInfo.authAssembleCourseViewDTO.productId,
              assembleId: assembleId
          }
          that.order.assembleSaveREQ = assemble
      } else {
          that.order.pricePaid = (that.attr.price - that.couponPrice) > 0 ? (that.attr.price - that.couponPrice): 0
      }
      if (that.attr.isBargain) {
          that.order.orderType = 3
      }
      if (that.userAddress.id) {
          that.order.shippingAddressId = that.userAddress.id
      } else {
          if (that.storeInfo.hasTrainaid === 2) {
            return this.$dialog.error(
                "请选择地址信息！"
            );
          }
      }
      if (that.userCoupon.id) {
          that.order.couponUserId = that.userCoupon.id
      }
      if (isWeixin()) {
        createOrder(that.order).then(res => {
            if (res.code === 200) {
                if (typeof window.WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady(res.data), false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady(res.data));
                        document.attachEvent('onWeixinJSBridgeReady',that.onBridgeReady(res.data));
                    }
                }else{
                    that.onBridgeReady(res.data);
                }
                // 不需支付，直接成功
            } else if (res.data.code === 202) {
                that.$router.push({
                    path: "/order/status/" + res.msg + "/1"
                });
            } else {
                that.$dialog.error(res.msg);
            }
        }).catch(err => {
            that.$dialog.error(err.msg);
        })
      } else {
          return this.$dialog.error(
              "请在微信中使用支付功能！"
          );
      }
    },
    handlePaid: function(orderNo) {
        let assembleId;
        if (this.attr.assembleDtail) {
            assembleId = this.attr.assembleDtail.assembleId
        }
        let assemble = {
            uid: this.userNo,
            price: this.attr.price,
            totalPrice: this.attr.price - this.couponPrice,
            cid: this.storeInfo.authAssembleCourseViewDTO.id,
            pid: this.storeInfo.authAssembleCourseViewDTO.productId,
            assembleId: assembleId,
            orderId: orderNo
        }
        combinationPart(assemble).then(res => {
            if (res.code === 200) {
                this.$router.push({
                    path: "/order/status/" + orderNo + "/1"
                });
            }
        }).catch(err => {
            that.$dialog.error(err.msg);
        })
    },
    goBargain: function () {
      let that = this
      let bargain = {
          uid: this.userNo,
          bargainId: this.attr.bargainId,
          bargainPrice: this.attr.bargainPrice
      }
      if (that.userAddress.id) {
          bargain.addressId = that.userAddress.id
      }
      getBargainStart(bargain).then(res => {
          if (res.code === 200 && res.data.isStart) {
              this.$router.push({path: "/activity/bargain/" + res.data.id, query: { isStart: true }});
          } else {
              this.$router.push({path: "/activity/bargain/" + res.data.id});
          }
      }).catch(err => {
          that.$dialog.error(err.msg);
      })
    },
    onBridgeReady: function (data) {
        let that = this
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
              "appId": data.appId,     //公众号名称，由商户传入
              "timeStamp": data.timeStamp,  //时间戳，自1970年以来的秒数
              "nonceStr": data.nonceStr, //随机串
              "package": "prepay_id=" + data.prepayId,
              "signType": data.signType,         //微信签名方式：
              "paySign": data.paySign //微信签名
          },
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                that.$router.push({
                    path: "/order/status/" + data.orderNo + "/1"
                });
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                that.$router.push({
                    path: "/order/status/" + data.orderNo + "/5", query: { msg: "支付取消" }
                });
            } else {
                that.$router.push({
                    path: "/order/status/" + data.orderNo + "/5", query: { msg: "支付出错" }
                });
            }
        });
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

.payment.up {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
}

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
</style>
