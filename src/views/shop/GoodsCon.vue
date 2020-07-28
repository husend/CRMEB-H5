<template>
  <div :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']" ref="box">
    <!--  轮播图  -->
    <div class="banner slider-banner swiper-container-horizontal" ref="playdiv">
      <div class="swiper-wrapper">
        <div class="swiper-slide swiper-slide-active" ref="videobox" style="background-repeat: no-repeat;background-size: 100% auto;"><!-- :style="'background-image:url('+storeInfo.courseLogo+')'"-->
          <img v-if="!startPlay" :src="storeInfo.courseLogo">
          <video-play v-if="startPlay" :playData="playData" :nowNo="nowPlayNo"></video-play>
        </div>
      </div>
    </div>
    <!--  课程信息  -->
    <div class="wrapper">
      <div class="wrapper-int">
        <div style="display: flex;justify-content: left;">
          <div class="name">{{storeInfo.courseName}}</div>
          <div class="share" @click="listenerActionSheet()">
            <div class="iconfont icon-fenxiang"></div>
<!--            <div>分享</div>-->
          </div>
        </div>
        <div class="acea-row row-middle">
          <div class="pin-money">
            <div v-if="storeInfo.isFree === 1">
              <span class="money free">免费</span>
            </div>
            <div v-else>
              <span class="money">￥{{storeInfo.courseOriginal}}</span>
                  <!--     svip暂时去掉         -->
<!--              <span class="labelItem">svip:</span>-->
<!--              <span v-if="storeInfo.isVipFree === 0" class="labelItem">{{storeInfo.courseSvipDiscount}}</span>-->
<!--              <span v-else class="labelItem">免费</span>-->
            </div>
          </div>
        </div>
        <div class="collect">
          <div>已有{{storeInfo.countStudy}}人学习
          </div>
        </div>
      </div>
    </div>
    <!--   拼团滚动   -->
    <div class="assemble" v-if="assembleNum > 0">
      <div class="title acea-row row-between-wrapper">
        <div>{{assembleNum}}人正在拼单，可直接参与</div>
        <router-link to="/" class="allAssemble">
          查看更多<span class="iconfont icon-jiantou"></span>
        </router-link>
      </div>
      <div class="assembleState acea-row row-middle" :style="{height: roll.length >= 2 ? '2rem' : '1rem'}">
        <swiper class="assemble-swiper" ref="mySwiper" :options="swiperRoll" :style="{height: roll.length >= 2 ? '2rem' : '1rem'}">
          <swiper-slide v-for="(item, index) in roll" :key="index" :id="index">
            <div class="assemble-slide" :style="{height: roll.length >= 2 ? '50%' : '100%'}">
              <div class="assemble-slide-flex">
                <img v-if="item.userExtVO.headImgUrl" :src="item.userExtVO.headImgUrl" />
                <img v-else src="../../assets/images/friend.jpg" />
                <span class="slide-nick">{{item.userExtVO.nickname ? item.userExtVO.nickname : ""}}</span>
                <span class="slide-time">
                  <div>还差{{item.lackAssembleNum}}人拼成</div>
                  <div>
                    <CountDown :is-day="false" :tip-text="'剩余 '" :day-text="''"
                      :hour-text="':'" :minute-text="':'" :second-text="''"
                      :datatime="Date.parse(item.stopTime)/1000"
                    ></CountDown>
                  </div>
                </span>
                <button class="slide-assem" v-if="item.uid !== userNo">去拼单</button>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <!-- 选项卡   -->
    <div class="swiper-nav acea-row row-center-wrapper">
      <div class="navCon acea-row row-middle">
        <div class="item" :class="toggleClass === 2 ? 'on' : ''" @click="toggleButton(2)">
          课程介绍
        </div>
        <div class="item" style="border-right: 1px solid #509efb;border-left: 1px solid #509efb" :class="toggleClass === 1 ? 'on' : ''" @click="toggleButton(1)">
          开始学习
        </div>
        <div class="item" :class="toggleClass === 3 ? 'on' : ''" @click="toggleButton(3)">
          课程互动
        </div>
      </div>
    </div>
    <!--  产品介绍  -->
    <div class="swiper-conter" v-if="toggleClass === 2" v-html="storeInfo.introduce"></div>
    <!--  课程大纲  -->
    <div class="course-list" v-else-if="toggleClass === 1">
      <div class="title"><span></span>课程大纲</div>
      <div class="chapter_info" v-for="(one, index) in storeInfo.chapterList" :key="index">
        <div class="chapter_name">
          <span>第{{index + 1}}章&nbsp;&nbsp;</span>{{one.chapterName}}
        </div>
        <div class="period_info" v-for="(two, num) in one.periodList" :key="num">
          <div class="period_top" @click="videoPlay(two)" :class="{on : nowPlayNo == two.id}">
            <div class="period_video" :class="{no_v: !two.isVideo, on: nowPlayNo == two.id}"></div>
            <span class="period_num">第{{num+1}}讲</span>
            <span v-if="!two.isVideo" class="no_video">(未更新)</span>
            <span v-if="two.isFree" class="c_blue">(免费)</span>
            <span class="period_name">{{two.periodName}}</span>
