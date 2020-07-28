<template>
  <div style="height: 100%" class="index" v-cloak>
    <!--头部搜索框-->
    <div class="header acea-row row-center-wrapper">
<!--      <div class="logo"><img :src="logoUrl" /></div>-->
      <div class="logo"><img src="@assets/images/logo.png" /></div>
      <router-link :to="'/search'" class="search acea-row row-middle">
        <span class="iconfont icon-xiazai5"></span>搜索课程
      </router-link>
    </div>
    <!--轮播广告-->
    <div class="slider-banner banner">
      <swiper :options="swiperOption" v-if="banner.length > 0">
        <swiper-slide v-for="(item, index) in banner" :key="index">
          <router-link
            :to="item.advUrl ? item.advUrl : ''"
            class="search acea-row row-middle"
          >
            <img :src="item.advImg" />
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination paginationBanner" slot="pagination"></div>
      </swiper>
    </div>
    <!--快速选择-->
    <div class="wrapper" v-if="info.fastList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">快速选择</div>
          <div class="line1">{{ info.fastInfo }}</div>
        </div>
        <router-link :to="'/category'" class="more">
          更多<span class="iconfont icon-jiantou"></span>
        </router-link>
      </div>
      <div class="scroll-product">
        <swiper class="swiper-wrapper" :options="swiperScroll">
          <swiper-slide
            v-for="(item, index) in info.fastList"
            :key="index"
            class="swiper-slide"
          >
            <router-link
              :to="{
                path: '/goods_list',
                query: { id: item.id, title: item.cate_name }
              }"
            >
              <div class="img-box">
                <img :src="item.pic" />
              </div>
              <div class="pro-info line1">{{ item.cate_name }}</div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <!--精品推荐-->
    <div v-if="zones.length > 0" style="padding: 0 0.3rem 0 0.3rem;">
      <div class="wrapper" v-if="false" v-for="(zone, index) in zones" :key="index">
        <div class="title acea-row row-between-wrapper">
          <div class="text">
            <div class="name line1">{{zone.zoneName}}</div>
            <div class="line1">{{zone.zoneDesc}}</div>
          </div>
          <router-link :to="{ path: '/category' }" class="more">
            更多课程<span class="iconfont icon-jiantou"></span>
          </router-link>
        </div>
        <Good-list :good-list="zone.courseList" :is-sort="false"></Good-list>
      </div>
      <router-link :to="{path: '/category', query: {pid: cate.id}}" v-for="(cate, index) in category" :key="index">
        <div class="picture" style="margin-top: 0.3rem;border-radius: 0.3rem;" v-if="cate.categoryIcon">
          <img style="width:100%;border-radius: 0.3rem" :src="cate.categoryIcon" />
        </div>
      </router-link>
    </div>
    <!--热门榜单-->
    <div class="hotList" v-if="likeInfo.length > 0">
      <div class="hot-bg">
        <div class="title acea-row row-between-wrapper">
          <div class="text line1">
            <span class="label">热门榜单</span>根据销量、搜索、好评等综合得出
          </div>
          <router-link :to="{ path: '/hot_new_goods/' + 2 }" class="more">
            更多<span class="iconfont icon-jiantou"></span>
          </router-link>
        </div>
      </div>
      <div class="list acea-row row-middle">
        <router-link
          :to="{ path: '/detail/' + item.id }"
          class="item"
          v-for="(item, index) in likeInfo"
          :key="index"
        >
          <div class="pictrue">
            <img :src="item.image" />
            <img
              src="@assets/images/one.png"
              class="numPic"
              v-if="index === 0"
            />
            <img
              src="@assets/images/two.png"
              class="numPic"
              v-else-if="index === 1"
            />
            <img
              src="@assets/images/three.png"
              class="numPic"
              v-else-if="index === 2"
            />
          </div>
          <div class="name line1">{{ item.store_name }}</div>
          <div class="money font-color-red">
            ￥<span class="num">{{ item.price }}</span>
          </div>
        </router-link>
      </div>
    </div>
    <!--图片-->
    <div v-if="lovely.img">
      <div class="adver">
        <img :src="lovely.img" />
      </div>
    </div>
    <!--首发新品-->
    <div class="wrapper" v-if="info.firstList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">
            首发新品<span class="new font-color-red">NEW~</span>
          </div>
          <div class="line1">{{ info.firstInfo }}</div>
        </div>
        <router-link :to="{ path: '/hot_new_goods/' + 3 }" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
      <div class="newProducts">
        <swiper class="swiper-wrapper" :options="swiperProducts">
          <swiper-slide
            class="swiper-slide"
            v-for="(item, index) in info.firstList"
            :key="index"
          >
            <router-link :to="{ path: '/detail/' + item.id }">
              <div class="img-box">
                <img :src="item.image" />
              </div>
              <div class="pro-info line1">{{ item.store_name }}</div>
              <div class="money font-color-red">￥{{ item.price }}</div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <!--促销单品-->
    <div class="wrapper" v-if="benefit.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">促销单品</div>
          <div class="line1">{{ info.salesInfo }}</div>
        </div>
        <router-link :to="'/promotion'" class="more"
          >更多<span class="iconfont icon-jiantou"></span
        ></router-link>
      </div>
    </div>
    <Promotion-good :benefit="benefit"></Promotion-good>
    <!--  优惠券弹窗  -->
    <Coupon-window
      :coupon-list="couponList"
      v-if="showCoupon"
      @checked="couponClose"
      @close="couponClose"
    ></Coupon-window>
    <div style="height:1.2rem;"></div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "@assets/css/swiper.min.css";
