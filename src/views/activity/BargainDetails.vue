<template>
  <div class="bargainDetail">
    <div class="banner">
      <img :src="courseLogo">
    </div>
    <div class="container">
      <div class="container-title">
        <div class="container-bg">
          <div class="countdown_dashboard" v-if="storeInfo.status === 1">
            <CountDown
              :is-day="false"
              :tip-text="''"
              :day-text="''"
              :hour-text="':'"
              :minute-text="':'"
              :second-text="''"
              :datatime="datatime/1000"
            ></CountDown>
            <div>&nbsp;后过期</div>
          </div>
          <div class="countdown_dashboard" v-else>
            <div>砍价已经结束</div>
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div v-if="!isHelped" class="wrapper-text">
          已砍<span ref="numberGrow" style="font-size: 18px;color: #e93323">{{storeInfo.price}}</span>，仅差<span style="font-size: 18px;color: #e93323">{{((1 - (storeInfo.price/storeInfo.bargainPrice))*100).toFixed(2)}}%</span>免费拿
        </div>
        <div v-else class="wrapper-text">
          已帮助好友砍价，你也去免费拿吧
        </div>
        <div class="votebox">
          <ProgressBar  :color="'#eb0000'" :height="10" :percentage="(storeInfo.price/storeInfo.bargainPrice)*100"></ProgressBar>
        </div>
      </div>
      <div class="price-btn">
        <div v-if="storeInfo.uid === userNo" class="right chop" @click="setPosterImageStatus">邀请好友帮砍一刀</div>
        <div v-if="storeInfo.uid !== userNo && !isHelped" class="right chop" @click="helpBargain">帮好友砍一刀</div><!--  -->
        <div v-if="storeInfo.uid !== userNo && isHelped" class="right chop" @click="toBargain">发起砍价免费拿</div>
      </div>
    </div>
    <div class="container">
      <div class="container-title">
        <span class="container-item">砍价记录</span>
      </div>
      <div class="container-record">
        <div class="container-list" v-for="(item, index) in storeInfo.bargainUserHelpDTOList" :key="index">
          <img :src="item.userExtVO.headImgUrl" />
          <span class="nick">{{item.userExtVO.nickname}}</span>
          <span class="bargained">
            <div>砍掉{{item.price}}元</div>
          </span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="container-title">
        <div class="container-bg">活动规则</div>
      </div>
      <div class="container-rule">
        <p>1.邀请好友帮忙砍价，在24小时内砍价金额砍到0元，成功后即可获得该商品</p>
        <p>2.若没有在24小时内砍到0元，则砍价失败</p>
        <p>3.所有解释权归商家所有</p>
      </div>
    </div>
    <Bargain-window
      :storeInfo="storeInfo"
      v-if="showWindow"
      :isSuccess="isSuccess"
      :hasTrainaid="hasTrainaid"
      @close="windowClose"
    ></Bargain-window>
    <ShareInfo v-on:setShareInfoStatus="setShareInfoStatus" :shareInfoStatus="shareInfoStatus"></ShareInfo>
    <InvitePoster v-on:setPosterImageStatus="setPosterImageStatus" :posterImageStatus="posterImageStatus" :posterData="posterData"></InvitePoster>
  </div>
</template>
<script>
import { getBargainDetail, toBargainHelp, getBargainHelpByUid, getBargainPoster } from "@api/activity";
import { postCartAdd } from "@api/store";
import { imageBase64 } from "@api/public";
import { isWeixin } from "@utils/index";
import { openShareAll } from "@libs/wechat";
// import InvitePoster from "@components/InvitePoster";
import { mapGetters } from "vuex";

const NAME = "BargainDetails";