<!--            <span class="video_time fr">{{two.videoLength}}分钟</span>-->
          </div>
          <!-- <a :href="two.accessoryInfoDTOList[0].acUrl" v-if="two.accessoryInfoDTOList && userInfo && two.accessoryInfoDTOList.length && !minVideo">下载课件</a> -->
          <!--        <a href="javascript:" @click="noDown(two)" v-if="two.isDoc">下载课件</a>-->
        </div>
      </div>
    </div>
    <!--  评论  -->
    <div v-else>
      评论
    </div>
    <div style="height:1.2rem;"></div>
<!--  底部购买按钮  -->
    <div class="footer acea-row row-between-wrapper">
      <div class="item" @click="$router.push({ path: '/' })">
        <div class="iconfont icon-shouye"></div>
        <div style="text-align: center;">首页</div>
      </div>
      <div class="item" @click="setCollect">
        <div class="iconfont" :class="storeInfo.userCollect ? 'icon-shoucang1' : 'icon-shoucang'"></div>
        <div style="text-align: center">{{storeInfo.userCollect ? '已收藏' : '收藏'}}</div>
      </div>
      <div class="bnt acea-row" v-cloak v-if="storeInfo.isFree !== 1 && storeInfo.isPay !== 1">
        <div class="joinCart" v-if="storeInfo.assemble" @click="startAssemble(storeInfo.authAssembleCourseViewDTO.price)" :style="{width: computWidth}">
          <span style="font-size: 0.25rem;">拼团</span>
          <span style="font-size: 0.22rem;">￥{{storeInfo.authAssembleCourseViewDTO.price}}</span>
        </div>
        <div class="bargain" :class="storeInfo.hasStock || isBargainIng ? '' : 'gray'" v-if="storeInfo.bargain" @click="startBargain(storeInfo)" :style="{width: computWidth}">
          <span style="font-size: 0.25rem;">砍价</span>
        </div>
        <div class="buy" @click="tapBuy" :style="{width: computWidth}">
          <span style="font-size: 0.25rem;">购买</span>
          <span style="font-size: 0.22rem;">￥{{storeInfo.courseOriginal}}</span>
        </div>
      </div>
      <div class="bnt acea-row" v-else>
        <div class="study" @click="videoPlay(storeInfo.chapterList[0].periodList[0])">
          <span>开始学习</span>
        </div>
      </div>
    </div>
<!--  拼单窗口  -->
    <AssembleWindow v-on:changeFun="changeFun" :assemble="assemble"></AssembleWindow>
<!--  会员分享返  -->
    <Share-red-packets :priceName="priceName" v-on:changeFun="changeFun" v-if=" false && priceName !== 0"></Share-red-packets>
<!--  优惠券  -->
    <CouponPop v-on:changeFun="changeFun" :coupon="coupon"></CouponPop>
<!--  购买窗口  -->
    <component :is="currentComponent" v-on:changeFun="changeFun" :attr="attr" :storeInfo="storeInfo" :userAddress="userAddress"></component>
<!--  生成海报组件  -->
    <StorePoster v-on:setPosterImageStatus="setPosterImageStatus" :posterImageStatus="posterImageStatus" :posterData="posterData"></StorePoster>
    <ShareInfo v-on:setShareInfoStatus="setShareInfoStatus" :shareInfoStatus="shareInfoStatus"></ShareInfo>
<!--  生成海报按钮  -->
    <div class="generate-posters acea-row row-middle" :class="posters ? 'on' : ''">
<!--      <div class="item" v-if="weixinStatus === true" @click="setOpenShare">-->
<!--        <div class="iconfont icon-weixin3"></div>-->
<!--        <div class="">分享给朋友</div>-->
<!--      </div>-->
      <div class="item" @click="setPosterImageStatus">
        <div class="iconfont icon-haibao"></div>
        <div class="">生成海报</div>
      </div>
    </div>
<!--  遮罩  -->
    <div class="mask" @touchmove.prevent @click="listenerActionClose" v-show="posters"></div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import CountDown from "@components/CountDown";
