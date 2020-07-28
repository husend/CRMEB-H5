<template>
  <div class="my-order" ref="container">
    <div class="header bg-color-red">
      <div class="picTxt acea-row row-between-wrapper">
        <div class="text">
          <div class="name">订单信息</div>
<!--          <div>-->
<!--            累计订单：{{ orderData.order_count || 0 }}-->
<!--            总消费：￥{{ orderData.sum_price || 0 }}-->
<!--          </div>-->
        </div>
        <div class="pictrue"><img src="@assets/images/orderTime.png" /></div>
      </div>
    </div>
    <div class="nav acea-row row-around">
      <div class="item" :class="{ on: orderStatus === 1 }" @click="$router.replace({ path: '/order/list/1' })">
        <div>待付款</div>
        <div class="num">{{ orderData.unpaidCount || 0 }}</div>
      </div>
      <div class="item" :class="{ on: orderStatus === 8 }" @click="$router.replace({ path: '/order/list/8' })">
        <div>待拼成</div>
        <div class="num">{{ orderData.unAssembleCount || 0 }}</div>
      </div>
      <div class="item" :class="{ on: orderStatus === 5 }" @click="$router.replace({ path: '/order/list/5' })">
        <div>待发货</div>
        <div class="num">{{ orderData.unshippedCount || 0 }}</div>
      </div>
      <div class="item" :class="{ on: orderStatus === 6 }" @click="$router.replace({ path: '/order/list/6' })">
        <div>待收货</div>
        <div class="num">{{ orderData.receivedCount || 0 }}</div>
      </div>
<!--      <div class="item" :class="{ on: orderStatus === 3 }" @click="$router.replace({ path: '/order/list/3' })">-->
<!--        <div>待评价</div>-->
<!--        <div class="num">{{ orderData.evaluated_count || 0 }}</div>-->
<!--      </div>-->
      <div class="item" :class="{ on: orderStatus === 7 }" @click="$router.replace({ path: '/order/list/7' })">
        <div>已完成</div>
        <div class="num">{{ orderData.completeCount || 0 }}</div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="order in orderList" :key="order.id">
        <div class="title acea-row row-between-wrapper">
          <div class="acea-row row-middle">
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.orderType === 2">
              拼团
            </span>
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.orderType === 3">
              砍价
            </span>
            {{ order.gmtCreate }}
          </div>
          <div class="font-color-red">{{ getStatus(order) }}</div>
        </div>
        <div @click="$router.push({ path: '/order/detail/' + order.orderNo })">
          <div class="item-info acea-row row-between row-top">
            <div class="pictrue">
              <img :src="order.courseLogo"
                  @click.stop="$router.push({ path: '/detail/' + order.courseId })"/>
