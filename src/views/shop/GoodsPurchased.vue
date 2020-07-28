<template>
  <div ref="container">
    <div class="collectionGoods" v-if="collectProductList.length > 0">
      <router-link
        :to="{ path: '/detail/' + item.courseId }"
        class="item acea-row row-between-wrapper"
        v-for="(item, index) in collectProductList"
        :key="index"
      >
        <div class="pictrue"><img :src="item.courseImgUrl" /></div>
        <div class="text acea-row row-column-between">
          <div class="infor line1">{{ item.courseName }}</div>
          <div class="acea-row row-between-wrapper">
            <div class="money font-color-red"><span style="color: #999999">上次学习：</span>{{ item.lsatPeriodName }}</div>
            <div class="money" style="color: #999999">学习时间：{{ item.lastStudyTime }}</div>
<!--            <div class="delete" @click.prevent="router.push('/detail/' + item.courseId)">立即学习</div>-->
          </div>
        </div>
      </router-link>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <div
      class="noCommodity"
      style="background-color:#fff;"
      v-if="collectProductList.length < 1 && page > 1"
    >
      <div class="noPictrue">
        <img src="@assets/images/noCollection.png" class="image" />
      </div>
      <Recommend></Recommend>
    </div>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import { courseList } from "@api/user";
import Loading from "@components/Loading";
export default {
  name: "GoodsCollection",
  components: {
    Recommend,
    Loading
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 20,
      collectProductList: [],
      loadTitle: "",
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.get_user_collect_product();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.get_user_collect_product();
    });
  },
  methods: {
    get_user_collect_product: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      courseList(that.page, that.limit).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.collectProductList.push.apply(that.collectProductList, res.data.list);
        that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