import ProductWindow from "@components/ProductWindow";
import "@assets/css/swiper.min.css";
import {
  getProductDetail,
  getUserProductDetail,
  periodVideoUrl,
  postCartAdd,
  getCartCount,
  getProductCode
} from "@api/store";
import {
  isVip,
  getCouponsUser,
  getCollectAdd,
  getCollectDel,
  getUserInfo,
  getAddress,
  getAddressDefault
} from "@api/user";
import { isWeixin } from "@utils/index";
import { isAssembleIng, isBargainIng } from "@api/activity";
import { wechatEvevt, openShareAll } from "@libs/wechat";
import { imageBase64 } from "@api/public";
import { mapGetters } from "vuex";
let NAME = "GoodsCon";
export default {
  name: NAME,
  components: {
    swiper,
    swiperSlide,
    CountDown,
    ProductConSwiper: () => import("@components/ProductConSwiper"),
    UserEvaluation: () => import("@components/UserEvaluation"),
    ShareRedPackets: () => import("@components/ShareRedPackets"),
    CouponPop: () => import("@components/CouponPop"),
    StorePoster: () => import("@components/StorePoster"),
    ShareInfo: () => import("@components/ShareInfo"),
    VideoPlay: () => import("@components/VideoPlay"),
    AssembleWindow: () => import("@components/AssembleWindow")
  },
  data: function() {
    let self = this
    return {
      isBargainIng: false, // 是否正在砍价
      bargainIngId: 0, // 正在砍价的id
      nowPlayNo: '',
      vipFree: false,
      startPlay: false,
      playData: {},
      shareInfoStatus: false,
      weixinStatus: false,
      mapShow: false, //地址必填
      mapKey: "",
      posterData: { //海报信息
        image: "",
        headImg: "",
        title: "",
        price: "",
        code: ""
      },
      posterImageStatus: false,
      animated: false,
      toggleClass: 2,
      coupon: {
        coupon: false,
        list: []
      },
      attr: {
        cartAttr: false,
        price: 0, // 拼团课程价格
        assembleDtail: {}, // 拼团课程详情
        isBargain: false, // 是否是砍价
        isAssemble: false, // 是否是拼团
        bargainId: "", // 砍价课程id
        bargainPrice: 0, // 砍价课程金额
        couponList: [] // 优惠券列表
      },
      isOpen: false, //是否打开属性组件
      productValue: [], //没用
      id: 0,
      storeInfo: {}, //课程信息
      attrTxt: "请选择",
      attrValue: "",
      cart_num: 1, //购买数量
      replyCount: "", //没用
      replyChance: "", //没用
      reply: [], //没用
      priceName: 0,
      CartCount: 0,
      posters: false,
      banner: [{}, {}],
      swiperRecommend: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: false,
        loop: false,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      goodList: [],
      system_store: {},
      qqmapsdk: null,
      roll: [], // 拼团轮播
      assemble: {
          showAssemble: false,
          details: {}
      }, // 拼团详情
      assembleNum: 0,
      datatime: 0, // 倒计时时间（毫秒）
      coursePrice: 0, // 课程价格
      userAddress: {}, //用户选择的地址
      userCoupon: {}, //用户选择的优惠券
      currentComponent: ''
    };
  },
  computed: {
      ...mapGetters(["isLogin", "userNo"]),
      computWidth :function () {
        if (this.storeInfo.assemble && this.storeInfo.bargain) {
            return "33.3%"
        } else if (this.storeInfo.assemble || this.storeInfo.bargain) {
            return "50%"
        } else {
            return "100%"
        }
      },
      swiperRoll: function () {
          let sr = {
              direction: "vertical",
              slidesPerView: 2,// 每页展示几个
              slidesPerGroup: 2,// 每屏滚动几个
              autoplay: {
                  disableOnInteraction: false,
                  delay: 5000
              },
              loop: true,
              speed: 1000,
              observer: true,
              observeParents: true,
              on: {
                  click: (t) => {
                      console.log(t)
                      let index = t.path[0].id || t.path[1].id || t.path[2].id || t.path[3].id || t.path[4].id || t.path[5].id || t.path[6].id
                      this.assemble.details = this.roll[index]
                      if (this.roll[index].uid !== this.userNo) {
                        this.assemble.showAssemble = true
                      }
                  }
              }
          }
          if (this.roll.length >= 2) {
              sr.slidesPerView = 2
              sr.slidesPerGroup = 2
          } else {
              sr.slidesPerView = 1
              sr.slidesPerGroup = 1
          }
          return sr
      }
  },
  watch: {
    $route(n) {
      if (n.name === NAME) {
        this.id = n.params.id;
        this.productCon();
      }
    }
  },
  updated() {
    window.scroll(0, 0);
  },
  mounted: async function() {
    this.id = this.$route.params.id;
    await this.productCon();
    let that = this
    if (this.$route.query.addressId) {
        let addressId = this.$route.query.addressId
        let payType = this.$route.query.payType
        await getAddress({id: addressId}).then(res => {
            that.userAddress = res.data;
        });
        if (payType === 0 || payType === '0') {
            that.attr.isBargain = false
            that.attr.isAssemble = false
            that.attr.price = this.storeInfo.courseOriginal
        } else if (payType === 1 || payType === '1') {
            that.attr.isBargain = false
            that.attr.isAssemble = true
            that.attr.price = this.storeInfo.authAssembleCourseViewDTO.price
        } else {
            that.attr.isAssemble = false
            that.attr.isBargain = true
            that.attr.bargainPrice = this.storeInfo.authBargainCourseViewDTO.price
            that.attr.bargainId = this.storeInfo.authBargainCourseViewDTO.id
        }
        that.attr.cartAttr = true
        this.currentComponent = ProductWindow
    } else {
        await getAddressDefault({userNo: that.userNo}).then(res => {
            that.userAddress = res.data;
        })
    }
  },
  activated: async function() {
      this.id = this.$route.params.id;
      await this.productCon();
      if (this.$route.query.addressId) {
          let addressId = this.$route.query.addressId
          let payType = this.$route.query.payType
          let that = this
          await getAddress({id: addressId}).then(res => {
              that.userAddress = res.data;
          });
          if (payType === 0) {
              that.attr.isBargain = false
              that.attr.isAssemble = false
              that.attr.price = this.storeInfo.courseOriginal
          } else if (payType === 1) {
              that.attr.isBargain = false
              that.attr.isAssemble = true
              that.attr.price = this.storeInfo.authAssembleCourseViewDTO.price
          } else {
              that.attr.isAssemble = false
              that.attr.isBargain = true
              that.attr.bargainPrice = this.storeInfo.authBargainCourseViewDTO.price
              that.attr.bargainId = this.storeInfo.authBargainCourseViewDTO.id
          }
          that.attr.cartAttr = true
          this.currentComponent = ProductWindow
      }
  },
  methods: {
    showChang: function() {
      if (isWeixin()) {
        let config = {
          latitude: parseFloat(this.system_store.latitude),
          longitude: parseFloat(this.system_store.longitude),
          name: this.system_store.name,
          address: this.system_store._detailed_address
        };
        wechatEvevt("openLocation", config).then(res => {
            console.log(res);
        }).catch(res => {
          if (res.is_ready) {
            res.wx.openLocation(config);
          }
        });
      } else {
        if (!this.mapKey)
          return this.$dialog.error(
            "暂无法使用查看地图，请配置您的腾讯地图key"
          );
        this.mapShow = true;
      }
    },
    updateTitle() {
      document.title = this.storeInfo.store_name || this.$route.meta.title;
    },
    setOpenShare: function() {
      let data = this.storeInfo;
      let href = location.href;
      if (isWeixin()) {
        if (this.isLogin) {
          getUserInfo().then(res => {
            href = href.indexOf("?") === -1 ? href + "?spread=" + res.data.uid : href + "&spread=" + res.data.uid;
            let configAppMessage = {
              desc: data.store_info,
              title: data.store_name,
              link: href,
              imgUrl: data.image
            };
            wechatEvevt(
              ["updateAppMessageShareData", "updateTimelineShareData"],
              configAppMessage
            ).then(res => {
                console.log(res);
            }).catch(res => {
              console.log(res);
              if (res.is_ready) {
                res.wx.updateAppMessageShareData(configAppMessage);
                res.wx.updateTimelineShareData(configAppMessage);
              }
            });
          });
        } else {
          let configAppMessage = {
            desc: data.store_info,
            title: data.store_name,
            link: href,
            imgUrl: data.image
          };
          wechatEvevt(
            ["updateAppMessageShareData", "updateTimelineShareData"],
            configAppMessage
          ).then(res => {
              console.log(res);
          }).catch(res => {
            if (res.is_ready) {
              res.wx.updateAppMessageShareData(configAppMessage);
              res.wx.updateTimelineShareData(configAppMessage);
            }
          });
        }
      }
    },
    setShareInfoStatus: function() {
      this.shareInfoStatus = !this.shareInfoStatus;
      this.posters = false;
    },
    shareCode: function(value) {
      let that = this;
      getProductCode(that.id).then(res => {
        if (res.data.code) that.posterData.code = res.data.code;
        value === false && that.listenerActionSheet();
      });
    },
    setPosterImageStatus: function() {
      let sTop = document.body || document.documentElement;
      sTop.scrollTop = 0;
      this.posterImageStatus = !this.posterImageStatus;
      if (isWeixin() === true) {
          this.weixinStatus = true;
      }
      this.posters = false;
    },
    posterImageClose: function() {
        this.posterImageStatus = false;
        this.posters = false;
    },
    //产品详情接口；
    productCon: async function() {
      let that = this;
      if(this.isLogin){
       await getUserProductDetail(that.id).then(res => {
          that.$set(that, "storeInfo", res.data);
          that.$set(that, "priceName", res.data.priceName);
          if (res.data.assemblePageList !== null) {
            let rollArray = [];
            for (let i = 0; i < res.data.assemblePageList.length; ++i) {
                if (res.data.assemblePageList[i].userExtVO !== null) {
                   rollArray.push(res.data.assemblePageList[i])
		            }
            }
            that.$set(that, "assembleNum", rollArray.length);
            that.$set(that, "roll", rollArray);
          }
          that.posterData.image = that.storeInfo.courseLogo;
          that.posterData.title = that.storeInfo.courseName;
          that.posterData.price = that.storeInfo.courseOriginal;
          let good_list = res.data.good_list || [];
          let goodArray = [];
          that.mapKey = res.data.mapKey;
          that.$set(that, "goodList", goodArray);
          that.updateTitle();
          // that.DefaultSelect();
          // that.getCartCount();

          // that.setOpenShare();
        }).catch(res => {
          that.$dialog.error(res.msg);
          that.$router.go(-1);
        })
        await getCouponsUser({userNo: that.userNo}).then(res => {
            let coupons = res.data.authCouponUserViewDTOs.filter((price) => {
                return price.useMinPrice < that.storeInfo.courseOriginal
            })
            that.$set(that.attr, "couponList", coupons || []);
            that.$set(that.coupon, "list", res.data);
        });
        await getUserInfo(1, that.userNo).then(res => {
            that.posterData.headImg = res.data.userExt.headImgUrl
        })
        if (that.storeInfo.authBargainCourseViewDTO) {
            await isBargainIng({bargainId: that.storeInfo.authBargainCourseViewDTO.id}).then(res => {
                if (res.data) {
                    that.isBargainIng = true
                    that.bargainIngId = res.data.id
                }
            })
        }
        that.getImageBase64();
      } else {
        await getProductDetail(that.id).then(res => {
          that.$set(that, "storeInfo", res.data);
          that.$set(that, "priceName", res.data.priceName);
          if (res.data.assemblePageList !== null) {
             let rollArray = [];
             for (let i = 0; i < res.data.assemblePageList.length; ++i) {
                 if (res.data.assemblePageList[i].userExtVO !== null) {
                    rollArray.push(res.data.assemblePageList[i])
                 }
             }
             that.$set(that, "assembleNum", rollArray.length);
             that.$set(that, "roll", rollArray);
          }
          that.posterData.image = that.storeInfo.courseLogo;
          that.posterData.title = that.storeInfo.courseName;
          that.posterData.price = that.storeInfo.courseOriginal;
          that.mapKey = res.data.mapKey;
          that.updateTitle();
          that.getImageBase64();
        }).catch(res => {
          that.$dialog.error(res.msg);
          that.$router.go(-1);
        });
      }
    },
    getImageBase64: function() {
        let that = this;
        imageBase64(that.posterData.image, that.posterData.headImg).then(res => {
            that.posterData.image = res.data.image;
            that.posterData.headImg = res.data.headImg;
        })
    },
    //默认选中属性；
    DefaultSelect: function() {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (let i = 0; i < productAttr.length; i++) {
        this.$set(productAttr[i], "index", 0);
        value.push(productAttr[i].attr_values[0]);
      }
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.productValue[value.sort().join(",")];
      if (productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", value.sort().join(","));
        this.$set(this, "attrTxt", "已选择");
      } else if (!productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      } else if (!productSelect && !productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
        this.$set(
          this.attr.productSelect,
          "unique",
          this.storeInfo.unique || ""
        );
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      }
    },
    //购物车；
    ChangeCartNum: function(changeValue) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.productValue[this.attrValue];
      //如果没有属性,赋值给商品默认库存
      if (productSelect === undefined && !this.attr.productAttr.length)
        productSelect = this.attr.productSelect;
      //无属性值即库存为0；不存在加减；
      if (productSelect === undefined) return;
      let stock = productSelect.stock || 0;
      let num = this.attr.productSelect;
      if (changeValue) {
        num.cart_num++;
        if (num.cart_num > stock) {
          this.$set(this.attr.productSelect, "cart_num", stock);
          this.$set(this, "cart_num", stock);
        }
      } else {
        num.cart_num--;
        if (num.cart_num < 1) {
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "cart_num", 1);
        }
      }
    },
    //将父级向子集多次传送的函数合二为一；
    changeFun: function(opt) {
      if (typeof opt !== "object") opt = {};
      let action = opt.action || "";
      let value = opt.value === undefined ? "" : opt.value;
      let data = opt.data === undefined ? "" : opt.data;
      this[action] && this[action](value, data);
    },
    //打开优惠券插件；
    couponTap: function() {
      let that = this;
      that.coupons();
      that.coupon.coupon = true;
    },
    changecoupon: function(msg) {
      this.coupon.coupon = msg;
    },
    currentcoupon: function(res) {
      let that = this;
      that.coupon.coupon = false;
      that.$set(that.coupon.list[res], "is_use", true);
    },
    //打开属性插件；
    selecAttrTap: function() {
      this.attr.cartAttr = true;
      this.isOpen = true;
    },
    changeattr: function(msg) {
          this.attr.cartAttr = msg;
          this.isOpen = false;
      },
    changeassemble: function(msg) {
          this.assemble.showAssemble = msg;
      },
    //选择属性；
    ChangeAttr: function(res) {
      let productSelect = this.productValue[res];
      if (productSelect) {
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", res);
        this.$set(this, "attrTxt", "已选择");
      } else {
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this, "attrValue", "");
        this.$set(this, "attrTxt", "请选择");
      }
    },
    //收藏商品
    setCollect: function() {
      let that = this,
          id = that.storeInfo.id;
      if (that.storeInfo.userCollect) {
        getCollectDel(id).then(function() {
          that.storeInfo.userCollect = !that.storeInfo.userCollect;
        });
      } else {
        getCollectAdd(id).then(function() {
          that.storeInfo.userCollect = !that.storeInfo.userCollect;
        });
      }
    },
    goGoods(val) {
      return this.$router.push({ path: "/detail/" + val.id });
    },
    //  点击加入购物车按钮
    joinCart: function() {
      //0=加入购物车
      this.goCat(0);
    },
    // 加入购物车；
    goCat: function(news) {
      let that = this,
        productSelect = that.productValue[this.attrValue];
      //打开属性
      if (that.attrValue) {
        //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
        that.attr.cartAttr = !that.isOpen ? true : false;
      } else {
        if (that.isOpen) that.attr.cartAttr = true;
        else that.attr.cartAttr = !that.attr.cartAttr;
      }
      //只有关闭属性弹窗时进行加入购物车
      if (that.attr.cartAttr === true && that.isOpen === false)
        return (that.isOpen = true);
      //如果有属性,没有选择,提示用户选择
      if (
        that.attr.productAttr.length &&
        productSelect === undefined &&
        that.isOpen === true
      )
        return that.$dialog.toast({ mes: "产品库存不足，请选择其它" });
      let q = {
        productId: that.id,
        cartNum: that.attr.productSelect.cart_num,
        new: news,
        uniqueId:
          that.attr.productSelect !== undefined
            ? that.attr.productSelect.unique
            : ""
      };
      postCartAdd(q)
        .then(function(res) {
          that.isOpen = false;
          that.attr.cartAttr = false;
          if (news) {
            that.$router.push({ path: "/order/submit/" + res.data.cartId });
          } else {
            that.$dialog.toast({
              mes: "添加购物车成功",
              callback: () => {
                that.getCartCount(true);
              }
            });
          }
        })
        .catch(res => {
          that.isOpen = false;
          return that.$dialog.toast({ mes: res.msg });
        });
    },
    //获取购物车数量
    getCartCount: function(isAnima) {
      let that = this;
      const isLogin = that.isLogin;
      if (isLogin) {
        // getCartCount({ numType: 0 }).then(res => {
        //   that.CartCount = res.data.count;
        //   //加入购物车后重置属性
        //   if (isAnima) {
        //     that.animated = true;
        //     setTimeout(function() {
        //       that.animated = false;
        //     }, 500);
        //   }
        // });
      }
    },
    //立即购买；
    tapBuy: function() {
      //  1=直接购买
      // this.goCat(1);
      this.attr.isBargain = false
      this.attr.isAssemble = false
      this.currentComponent = ProductWindow
      if (this.isLogin) {
          this.payType = 0
          this.attr.cartAttr = true
          this.attr.price = this.storeInfo.courseOriginal
      } else {
          this.$dialog.message("请先登录");
      }
    },
    listenerActionSheet: function() {
      if (isWeixin() === true) {
        this.weixinStatus = true;
      }
      this.posters = true;
    },
    listenerActionClose: function() {
      this.posters = false;
    },
    toggleButton: function (toggleClass) {
      if (this.toggleClass !== toggleClass) {
          this.toggleClass = toggleClass
      }
    },
    //参与拼团
    toAssemble: function(msg, data) {
        this.attr.assembleDtail = data
        this.attr.isBargain = false
        this.attr.isAssemble = true
        this.currentComponent = ProductWindow
        if (this.isLogin) {
            this.payType = 1
            this.attr.cartAttr = msg
            this.attr.price = this.storeInfo.authAssembleCourseViewDTO.price
        } else {
            this.$dialog.message("请先登录");
        }
    },
    //发起拼团
    startAssemble: function(price) {
        isAssembleIng({pid: this.storeInfo.id}).then(res => {
            debugger
            if (!res.data){
                this.attr.isBargain = false
                this.attr.isAssemble = true
                this.currentComponent = ProductWindow
                if (this.isLogin) {
                    this.payType = 1
                    this.attr.cartAttr = true
                    this.attr.price = price
                } else {
                    this.$dialog.message("请先登录");
                }
            } else {
                this.$dialog.message("正在进行拼团，不能重复拼团!");
            }
        })
    },
    //发起砍价
    startBargain: function(bargain) {
          if (this.isBargainIng) {
              this.$router.push({path: "/activity/bargain/" + this.bargainIngId});
          } else {
              if (!bargain.hasStock) {
                  return this.$dialog.message("砍价活动已结束");
              }
              this.attr.isBargain = true
              this.attr.isAssemble = false
              this.currentComponent = ProductWindow
              if (this.isLogin) {
                  this.payType = 2
                  this.attr.cartAttr = true
                  this.attr.bargainPrice = bargain.authBargainCourseViewDTO.price
                  this.attr.bargainId = bargain.authBargainCourseViewDTO.id
                  // this.attr.price = price
              } else {
                  console.log(this.$dialog)
                  this.$dialog.message("请先登录");
              }
          }
    },
    async videoPlay(data) {
      this.toggleClass = 1
      let that = this
      if (that.isLogin) {
          await isVip(that.userNo).then(res => {
              if(res.code == 200){
                  that.vipFree = res.data
              }else{
                  that.vipFree = false
              }
          }).catch(() => {
              that.vipFree = false
          })
          if (that.storeInfo.isPay || data.isFree === 1 || (that.storeInfo.isVipFree === 1 && that.vipFree)) {
              that.nowPlayNo = data.id
            //腾讯云播放
            periodVideoUrl(data.id).then(res => {
                if (res.code === 200) {
                    let heig = that.$refs.playdiv.offsetHeight;
                    that.$refs.playdiv.style.height = heig + 'px';
                    that.startPlay = true
                    that.playData = (Object.assign({}, res.data));
                } else {
                    that.$dialog.message("请先登录");
                }
            }).catch(() => {
                that.$dialog.message("播放失败");
            })
          } else {
              that.$dialog.message("请先购买");
          }
      } else {
          console.log(that.$dialog)
          that.$dialog.message("请先登录");
      }
    }
  }
};
</script>
<style scoped>
  .wrapper-int{
    padding: 0 0.3rem;
    position: relative;
    border-bottom: 1px solid #ececec;
    padding-bottom: 0.22rem;
  }
  .wrapper-int .name{
    width: 85%;
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
    margin-top: 0.15rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .wrapper-int .pin-money{
    font-size: 0.26rem;
    color: #999;
    font-weight: bold;
    margin-right: 0.15rem;
  }
  .wrapper-int .pin-money .money{
     font-size: 0.44rem;
     font-weight: bold;
     margin-right: 0.08rem;
     color: #e31313;
  }
  .wrapper-int .pin-money .money.free{
     font-size: 0.34rem;
     font-weight: bold;
     margin-right: 0.08rem;
     color: #e31313;
  }
  .wrapper-int .share{
    font-size: 0.24rem;
    color: #999;
    text-align: center;
  }
  .wrapper-int .share .iconfont{
    font-size: 0.4rem;
    color: #f6b300;
  }
  .wrapper-int .collect{
    bottom: 0.3rem;
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    position: absolute;
    right: 0.37rem;
  }
  .wrapper-int .collect .iconfont{
     font-size: 0.4rem;
     color: #f6b300;
     margin-bottom: -0.08rem;
  }
  .swiper-nav{
    font-size: 0.32rem;
    color: #509efb;
    font-weight: bold;
    width: 100%;
    height: 1.2rem;
    justify-content: space-around;
    -webkit-justify-content: space-around;
    border-bottom: 0.01rem solid #ececec;
  }
  .acea-row.row-center-wrapper {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .swiper-nav .navCon{
    width: 96%;
    height: 0.8rem;
    border-radius: 0.15rem;
    border: 1px solid #509efb;
    position: relative;
  }
  .swiper-nav .navCon .free{
    position: absolute;
    font-size: 0.2rem;
    color: #fff;
    left: 17%;
    top: 0;
    margin-top: -0.5rem;
    animation: stone linear 1s infinite alternate;
    -webkit-animation: free linear 1s infinite alternate;
  }
  .swiper-nav .navCon .free .freeCon{
    width: 1.1rem;
    height: 0.4rem;
    border-radius: 0.05rem;
    background-color: #ea2f2f;
    position: relative;
  }
  .swiper-nav .navCon .item {
    width: 33.33%;
    height: 100%;
    line-height: 0.8rem;
    text-align: center;
  }
  .swiper-nav.navCon .item.on:last-child {
    border-radius: 0 0.13rem 0.13rem 0;
  }
  .swiper-nav.navCon .item.on:nth-of-type(1) {
    border-radius: 0.13rem 0 0 0.13rem;
   }
  .swiper-nav .navCon .item.on{
    color: #fff;
    background-color: #509efb;
  }
  .course-list .title {
    border-left: 3px solid #000;
    padding-left: 12px;
    /*font-size: 14px;*/
    color: #000;
    font-weight: 700;
    margin-bottom: 15px;
    margin-left: 0.1rem;
  }
  .course-list .chapter_info {
    padding: 0 0 0 0.1rem;
    /*font-size: 14px;*/
  }
  .course-list .chapter_info:last-child {
    width: 100%;
    padding: 0 0 0 0.1rem;
    /*font-size: 12px;*/
    /*border-bottom: 1px solid #ccc;*/
    /*margin-bottom: 30px;*/
    /*padding-bottom: 20px;*/
    border: none;
  }
  .course-list .chapter_name {
    /*font-size: 12px;*/
    font-weight: 700;
    color: #333;
    padding-bottom: 0px;
  }
  .course-list .period_info {
    position: relative;
  }
  .course-list .period_info a{
    display: inline-block;
    font-size: 10px;
    width: 66px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    color: #999;
    position: absolute;
    right: 0px;
    top: 10px;
    border: 1px solid rgb(153, 153, 153);
    border-radius: 13px;
  }
  .course-list .period_info a:hover{
    color: rgb(213, 20, 35);
    text-decoration: none;
    border: 1px solid rgb(213, 20, 35);
    cursor: pointer;
  }
  .course-list .period_top {
    width: 100%;
    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    position: relative;
    padding-right: 104px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .course-list .period_top.on {
    cursor: pointer;
    background: rgb(242, 242, 242);
    color: rgb(213, 20, 35);
  }
  .course-list .video_time {
    position: absolute;
    right: 0;
  }
  .course-list .period_num {
    margin-right: 6px;
  }
  .course-list .period_name{
    /*font-size: 12px;*/
  }
  .course-list .period_video {
    display: inline-block;
    width: 18px;
    height: 18px;
    position: relative;
    top: 5px;
    margin-right: 10px;
    background: url(../../assets/images/video1.svg) center center;
    background-size: 18px 18px;
  }
  .course-list .period_video.no_v {
    background: url(../../assets/images/no_video.svg) no-repeat center center;
    background-size: 18px 18px;
  }
  .course-list .period_video:hover {
    cursor: pointer;
    background: rgb(242, 242, 242);
    color: rgb(213, 20, 35);
  }
  .course-list .period_video.on {
    display: inline-block;
    width: 18px;
    height: 18px;
    position: relative;
    cursor: pointer;
    background: rgb(242, 242, 242);
    color: rgb(213, 20, 35);
    background: url(../../assets/images/video.png) no-repeat center center;
    background-size: 18px 18px;
  }
  .product-con {
    height: 100%;
    /*margin-top: 0.2rem;*/
    background-color: #fff;
  }
  .product-con .banner {
    width: 100%;
    display: inline-block;
  }
  .product-con .banner img {
    height: 100%;
    width: 100%;
  }
  .product-con .store-info .title {
    padding: 0 0.3rem;
    font-size: 0.28rem;
    color: #282828;
    height: 0.8rem;
    line-height: 0.8rem;
    border-bottom: 0.01rem solid #f5f5f5;
  }
  .product-con .store-info .info {
    padding: 0 0.3rem;
    height: 1.26rem;
  }
  .product-con .store-info .info .picTxt {
    width: 6.15rem;
  }
  .product-con .store-info .info .picTxt .pictrue {
    width: 0.76rem;
    height: 0.76rem;
  }
  .product-con .store-info .info .picTxt .pictrue img {
    width: 100%;
    height: 100%;
    border-radius: 0.06rem;
  }
  .product-con .store-info .info .picTxt .text {
    width: 5.22rem;
  }
  .product-con .store-info .info .picTxt .text .name {
    font-size: 0.3rem;
    color: #282828;
  }
  .product-con .store-info .info .picTxt .text .address {
    font-size: 0.24rem;
    color: #666;
    margin-top: 0.03rem;
  }
  .product-con .store-info .info .picTxt .text .address .iconfont {
    color: #707070;
    font-size: 0.18rem;
    margin-left: 0.1rem;
  }
  .product-con .store-info .info .picTxt .text .address .addressTxt {
    max-width: 4.8rem;
    width: auto;
  }
  .product-con .store-info .info .iconfont {
    font-size: 0.4rem;
  }
  .product-con .superior {
    background-color: #fff;
    margin-top: 0.2rem;
  }
  .product-con .superior .title {
    height: 0.98rem;
  }
  .product-con .superior .title img {
    width: 0.3rem;
    height: 0.3rem;
  }
  .product-con .superior .title .titleTxt {
    margin: 0 0.2rem;
    font-size: 0.3rem;
    background-image: linear-gradient(to right, #f57a37 0%, #f21b07 100%);
    background-image: -webkit-linear-gradient(to right, #f57a37 0%, #f21b07 100%);
    background-image: -moz-linear-gradient(to right, #f57a37 0%, #f21b07 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .product-con .superior .slider-banner {
    width: 6.9rem;
    margin: 0 auto;
    padding-bottom: 0.2rem;
  }
  .product-con .superior .slider-banner .list {
    width: 100%;
    padding-bottom: 0.2rem;
  }
  .product-con .superior .slider-banner .list .item {
    width: 2.15rem;
    margin: 0 0.22rem 0.3rem 0;
    font-size: 0.26rem;
  }
  .product-con .superior .slider-banner .list .item:nth-of-type(3n) {
    margin-right: 0;
  }
  .product-con .superior .slider-banner .list .item .pictrue {
    width: 100%;
    height: 2.15rem;
  }
  .product-con .superior .slider-banner .list .item .pictrue img {
    width: 100%;
    height: 100%;
    border-radius: 0.06rem;
  }
  .product-con .superior .slider-banner .list .item .name {
    color: #282828;
    margin-top: 0.12rem;
  }
  .product-con .superior .slider-banner .swiper-pagination-bullet {
    background-color: #999;
  }
  .product-con .superior .slider-banner .swiper-pagination-bullet-active {
    background-color: #e93323;
  }

  .mask {
    -webkit-filter: blur(2px);
    -moz-filter: blur(2px);
    -ms-filter: blur(2px);
    filter: blur(2px);
  }
  .product-con .product-intro .conter div {
    width: 100% !important;
  }
  .generate-posters {
    width: 100%;
    height: 1.7rem;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99;
    transform: translate3d(0, 100%, 0);
    -webkit-transform: translate3d(0, 100%, 0);
    -ms-transform: translate3d(0, 100%, 0);
    -moz-transform: translate3d(0, 100%, 0);
    -o-transform: translate3d(0, 100%, 0);
    transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -o-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  }
  .generate-posters.on {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
  }
  .generate-posters .item {
    flex: 25%;
    -webkit-flex: 25%;
    -ms-flex: 25%;
    text-align: center;
  }
  .generate-posters .item .iconfont {
    font-size: 0.8rem;
    color: #5eae72;
  }
  .generate-posters .item .iconfont.icon-haibao {
    color: #5391f1;
  }
  .noscroll {
    height: 100%;
    overflow: hidden;
  }
</style>