<!--              <img :src="order.courseLogo"-->
<!--                  @click.stop="-->
<!--                  $router.push({path: '/activity/group_detail/' + cart.combination_id })"-->
<!--                  v-if="cart.combination_id > 0"/>-->
<!--              <img :src="order.courseLogo"-->
<!--                  @click.stop="$router.push({ path: '/activity/dargain_detail/' + cart.bargain_id })"-->
<!--                  v-else-if="cart.bargain_id > 0"/>-->
<!--              <img :src="order.courseLogo"-->
<!--                  @click.stop="-->
<!--                    $router.push({ path: '/activity/seckill_detail/' + cart.seckill_id })"-->
<!--                  v-else-if="cart.seckill_id > 0"/>-->
            </div>
            <div class="text acea-row row-between">
              <div class="name line2">
                {{ order.courseName }}
              </div>
              <div class="money">
                <div>
                  ￥{{ order.pricePaid }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="totalPrice">
          <span v-if="order.couponUser">
            优惠<span class="money font-color-red">￥{{ order.couponUser.couponPrice }}</span>
          </span>
          总金额<span class="money font-color-red">￥{{ order.pricePaid }}</span>
        </div>
        <div class="bottom acea-row row-right row-middle" v-if="order.orderStatus !== 7">
          <template v-if="order.orderStatus === 1">
            <div class="bnt cancelBnt" @click="cancelOrder(order)">
              取消订单
            </div>
            <div class="bnt bg-color-red" @click="paymentTap(order)">
              立即付款
            </div>
          </template>
<!--          <template v-if="order.orderStatus > 1">-->
<!--            <div class="bnt bg-color-red"-->
<!--              @click="$router.push({ path: '/order/detail/' + order.order_id })">-->
<!--              查看详情-->
<!--            </div>-->
<!--          </template>-->
          <template v-if="order.orderStatus === 6">
            <div class="bnt default"
              @click="$router.push({ path: '/order/logistics/' + order.orderNo })">
              查看物流
            </div>
            <div class="bnt bg-color-red" @click="takeOrder(order)">
              确认收货
            </div>
          </template>
<!--          <template v-if="order._status._type === 3">-->
<!--            <div class="bnt default" @click="$router.push({ path: '/order/logistics/' + order.order_id })"-->
<!--              v-if="order.delivery_type === 'express'">-->
<!--              查看物流-->
<!--            </div>-->
<!--            <div class="bnt bg-color-red"-->
<!--              @click="$router.push({ path: '/order/detail/' + order.order_id })">-->
<!--              去评价-->
<!--            </div>-->
<!--          </template>-->
<!--          <template>-->
<!--            <div class="bnt bg-color-red"-->
<!--              @click="$router.push({ path: '/order/detail/' + order.orderNo })">-->
<!--              查看订单-->
<!--            </div>-->
<!--          </template>-->
        </div>
      </div>
    </div>
    <div class="noCart" v-if="orderList.length === 0 && page > 1">
      <div class="pictrue"><img src="@assets/images/noOrder.png" /></div>
    </div>
    <Loading :loaded="loaded" :loading="loading"></Loading>
    <component :is="currentComponent" v-model="pay" :payOrder="payOrder" :userAddress="userAddress" :isNeedAddress="isNeedAddress" :isNeedCoupon="isNeedCoupon" :userCoupon="userCoupon" @checked="toPay"></component>
  </div>
</template>
<script>
import { getOrderData, getOrderList, oldOrderPay, orderDetail } from "@api/order";
import { getAddress } from "@api/user";
import {
  cancelOrderHandle,
  payOrderHandle,
  takeOrderHandle
} from "@libs/order";
import { getUserProductDetail } from "@api/store";
import Loading from "@components/Loading";
import Payment from "@components/Payment";
import { mapGetters } from "vuex";
import { isWeixin } from "@utils";

const STATUS = [
  "待付款",
  "",
  "",
  "待发货",
  "待收货",
  "已完成",
  "待付款"
];

const NAME = "MyOrder";

export default {
  name: NAME,
  data() {
    return {
      offlinePayStatus: 2,
      orderData: {},
      orderStatus: parseInt(this.$route.params.type) || 0,
      page: 1,
      limit: 5,
      loaded: false,
      loading: false,
      orderList: [],
      pay: false,
      payType: ["yue", "weixin"],
      from: isWeixin() ? "weixin" : "weixinh5",
      payOrder: {},
      userAddress: {},
      userCoupon: {},
      orderNo: 0,
      isNeedAddress: 1, // 判断是否需要选择地址
      isNeedCoupon: 1, // 判断是否需要选择优惠券
      currentComponent: '' // 子组件显示时才渲染
    };
  },
  components: {
    Loading,
    Payment
  },
  computed: mapGetters(["userInfo"]),
  watch: {
    '$route'(n) {
      if (n.name === NAME) {
        const orderStatus = parseInt(this.$route.params.type) || 0;
        if (this.orderStatus !== orderStatus) {
          this.changeType(orderStatus);
        }
        this.getOrderData();
      }
    }
  },
  methods: {
    setOfflinePayStatus: function(status) {
      var that = this;
      that.offlinePayStatus = status;
      if (status === 1) {
        if (that.payType.indexOf("offline") < 0) {
          that.payType.push("offline");
        }
      }
    },
    getOrderData() {
      getOrderData().then(res => {
        this.orderData = res.data;
      });
    },
    takeOrder(order) {
      takeOrderHandle(order.order_id).finally(() => {
        this.reload();
        this.getOrderData();
      });
    },
    reload() {
      this.changeType(this.orderStatus);
    },
    changeType(orderStatus) {
      this.orderStatus = orderStatus;
      this.orderList = [];
      this.page = 1;
      this.loaded = false;
      this.loading = false;
      this.getOrderList();
    },
    getOrderList() {
      if (this.loading || this.loaded) return;
      this.loading = true;
      const { page, limit, orderStatus } = this;
      let that = this
      getOrderList({
        pageCurrent: page,
        pageSize: limit,
        orderStatus: orderStatus
      }).then(res => {
          that.orderList = that.orderList.concat(res.data.list);
          that.page++;
          that.loaded = res.data.list.length < that.limit;
          that.loading = false;
      });
    },
    getStatus(order) {
      return STATUS[order.orderStatus];
    },
    cancelOrder(order) {
      cancelOrderHandle(order.orderNo).then(() => {
          this.orderList.splice(this.orderList.indexOf(order), 1);
        }).catch(() => {
          this.reload();
        });
    },
    paymentTap: async function(order) {
      let that = this
      that.currentComponent = Payment
      //因为是已经有的订单，所以判断是否有地址内容来显示地址
      if (order.shippingAddressVO) {
          that.isNeedAddress = 2
          that.userAddress = order.shippingAddressVO
      }
      if (order.couponUser) {
          that.isNeedCoupon = 2
          that.userCoupon = order.couponUser
      }
      this.pay = true;
      this.payOrder = order
      this.orderNo = order.orderNo
    },
    toPay() {
        let that = this
        let order = {}
        order.orderNo = this.orderNo
        order.payType = 1
        order.tradeType = "JSAPI"
        order.shippingAddressId = that.userAddress.id
        order.couponUserId = that.userCoupon.id
        if (isWeixin()) {
            oldOrderPay(order).then(res => {
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
                        path: "/order/status/" + data.orderNo + "/5",
                        query: { msg: "支付取消" }
                    });
                } else {
                    that.$router.push({
                        path: "/order/status/" + data.orderNo + "/5",
                        query: { msg: "支付出错" }
                    });
                }
            });
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
    }
  },
  mounted: async function() {
    if (this.$route.query.payOrderNo) {
        let addressId = this.$route.query.addressId
        this.orderNo = this.$route.query.payOrderNo
        let that = this
        await getAddress({id: addressId}).then(res => {
            that.userAddress = res.data;
        });
        await orderDetail({orderNo: that.orderNo}).then(res => {
            that.payOrder = res.data
        })
        this.pay = true
    }
    this.getOrderData();
    this.getOrderList();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.getOrderList();
    });
  }
};
</script>

<style scoped>
.noCart {
  margin-top: 0.17rem;
  padding-top: 0.1rem;
}

.noCart .pictrue {
  width: 4rem;
  height: 3rem;
  margin: 0.7rem auto 0.5rem auto;
}

.noCart .pictrue img {
  width: 100%;
  height: 100%;
}
</style>