export default {
  name: NAME,
  inject: ['reload'],
  components: {
    ProductConSwiper: () => import("@components/ProductConSwiper"),
    CountDown: () => import("@components/CountDown"),
    InvitePoster: () => import("@components/InvitePoster"),
    ProgressBar: () => import("@components/ProgressBar"),
    ShareInfo: () => import("@components/ShareInfo"),
    BargainWindow: resolve => require(['@components/BargainWindow'], resolve)
  },
  props: {},
  data: function() {
    return {
      currentComponent: '',
      hasTrainaid: false,
      isSuccess: false,
      showWindow: false,
      couponList: [],
      domStatus: false,
      image: '',
      headImg: "",
      posterData: {
        image: "",
        headImg: "",
        title: "",
        price: "",
        code: ""
      },
      posterImageStatus: false,
      action: "",
      imgUrls: [],
      storeInfo: {},
      replyCount: 0,
      reply: [],
      cartNum: 1,
      attr: {
        cartAttr: false,
        productSelect: {
          image: "",
          store_name: "",
          price: "",
          stock: "",
          unique: "",
          cart_num: 1
        }
      },
      datatime: 0,
      courseLogo:'',
      isHelped: false,
      shareInfoStatus: false,
      shareConfig: {
        desc: '是兄弟，就来砍我',
        title: '是兄弟，就来砍我',
        link: location.href, //+ '?userNo=' + this.storeInfo.uid,
        imgUrl: ''
      }
    };
  },
  watch: {
    $route: function(n) {
      let that = this;
      console.log(n);
      if (n.name === NAME) {
        that.mountedStart();
      }
    }
  },
  mounted: function() {
      let isStart = this.$route.query.isStart
      if (isStart === true || isStart === 'true') {
          this.showWindow = true
      } else {
          this.showWindow = false
      }
      this.mountedStart();
      // isWeixin() && openShareAll(this.shareConfig);
  },
  computed: {
      ...mapGetters(["userNo"]),

  },
  methods: {
    async mountedStart() {
      let that = this;
      that.isSuccess = false
      that.showWindow = false
      let id = that.$route.params.id;
      let bargainDetail = await getBargainDetail({id: id})
      that.storeInfo = bargainDetail.data
      that.datatime = Date.parse(that.storeInfo.addTime) + 24 * 60 * 60 * 1000
      that.courseLogo = that.storeInfo.courseViewDTO.courseLogo
      that.shareConfig.imgUrl = that.courseLogo
          // .then(res => {
          //     that.$set(that, "storeInfo", res.data);
          //     that.datatime = Date.parse(that.storeInfo.addTime) + 24 * 60 * 60 * 1000
          // });
        that.$nextTick(function () {    //dom已更新
            that.numberGrow(that.$refs.numberGrow, that.storeInfo)
      })
        //判断是否已经砍价
      that.isHelped = false
      if (that.storeInfo.uid !== that.userNo) {
          let bargainUserHelp = await getBargainHelpByUid({uid: that.userNo, bargainUserId: id})
          if (bargainUserHelp.data) {
              that.isHelped = true
          }
      }
      // 判断是否砍价成功
      if (that.storeInfo.status === 3) {
          if (that.storeInfo.courseViewDTO.hasTrainaid === 2) {
            //有教具，需要填写地址
            that.hasTrainaid = true
          }
          that.isSuccess = true
          that.showWindow = true
      }
    },
    setShare: function() {
      isWeixin() && openShareAll(this.shareConfig);
      this.shareInfoStatus = true
    },
    getImageBase64: function() {
      let that = this;
      imageBase64(that.image, that.headImg).then(res => {
        that.posterData.image = res.data.image;
        that.posterData.headImg = res.data.headImg;
      });
    },
    updateTitle() {
      document.title = this.storeInfo.title || this.$route.meta.title;
    },
    setPosterImageStatus:async function() {
      let that = this
      let sTop = document.body || document.documentElement;
      sTop.scrollTop = 0;
      if (!that.posterImageStatus) {
          let res = await getBargainPoster({posterType: 2, userNo: that.userNo})
          that.posterData.image = res.data.poster
          that.posterData.headImg = res.data.headImg
      }
      // that.getImageBase64()
      that.posterImageStatus = !this.posterImageStatus;
      // that.currentComponent = InvitePoster
    },
    //将父级向子集多次传送的函数合二为一；
    changeFun: function(opt) {
      if (typeof opt !== "object") opt = {};
      let action = opt.action || "";
      let value = opt.value === undefined ? "" : opt.value;
      this[action] && this[action](value);
    },
    changeattr: function(res) {
      let that = this;
      that.attr.cartAttr = res;
    },
    ChangeCartNum: function(res) {
      let that = this;
      if (res) {
        if (that.attr.productSelect.cart_num < that.storeInfo.stock) {
          that.attr.productSelect.cart_num++;
        }
      } else {
        if (that.attr.productSelect.cart_num > 1) {
          that.attr.productSelect.cart_num--;
        }
      }
    },
    setProductSelect: function() {
      let that = this;
      let attr = that.attr;
      attr.productSelect.image = that.storeInfo.image;
      attr.productSelect.store_name = that.storeInfo.title;
      attr.productSelect.price = that.storeInfo.price;
      attr.productSelect.stock = that.storeInfo.stock;
      attr.cartAttr = false;
      that.$set(that, "attr", attr);
    },
    selecAttrTap: function() {
      this.cartAttr = true;
    },
    tapBuy: function() {
      let that = this;
      if (that.attr.cartAttr == false) {
        that.attr.cartAttr = !this.attr.attrcartAttr;
      } else {
        let data = {};
        data.productId = that.storeInfo.product_id;
        data.cartNum = that.attr.productSelect.cart_num;
        data.uniqueId = that.attr.productSelect.unique;
        data.secKillId = that.storeInfo.id;
        data.new = 1;
        postCartAdd(data)
          .then(res => {
            that.$router.push({
              path: "/order/submit/" + res.data.cartId
            });
          })
          .catch(res => {
            this.$dialog.error(res.msg);
          });
      }
    },
    numberGrow(ele, storeInfo) {
        let step = (storeInfo.price * 10) / (2 * 1000)
        let current = 0
        let start = 0
        let t = setInterval(function () {
            start += step
            if (start > storeInfo.price) {
                clearInterval(t)
                start = storeInfo.price
                t = null
            }
            if (current === start) {
                return
            }
            current = start
            ele.innerHTML = current.toFixed(2).toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
        }, 10)
    },
    helpBargain() {
        let that = this
        if (!that.isHelped) {
          toBargainHelp({id: this.storeInfo.id, userNo: this.userNo}).then(res => {
              if (res.code === 200) {
                  this.mountedStart()
                  this.showWindow = true
                  this.isSuccess = res.data.isSuccess
              } else {
                  this.$dialog.error(res.msg);
              }
          }).catch(err => {
              this.$dialog.error(err.msg);
          })
        }
    },
    toBargain() {
        this.$router.push({path:'/category'})
    },
    setShareInfoStatus: function() {
        this.shareInfoStatus = !this.shareInfoStatus;
    },
    windowClose() {
      this.showWindow = false
    }
  }
};
</script>
<style scoped>
.bargainDetail {
  font-family: "微软雅黑";
  font-size: .26rem;
  /*height: 100%;*/
  min-height: 100%;
  height: auto;
  background: #cc2213;
}
.banner {
  width: 100%;
}
.banner img {
  height: 100%;
  width: 100%;
}
.container {
  border-radius: .1rem;
  background: #fff7c9;
  margin: 0 .3rem .4rem .3rem;
  overflow: hidden;
}
.container-title {
  background: #fe8007;
  border-radius: .1rem;
  height: .8rem;
  line-height: .8rem;
  position: relative;
}
.container-bg {
  /*background: url(../images/tf.png) no-repeat;*/
  background-size: 100% 100%;
  font-size: .3rem;
  width: 80%;
  position: absolute;
  left: 10%;
  /*top: -.1rem;*/
  height: 100%;
  text-align: center;
  color: #fff;
}
.countdown_dashboard {
  overflow: hidden;
  /*padding: .12rem .4rem;*/
  width: 5rem;
  height: 100%;
  display: inline-flex;
  justify-content:center;
}
.countdown_dashboard .dash {
  float: left;
  display: inline-block;
  color: #fff;
}
.countdown_dashboard .digit {
  font-size: .3rem;
  float: left;
  width: .3rem;
  height: .5rem;
  line-height: .5rem;
  text-align: center;
  border-radius: .05rem;
  margin-right: .1rem;
}
.countdown_dashboard .item {
  line-height: .6rem;
  margin-right: .1rem;
}
.wrapper {
  width: 85%;
  margin: 0 auto;
  color: #1e1e1e;
  padding: .3rem;
  font-size: .28rem;
  text-align: center;
}
.wrapper-text {
  display: inline-flex;
  justify-content:center;
  align-items:center;
}
.votebox {
  margin-top: .4rem;
}
.barbox dd {
  float: left;
}
.barbox dd.barline {
  width: 100%;
  background: #fce877;
  height: .25rem;
  display: inline;
  border-radius: .15rem;
  position: relative;
}
.price-box {
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  line-height: .6rem;
  border-bottom: 1px solid #fce877;
}
.price-box .price-box-left {
  float: left;
}
.price-box .price-box-right {
  float: right;
}
.price-btn {
  width: 70%;
  margin: 0.1rem 0 0.2rem 1rem;
  overflow: hidden;
  /*padding: .3rem 0;*/
  display: inline-flex;
  align-items:center;
}
.price-btn .left {
  float: left;
  background: #ffa60a;
  color: #fff;
  width: 2rem;
  height: .5rem;
  text-align: center;
  line-height: .5rem;
  border-radius: .25rem;
}
.price-btn .right {
  float: right;
  background: #ff5041;
  color: #fff;
  width: 100%;
  height: .6rem;
  text-align: center;
  line-height: .5rem;
  border-radius: 0.25rem;
  font-size: 16px;
}
.container-title .container-item {
  color: #fff;
  width: 100%;
  text-align: center;
  display: block;
  float: left;
  font-size: .3rem;
}
.container-record {
  max-height: 241px;
  text-align: center;
  overflow-y: scroll;
}
.container-list {
  overflow: hidden;
  display: inline-flex;
  width: 100%;
  padding: 0 0.6rem;
  height: 0.8rem;
  /*border: 1px solid red;*/
  align-items: center;
}
.container-list img{
  flex-shrink: 2;
  flex-grow: 0;
  border-radius: 50%;
  height: 100%;
}
.container-list .bargained{
  text-align: right;
  flex-grow: 1;
}
.page {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  border-top: 1px solid #fce877;
  line-height: .6rem;
}
.page .page-up {
  text-align: left;
}
.page a {
  float: left;
  display: block;
  width: 33.33%;
  color: #595959;
}
.page .page-mid {
  text-align: center;
}
.page .page-down {
  text-align: right;
}
.container-product {
  overflow: hidden;
}
.product-pic {
  float: left;
  width: 30%;
}
.product-text {
  float: left;
  padding-top: .4rem;
}
.container-rule {
  color: #5c4943;
  padding: .15rem;
}
</style>
