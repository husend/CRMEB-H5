<template>
  <div class="payment-status" v-cloak v-if="paid !== 0">
    <!--失败时： 用icon-iconfontguanbi fail替换icon-duihao2 bg-color-red-->
    <div
      class="iconfont icon-duihao2 bg-color-red"
      v-if="!isWeixin || paid === 2 || orderInfo.payType == 'offline'"
    ></div>
    <div class="iconfont icon-iconfontguanbi fail" v-else></div>
    <!-- 失败时：订单支付失败 -->
    <div class="status"
      v-if="(!isWeixin && orderInfo.payType === 1) || orderInfo.pay_type == 'offline'">
      订单创建成功
    </div>
    <div class="status" v-else-if="paid === 2">订单支付成功</div>
    <div class="status" v-else>订单支付失败</div>
    <div class="wrapper">
      <div class="item acea-row row-between-wrapper">
        <div>订单编号</div>
        <div class="itemCom" v-text="orderInfo.orderNo"></div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>支付时间</div>
        {{orderInfo.payTime | dateString('YYYY-MM-DD HH:mm:ss')}}
<!--        <div class="itemCom" v-text="orderInfo.payTime | dateString('YYYY年MM月DD日 HH:mm:ss')"></div>-->
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>支付方式</div>
<!--        <div class="itemCom"-->
<!--          v-if="orderInfo.payType === 1 && orderInfo.is_channel == 2"-->
<!--        >-->
<!--          H5微信支付-->
<!--        </div>-->
        <div class="itemCom" v-if="orderInfo.payType === 1">
          微信支付
        </div>
        <div class="itemCom" v-if="orderInfo.payType == 'yue'">余额支付</div>
        <div class="itemCom" v-if="orderInfo.payType == 'offline'">
          线下支付
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>支付金额</div>
        <div class="itemCom" v-text="orderInfo.pricePaid"></div>
      </div>
      <!--失败时加上这个  -->
      <div class="item acea-row row-between-wrapper"
        v-if="paid === 1 && orderInfo.payType === 1 && isWeixin && msgContent">
        <div>失败原因</div>
        <div class="itemCom" v-text="msgContent"></div>
      </div>
    </div>
    <!--失败时： 重新购买 -->
    <div v-if="paid === 1">
      <div class="returnBnt bg-color-red" @click="goPages()">查看支付结果</div>
      <div class="returnBnt cart-color" @click="goPages()">
        支付失败重新支付
      </div>
    </div>
    <div v-else>
      <div class="returnBnt bg-color-red" @click="goPages()">查看订单</div>
      <div class="returnBnt cart-color" @click="goPages('/')">返回首页</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { orderDetail } from "@api/order";
import { isWeixin } from "@utils";
const NAME = "PayMentStatus";

export default {
  name: NAME,
  props: {},
  data: function() {
    return {
      id: "",
      status: 0,
      msgContent: "",
      orderInfo: {},
      isWeixin: isWeixin(),
      paid: 0
    };
  },
  watch: {
    $route(n) {
      if (n.query.msg) this.msgContent = n.query.msg;
      if (n.name === NAME && this.id !== n.params.id) {
        this.id = n.params.id;
        this.status = parseInt(n.params.status);
        this.getOrderInfo();
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.id = this.$route.params.id;
    this.msgContent = this.$route.query.msg;
    this.status = parseInt(this.$route.params.status);
    this.getOrderInfo();
  },
  methods: {
    goPages(route) {
      let routes = route !== undefined ? route : "/order/detail/" + this.id;
      if (this.status === 5 && route === undefined) routes = "/order/list/0";
      return this.$router.push({
        path: routes
      });
    },
    getOrderInfo() {
      orderDetail({orderNo: this.id}).then(res => {
        this.orderInfo = res.data;
        if (this.isWeixin) {
            if (this.orderInfo.orderStatus >= 2) {
                document.title = "支付成功"
                this.paid = 2
            } else {
                document.title = "支付失败"
                this.paid = 1
            }
        } else {
          document.title = "订单创建成功";
        }
      });
    }
  }
};
</script>
<style scoped>
  [v-cloak]{
    display: none;
  }
</style>
