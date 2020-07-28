<template>
  <div class="bargainDetail">
    <div class="banner">
      <img src="courseLogo">
    </div>
    <div class="container">
      <div class="container-title">
        <div class="container-bg">
          <div class="countdown_dashboard">
            <div @click="toogle = 1">
              <span :class="toogle === 1 ? 'on' : ''">输入兑换码</span>
            </div>
            <div @click="toogle = 2" style="margin-left: 0.7rem">
              <span :class="toogle === 2 ? 'on' : ''">我的兑换码</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="toogle === 1">
        <div class="wrapper">
          <div class="wrapper-text">
            <input v-if="inviteUser === null" v-model="convertCode" style="border-bottom: 1px solid red;text-align: center;" />
            <span v-else>{{inviteUser.inviteCode}}</span>
          </div>
        </div>
        <div class="price-btn">
          <div v-if="inviteUser === null" class="right chop" @click="convert(convertCode)">兑换</div>
          <div v-else class="right off chop">兑换</div>
        </div>
      </div>
      <div v-else>
        <div class="wrapper">
          <div class="wrapper-text">
            {{inviteCode}}
          </div>
        </div>
        <div class="price-btn">
          <div class="right chop" @click="setShare">分享</div>
        </div>
      </div>
    </div>
    <div v-if="toogle === 2" class="container">
      <div class="container-title">
        <span class="container-item">邀请记录</span>
      </div>
      <div class="container-record">
        <div class="container-list" v-for="(item, index) in inviteList" :key="index">
          <img :src="item.invitedUserExt.headImgUrl" />
          <span class="nick">{{item.invitedUserExt.nickname}}</span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="container-title">
        <div class="container-bg">活动规则</div>
      </div>
      <div class="container-rule">
        <p>1.输入兑换码可兑换优惠券</p>
        <p>2.分享自己的兑换码给好友，好友兑换后自己和好友均可获得优惠券</p>
        <p>3.所有解释权归商家所有</p>
      </div>
    </div>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
  </div>
</template>
<script>
    import { setDetection, getInviteUser, getInviteCode, convertCoupon } from "@api/user";
    import { postCartAdd } from "@api/store";
    import { imageBase64 } from "@api/public";
    import { isWeixin } from "@utils/index";
    import { openShareAll } from "@libs/wechat";
    import { mapGetters } from "vuex";

    const NAME = "Conversion";

    export default {
        name: NAME,
        components: {
            ProductConSwiper: () => import("@components/ProductConSwiper"),
            StorePoster: () => import("@components/StorePoster")
        },
        props: {},
        data: function() {
            return {
                domStatus: false,
                posterData: {
                    image: "",
                    title: "",
                    price: "",
                    code: ""
                },
                posterImageStatus: false,
                inviteUser: {},
                inviteCode: '',
                inviteList: [],
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
                courseLogo:'',
                toogle: 1,
                convertCode: ''
            }
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
            this.mountedStart()
        },
        computed: {
            ...mapGetters(["userNo"]),
        },
        methods: {
            mountedStart() {
                let that = this;
                getInviteUser({userNo: this.userNo}).then(r => {
                    that.inviteUser = r.data
                }).catch(e => {
                    that.$dialog.error(e.msg);
                })
                getInviteCode({userNo: this.userNo}).then(res => {
                    that.inviteCode = res.data.inviteCode
                    that.inviteList = res.data.userLogInviteListRESQS
                }).catch(err => {
                    that.$dialog.error(err.msg);
                })
            },
            setShare: function() {
                isWeixin() &&
                openShareAll({
                    desc: '是兄弟，就来砍我',
                    title: '是兄弟，就来砍我',
                    link: location.href, //+ '?userNo=' + this.storeInfo.uid,
                    imgUrl: ''
                });
            },
            getImageBase64: function() {
                let that = this;
                imageBase64(this.posterData.image, that.posterData.code).then(res => {
                    that.posterData.image = res.data.image;
                    that.posterData.code = res.data.code;
                });
            },
            updateTitle() {
                document.title = this.storeInfo.title || this.$route.meta.title;
            },
            setPosterImageStatus: function() {
                let sTop = document.body || document.documentElement;
                sTop.scrollTop = 0;
                this.posterImageStatus = !this.posterImageStatus;
            },
            convert(code) {
                convertCoupon({code: code}).then(res => {
                    if (res.code === 200) {
                        this.mountedStart()
                        this.$dialog.toast({mes: '兑换成功'})
                    }
                }).catch(err => {
                    this.$dialog.error(err.msg)
                })
            }
        }
    };
</script>
<style scoped>
  .bargainDetail {
    font-family: "微软雅黑";
    font-size: .26rem;
    /*height: 100%;*/
    background: #cc2213;
  }
  .banner {
    width: 100%;
    height: 5rem;
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
  .countdown_dashboard .on{
    color: #fff;
    border-bottom: 3px solid #fff7c9;
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
  .price-btn .right .off{
    background: gray;
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