import { getHomeData, getShare, advList, zoneCourse } from "@api/public";
import cookie from "@utils/store/cookie";
import { openShareAll } from "@libs/wechat";
import { isWeixin } from "@utils/index";
import { getCategory } from "@api/store";

const HAS_COUPON_WINDOW = "has_coupon_window";

export default {
  name: "Index",
  components: {
    swiper,
    swiperSlide,
    GoodList: resolve => require(['../../components/GoodList'], resolve),
    PromotionGood: resolve => require(['../../components/PromotionGood'], resolve),
    CouponWindow: resolve => require(['../../components/CouponWindow'], resolve)
  },
  props: {},
  data: function() {
    return {
      showCoupon: false,
      logoUrl: "",
      banner: [], // 轮播图
      menus: [], // 中间的菜单
      roll: [], // 新闻简报轮播
      activity: [], // 活动
      activityOne: {}, // 第一个活动
      info: {
        fastList: [], // 快速选择
        bastBanner: [], // 精品推荐轮播图
        firstList: [], // 首发新品
        bastList: [] // 精品推荐
      },
      zones: [], // 课程专区
      category: [], //课程分类
      likeInfo: [], // 热门榜单
      lovely: [],
      benefit: [], // 促销单品
      couponList: [],
      swiperOption: {
        pagination: {
          el: ".paginationBanner",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperRoll: {
        direction: "vertical",
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperScroll: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      },
      swiperBoutique: {
        pagination: {
          el: ".paginationBoutique",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperProducts: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      }
    };
  },
  mounted: async function() {
    let that = this;
    // 1:微信端广告， 0：pc端广告
    await advList(0).then(res => {
        that.$set(that, "banner", res.data.advList || []);
    })
    await zoneCourse(0).then(res => {
        that.$set(that, "zones", res.data.zoneListDTO || []);
    })
    this.loadCategoryData()
    // await getHomeData().then(res => {
    //   // that.logoUrl = res.data.logoUrl; 暂时不要
    //
    //   that.$set(that, "menus", res.data.menus);
    //   // that.$set(that, "roll", res.data.roll); 暂时不要
    //   that.$set(that, "activity", res.data.activity);
    //   if (res.data.activity.length) {
    //     var activityOne = res.data.activity.shift();
    //     that.$set(that, "activityOne", activityOne);
    //   }
    //   that.$set(that, "info", res.data.info);
    //   that.$set(that, "likeInfo", res.data.likeInfo);
    //   that.$set(that, "lovely",res.data.lovely.length ? res.data.lovely[0] : {});
    //   that.$set(that, "benefit", res.data.benefit);
    //   that.$set(that, "couponList", res.data.couponList);
    //   that.setOpenShare();
    //   this.showCoupon =
    //     !cookie.has(HAS_COUPON_WINDOW) &&
    //     res.data.couponList.some(coupon => coupon.is_use);
    // });
  },
  methods: {
    couponClose() {
      cookie.set(HAS_COUPON_WINDOW, 1);
    },
    loadCategoryData() {
        getCategory().then(res => {
            this.category = res.data.courseCategoryList;
        });
    },
    setOpenShare: function() {
      if (isWeixin()) {
        getShare().then(res => {
          let data = res.data.data;
          let configAppMessage = {
            desc: data.synopsis,
            title: data.title,
            link: location.href,
            imgUrl: data.img
          };
          openShareAll(configAppMessage);
        });
      }
    }
  }
};
</script>
<style scoped>
.index {
  background-color: #fff;
}
</style>
