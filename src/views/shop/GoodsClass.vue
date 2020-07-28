<template>
  <div class="productSort">
    <form @submit.prevent="submitForm">
      <div class="header acea-row row-center-wrapper" ref="header">
        <div class="acea-row row-between-wrapper input">
          <span class="iconfont icon-sousuo"></span>
          <input type="text" placeholder="搜索课程信息" v-model="search" />
        </div>
      </div>
    </form>
    <div style="display: flex;justify-content: center">
<!--      <div class="aside">-->
<!--        <div-->
<!--          class="item acea-row row-center-wrapper"-->
<!--          :class="index === navActive ? 'on' : ''"-->
<!--          v-for="(item, index) in category"-->
<!--          :key="index"-->
<!--          @click="asideTap(index)"-->
<!--        >-->
<!--          <span>{{ item.categoryName }}</span>-->
<!--        </div>-->
<!--      </div>-->
      <div class="conter" @scroll="onScroll">
      <div class="listw" v-for="(item, index) in category" :key="index">
        <div class="title acea-row row-center-wrapper" ref="title">
          <div class="line"></div>
          <div class="name">{{ item.categoryName }}</div>
          <div class="line"></div>
        </div>
        <div class="list acea-row">
          <router-link v-if="false"
            class="item acea-row row-column row-middle"
            v-for="(course, index) in item.courseList"
            :key="index"
            :to="{path: '/detail/' + course.id}"
          >
            <div class="picture">
              <img :src="course.courseLogo" />
            </div>
            <div class="name line1">{{ course.courseName }}</div>
          </router-link>
          <router-link style="margin-right:0.1rem;"
            :to="{path: '/detail/' + course.id}"
            class="item_switch"
            :class="Switch ? '' : 'on'"
            v-for="(course, index) in item.courseList"
            :key="index" :title="item.courseName">
            <div class="pictrue_switch" :class="Switch ? '' : 'on'">
              <img :src="course.courseLogo" :class="Switch ? '' : 'on'" />
            </div>
            <div class="text_switch" :class="Switch ? '' : 'on'">
              <div class="name_switch">{{ course.courseName }}</div>
              <div class="money_switch font-color-red" :class="Switch ? '' : 'on'">
                <span v-if="course.isFree === 0">
                  <span class="num_switch">￥{{ course.courseOriginal }}&nbsp;
    <!--                  <span v-if="course.courseSvipDiscount != course.courseOriginal">{{course.courseDiscount ? '￥' + course.courseSvipDiscount.toFixed(2) : '免费'}}<img style="width:0.46rem;height:0.21rem;margin-left:0.04rem;" src="@assets/images/vip.png" /></span>-->
                  </span>
                </span>
                <span v-else>
                  <span class="num_switch">免费</span>
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    </div>
    <div style="height:1.2rem;"></div>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import { getCategory, getProducts } from "@api/store";
import { trim } from "../../utils";

export default {
  name: "GoodsClass",
  components: {},
  props: {},
  data: function() {
    return {
      Switch: false,
      category: [],
      productList: [],
      navActive: 0,
      search: "",
      lock: false,
      where: {
          page: 1,
          limit: 8
      },
      obj: {
          courseName: "",
          categoryId1: "",
          categoryId2: "",
          categoryId3: "",
          orgNo: "",
          pageCurrent: 1,
          pageSize: 8,
          isFree: "",
          isVipFree: ""
      },
      loading: false,
      loadend: false,
    };
  },
  watch: {
    "$route.query.pid": function(n) {
      console.log(n);
      if (n) {
        this.activeCateId(n);
      }
    }
  },
  mounted: function() {
    document.addEventListener("scroll", this.onScroll, false);
    this.loadCategoryData();
  },
  methods: {
    activeCateId(n) {
      let index = 0;
      // n = parseInt(n);
      if (!n) return;
      this.category.forEach((cate, i) => {
        if (cate.id === n) index = i;
      });

      if (index !== this.navActive) {
        this.asideTap(index);
      }
    },
    loadCategoryData() {
      getCategory().then(res => {
        this.category = res.data.courseCategoryList;
        this.$nextTick(() => {
          if (this.$route.query.pid) this.activeCateId(this.$route.query.pid);
          else this.onScroll();
        });
      });
    },
    submitForm: function() {
      let val = trim(this.search);
      if (val) {
        this.$router.push({
          path: "/goods_list",
          query: { s: val }
        });
        setTimeout(() => (this.search = ""), 500);
      }
    },
    asideTap(index) {
      const top =
        this.$refs.title[index].offsetTop -
        this.$refs.header.offsetHeight -
        window.scrollY;

      this.lock = true;

      window.scrollBy({ top, left: 0, behavior: "smooth" });
      this.navActive = index;
    },
    onScroll: debounce(function() {
      if (this.lock) {
        this.lock = false;
        return;
      }
      const headerHeight = this.$refs.header.offsetHeight,
        { scrollY } = window,
        titles = this.$refs.title;
      titles.reduce((initial, title, index) => {
        if (initial) return initial;
        const parent = title.parentNode || title.parentElement;
        if (
          scrollY + headerHeight + 15 <
          title.offsetTop + parent.offsetHeight
        ) {
          initial = true;
          this.navActive = index;
        }
        // else if (innerHeight + scrollY + 15 > offsetHeight) {
        //   this.navActive = titles.length - 1;
        //   initial = true;
        // }
        return initial;
      }, false);
    }, 500)
  },
  beforeDestroy: function() {
    document.removeEventListener("scroll", this.onScroll, false);
  }
};
</script>
