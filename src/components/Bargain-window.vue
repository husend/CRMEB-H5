<template>
  <div>
    <div class="coupon-window" :class="value ? 'on' : ''">
      <div class="couponWinList">
        <!--        <div-->
        <!--          class="item acea-row row-between-wrapper"-->
        <!--          v-for="(item, index) in couponList"-->
        <!--          :key="index"-->
        <!--        >-->
        <!--          <div class="money font-color-red">-->
        <!--            ￥<span class="num">{{ item.coupon_price }}</span>-->
        <!--          </div>-->
        <!--          <div class="text">-->
        <!--            <div class="name">-->
        <!--              购物买{{ item.use_min_price }}减{{ item.coupon_price }}-->
        <!--            </div>-->
        <!--            <div v-if="item.end_time">-->
        <!--              {{ item.start_time ? item.start_time + "-" : ""-->
        <!--              }}{{ item.end_time }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="item acea-row row-between-wrapper">
          <div class="money font-color-red">
            ￥<span class="num">199</span>
          </div>
          <div class="text">
            <div class="name">
              购物买200减10
            </div>
            <div>
              2020-03-30-2020-03-31
            </div>
          </div>
        </div>
        <div style="height:1.2rem"></div>
      </div>
<!--      <div class="lid">-->
<!--        <div class="bnt font-color-red" @click="checked">立即领取</div>-->
<!--        <div class="iconfont icon-guanbi3" @click="close"></div>-->
<!--      </div>-->
    </div>
    <div class="mask" @touchmove.prevent :hidden="!value"></div>
  </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import toLogin from "@libs/login";
    import { couponReceiveBatch } from "@api/user";

    export default {
        name: "CouponWindow",
        props: {
            couponList: {
                type: Array,
                default: () => []
            }
        },
        computed: mapGetters(["isLogin"]),
        data: function() {
            return {
                value: true
            };
        },
        mounted: function() {},
        methods: {
            checked() {
                const isLogin = this.isLogin;
                if (!isLogin) return toLogin();

                const ids = this.couponList.reduce((initial, coupon) => {
                    initial.push(coupon.id);
                    return initial;
                }, []);
                couponReceiveBatch(ids)
                    .then(() => {
                        this.$emit("success");
                        this.$dialog.toast({ mes: "领取成功" });
                    })
                    .catch(() => {
                        this.$dialog.toast({ mes: "已领取" });
                    });
                if (isLogin) {
                    this.value = false;
                    this.$emit("checked");
                }
            },
            close: function() {
                this.value = false;
                this.$emit("close");
            }
        }
    };
</script>
<style scoped>
  .coupon-window{
    background-image:url('../images/bargain-window.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    width:6.3rem;
    height:6.49rem;
    position:fixed;
    top:20%;
    z-index:99;
    left:50%;
    margin-left:-3.05rem;
    transform:translate3d(0,-200%,0);
    -webkit-transform:translate3d(0,-200%,0);
    -ms-transform:translate3d(0,-200%,0);
    -moz-transform:translate3d(0,-200%,0);
    -o-transform:translate3d(0,-200%,0);
    transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -webkit-transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -moz-transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -o-transition:all .3s cubic-bezier(.25,.5,.5,.9);
  }
  .coupon-window.on{transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);}
  .coupon-window .couponWinList{width:4.8rem;margin:1.57rem 0 0 0.6rem;height:4.15rem;overflow:auto;}
  .coupon-window .couponWinList .item{width:100%;height:1.2rem;background-color:#fff;position:relative;margin-bottom:0.17rem;}
  .coupon-window .couponWinList .item::after{content:'';position: absolute;width:0.18rem;height: 0.18rem;border-radius: 50%;background-color: #f2443a;left:25.5%;bottom:0;margin-bottom:-0.09rem;}
  .coupon-window .couponWinList .item::before{content:'';position: absolute;width:0.18rem;height: 0.18rem;border-radius: 50%;background-color: #f2443a;left:25.5%;top:0;margin-top:-0.09rem;}
  .coupon-window .couponWinList .item .money{width:1.3rem;border-right:1px dashed #ddd;height:100%;text-align:center;line-height:1.2rem;font-size:0.26rem;font-weight:bold;}
  .coupon-window .couponWinList .item .money .num{font-size:0.4rem;}
  .coupon-window .couponWinList .item .text{width:3.49rem;font-size:0.22rem;color:#999;padding:0 0.29rem;}
  .coupon-window .couponWinList .item .text .name{font-size:0.26rem;color:#282828;font-weight:bold;margin-bottom:0.09rem;}
  .coupon-window .lid{background-image:url('../images/coupon-window2.png');background-repeat:no-repeat;background-size:100% 100%;width:5.73rem;height:2.24rem;position:fixed;left:50%;top:20%;margin:4.24rem 0 0 -2.96rem;}
  .coupon-window .lid .bnt{font-size:0.29rem;width:4.4rem;height:0.8rem;border-radius:0.4rem;background-color:#f9f1d3;text-align:center;line-height:0.8rem;font-weight:bold;margin:0.98rem auto 0 auto;}
  .coupon-window .lid .iconfont{color:#fff;font-size:0.6rem;text-align:center;margin-top:0.87rem;}
</style>
