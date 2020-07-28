<template>
  <div ref="container">
    <div class="collectionGoods" v-if="collectProductList.length > 0">
      <router-link
        :to="{ path: '/detail/' + item.courseViewDTO.id }"
        class="item acea-row row-between-wrapper"
        v-for="(item, index) in collectProductList"
        :key="index"
      >
        <div class="pictrue"><img :src="item.courseViewDTO.courseLogo" /></div>
        <div class="text acea-row row-column-between">
          <div class="infor line1">{{ item.courseViewDTO.courseName }}</div>
          <div class="acea-row row-between-wrapper">
            <div class="money font-color-red"><span style="color: #999999">拼团时间：</span>{{ item.addTime }}</div>
            <div class="money" style="color: #999999">
              拼团结果：
              <span class="money font-color-red" v-if="item.status === 1">进行中</span>
              <span class="money font-color-red" v-else-if="item.status === 2">成功</span>
              <span class="money font-color-red" v-else>失败</span>
            </div>
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
import { mapGetters } from "vuex";
import Recommend from "@components/Recommend";
import { getAssembleRecord } from "@api/activity";
import Loading from "@components/Loading";

const NAME = "AssembleRcord";

export default {
  name: NAME,
  components: {
      Recommend,
      Loading
  },
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
      this.get_user_collect_product();
      this.$scroll(this.$refs.container, () => {
          !this.loading && this.get_user_collect_product();
      });
  },
  computed: {
      ...mapGetters(["userNo"]),
  },
  methods: {
      get_user_collect_product: function() {
          let that = this;
          if (that.loading) return; //阻止下次请求（false可以进行请求）；
          if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
          that.loading = true;
          getAssembleRecord({userNo: that.userNo}).then(res => {
              that.loading = false;
              //apply();js将一个数组插入另一个数组;
              that.collectProductList.push.apply(that.collectProductList, res.data.assembleViewDTOs);
              that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
              that.page = that.page + 1;
          });
      }
  }
};
</script>
