<template>
  <div>
    <div class="bargain-window" :class="value ? 'on' : ''">
      <div class="couponWinList">
        <div v-if="storeInfo.uid === userNo && !isSuccess" class="text">
          你已砍了<span class="money">{{storeInfo.price}}</span>元,<br/>
          仅差{{((1 - (storeInfo.price/storeInfo.bargainPrice))*100).toFixed(2)}}%免费拿
        </div>
        <div v-if="storeInfo.uid !== userNo && !isSuccess" class="text">
          你帮砍了<span class="money">{{storeInfo.price}}</span>元,<br/>
          仅差{{((1 - (storeInfo.price/storeInfo.bargainPrice))*100).toFixed(2)}}%免费拿
        </div>
        <div v-if="storeInfo.uid === userNo && isSuccess" class="text">
          恭喜！你已砍价成功
        </div>
        <div v-if="storeInfo.uid !== userNo && isSuccess" class="text">
          已帮助好友砍价成功，你也去免费拿吧
        </div>
        <div class="votebox">
          <ProgressBar  :color="'#F08F21'" :height="20" :percentage="(storeInfo.price/storeInfo.bargainPrice)*100"></ProgressBar>
        </div>
<!--        <div class="head">-->
<!--          <img :src="headImg" />-->
<!--        </div>-->
        <div v-if="storeInfo.uid === userNo && !isSuccess" class="btn" @click="toInvite()">
          邀请好友砍一刀
        </div>
        <div v-else-if="storeInfo.uid === userNo && isSuccess" class="btn" @click="toWatch()">
          去学习
        </div>
        <div v-else class="btn" @click="toBargain()">
          免费拿课程
        </div>
      </div>
<!--      <div class="lid">-->
<!--        <div class="btn" @click="close"></div>-->
<!--      </div>-->
    </div>
    <div class="mask" @touchmove.prevent :hidden="!value" @click="close"></div>
  </div>
</template>
<script>
    import { mapGetters } from "vuex";

    export default {
        name: "BargainWindow",
        components: {
            ProgressBar: () => import("@components/ProgressBar")
        },
        props: {
            couponList: {
                type: Array,
                default: () => []
            },
            storeInfo: {
                type: Object,
                default: () => {}
            },
            isSuccess: {
                type: Boolean,
                default: false
            },
            hasTrainaid: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapGetters(["isLogin", "userNo"]),
        },
        data: function() {
            return {
                value: true
            };
        },
        mounted: function() {},
        methods: {
            toInvite() {
                //生成海报
                this.value = false;
                this.$emit("close");
            },
            toBargain() {
                this.value = false;
                this.$emit("close");
                this.$router.push({path: "/category"});
            },
            toWatch() {
                this.$router.push({path: '/detail/' + this.storeInfo.courseViewDTO.id});
            },
            close: function() {
                this.value = false;
                this.$emit("close");
            }
        }
    };
</script>
<style scoped>
  .bargain-window{
    background-image: url('../assets/images/bargain-window.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 8rem;
    position: fixed;
    top: 40%;
    left: 50%;
    z-index:99;
    /*border: 1px solid red;*/
    /*background-color: white;*/
    /*margin-left: 10%;*/
    border-radius: 5%;
    transform:translate3d(-50%,-200%,0);
    -webkit-transform:translate3d(-50%,-200%,0);
    -ms-transform:translate3d(-50%,-200%,0);
    -moz-transform:translate3d(-50%,-200%,0);
    -o-transform:translate3d(-50%,-200%,0);
    transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -webkit-transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -moz-transition:all .3s cubic-bezier(.25,.5,.5,.9);
    -o-transition:all .3s cubic-bezier(.25,.5,.5,.9);
  }
  .bargain-window.on{
    /*animation: show 1s alternate infinite;*/
    /*-webkit-animation: show 1s alternate infinite;*/
    /*-moz-animation: show 1s alternate infinite;*/
    /*-o-animation: show 1s alternate infinite;*/

    transform:translate3d(-50%,-50%,0);
    -webkit-transform:translate3d(-50%,-50%,0);
    -ms-transform:translate3d(-50%,-50%,0);
    -moz-transform:translate3d(-50%,-50%,0);
    -o-transform:translate3d(-50%,-50%,0);
  }
  .bargain-window .couponWinList{
    width: 72%;
    height: 100%;
    margin-left: 14%;
    text-align: center;
  }
  .bargain-window .couponWinList .text{
    position: relative;
    width: 100%;
    /*left: 34%;*/
    margin-top: 65%;
    font-size: 0.4rem;
    color: #563712;
  }
  .bargain-window .couponWinList .text .money{
    border-radius: 50%;
    width: 100%;
    height: 100%;
    color: #E54C4C;
    font-size: 0.6rem;
  }
  .bargain-window .couponWinList .votebox{
    width: 80%;
    margin-top: 10%;
    margin-left: 10%;
    text-align: center;
  }
  .bargain-window .couponWinList .btn{
    width: 90%;
    height: 0.8rem;
    color: white;
    background-color: #F08F21;
    margin-top: 8%;
    margin-left: 5%;
    border-radius: 0.8rem;
    vertical-align: center;
    font-size: 0.4rem;
    padding-top: 0.06rem;
  }
  .bargain-window .couponWinList .item::after{content:'';position: absolute;width:0.18rem;height: 0.18rem;border-radius: 50%;background-color: #f2443a;left:25.5%;bottom:0;margin-bottom:-0.09rem;}
  .bargain-window .couponWinList .item::before{content:'';position: absolute;width:0.18rem;height: 0.18rem;border-radius: 50%;background-color: #f2443a;left:25.5%;top:0;margin-top:-0.09rem;}
  .bargain-window .couponWinList .item .money{width:1.3rem;border-right:1px dashed #ddd;height:100%;text-align:center;line-height:1.2rem;font-size:0.26rem;font-weight:bold;}
  .bargain-window .couponWinList .item .money .num{font-size:0.4rem;}
  .bargain-window .couponWinList .item .text{width:3.49rem;font-size:0.22rem;color:#999;padding:0 0.29rem;}
  .bargain-window .couponWinList .item .text .name{font-size:0.26rem;color:#282828;font-weight:bold;margin-bottom:0.09rem;}
  .bargain-window .lid{
    width: 100%;
    height:1.24rem;
    position:fixed;
    top: 100%;
    border: 1px solid red;
  }
  .bargain-window .lid .bnt{font-size:0.29rem;width:4.4rem;height:0.8rem;border-radius:0.4rem;background-color:#f9f1d3;text-align:center;line-height:0.8rem;font-weight:bold;margin:0.98rem auto 0 auto;}
  .bargain-window .lid .iconfont{
    color:#fff;
    font-size:0.6rem;
    text-align:center;
    margin-top: 1%;
  }

  @keyframes show{
    0%{width: 0%;height: 0%;font-size: 0rem;}
    5%{width: 5%;height: 2.75%;font-size: 5%;}
    10%{width: 10%;height: 5.5%;font-size: 10%;}
    15%{width: 15%;height: 8.25%;font-size: 15%;}
    20%{width: 20%;height: 11%;font-size: 20%;}
    25%{width: 25%;height: 13.75%;font-size: 25%;}
    30%{width: 30%;height: 16.5%;font-size: 30%;}
    35%{width: 35%;height: 19.25%;font-size: 35%;}
    40%{width: 40%;height: 22%;font-size: 40%;}
    45%{width: 45%;height: 24.75%;font-size: 45%;}
    50%{width: 50%;height: 27.5%;font-size: 50%;}
    55%{width: 55%;height: 30.25%;font-size: 55%;}
    60%{width: 60%;height: 33%;font-size: 0rem;}
    65%{width: 65%;height: 35.75%;font-size: 0.05rem;}
    70%{width: 70%;height: 38.5%;font-size: 0.1rem;}
    75%{width: 75%;height: 41.25%;font-size: 0.15rem;}
    80%{width: 80%;height: 44%;font-size: 0.2rem;}
    85%{width: 85%;height: 46.75%;font-size: 0.25rem;}
    90%{width: 90%;height: 49.5%;font-size: 0.3rem;}
    95%{width: 95%;height: 52.25%;font-size: 0.35rem;}
    100%{width: 100%;height: 55%;font-size: 0.4rem;}
  }
  @keyframes fade{
    0%{opacity: 0;}
    5%{opacity: 0.05;}
    10%{opacity: 0.1;}
    15%{opacity: 0.15;}
    20%{opacity: 0.2;}
    25%{opacity: 0.25;}
    30%{opacity: 0.3;}
    35%{opacity: 0.35;}
    40%{opacity: 0.4;}
    45%{opacity: 0.45;}
    50%{opacity: 0.5;}
    55%{opacity: 0.55;}
    60%{opacity: 0.6;}
    65%{opacity: 0.65;}
    70%{opacity: 0.7;}
    75%{opacity: 0.75;}
    80%{opacity: 0.75;}
    85%{opacity: 0.85;}
    90%{opacity: 0.9;}
    95%{opacity: 0.95;}
    100% {opacity: 1}
  }
  @-webkit-keyframes fade{
    0% {opacity: 0;}
    100% {opacity: 1}
  }
  @-moz-keyframes fade{
    0% {opacity: 0;}
    100% {opacity: 1}
  }
  @-o-keyframes fade{
    0% {opacity: 0;}
    100% {opacity: 1}
  }
</style>
