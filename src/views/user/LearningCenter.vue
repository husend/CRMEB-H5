<template>
  <div class="my-order" ref="container">
    <div class="nav acea-row row-around">
      <div class="item" :class="{ on: tabStatus === 1 }" @click="get_user_course_info(1)">
        <div>学习记录</div>
      </div>
      <div class="item" :class="{ on: tabStatus === 2 }" @click="get_user_course_info(2)">
        <div>我的已购</div>
      </div>
    </div>
    <div class="list" v-if="tabStatus === 1">
      <div class="item" v-for="(item, index) in collectProductList" :key="index">
        <div @click="$router.push({ path: '/detail/' + item.courseId })">
          <div class="item-info acea-row row-between row-top">
            <div class="infor line1 font-color-red">
              <span style="color: black">学习内容：</span>
              {{ item.periodName }}
            </div>
            <div class="acea-row row-between-wrapper">
              <div class="money" style="color: #999999">课程名称：{{ item.courseName }}</div>
              <div class="money" style="color: #999999">学习时间：{{ item.gmtCreate }}</div>
              <!--            <div class="delete" @click.prevent="router.push('/detail/' + item.courseId)">立即学习</div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="tabStatus === 2">
      <div class="item" v-for="(item, index) in collectProductList" :key="index">
        <div @click="$router.push({ path: '/detail/' + item.courseId })">
          <div class="item-info acea-row row-between row-top">
            <div class="pictrue">
              <img :src="item.courseImgUrl"/>
            </div>
            <div class="text acea-row row-between">
              <div class="name line2">
                {{ item.courseName }}
              </div>
              <div class="acea-row row-between-wrapper">
                <div class="money font-color-red"><span style="color: #999999">上次学习：</span>{{ item.lsatPeriodName }}</div>
                <div class="money" style="color: #999999">学习时间：{{ item.lastStudyTime }}</div>
                <!--            <div class="delete" @click.prevent="router.push('/detail/' + item.courseId)">立即学习</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Recommend from "@components/Recommend";
import { studyList, courseList } from "@api/user";
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
      loadend: false,
      tabStatus: 1
    };
  },
  mounted: function() {
    this.get_user_course_info();
    this.$scroll(this.$refs.container, () => {
      !this.loading && this.get_user_course_info();
    });
  },
  methods: {
      get_user_course_info: function(tabStatus) {
      let that = this;
      that.tabStatus = tabStatus || 1
      if (tabStatus) { //如果有值则相当于重新请求，没有值就相当于继续请求
          that.collectProductList = []
          that.loading = false
          that.loadend = false
      } else {
        if (that.loading) return; //阻止下次请求（false可以进行请求）；
        if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      }
      that.loading = true;
      if (that.tabStatus === 1) {
          studyList(that.page, that.limit).then(res => {
              that.loading = false;
              //apply();js将一个数组插入另一个数组;
              that.collectProductList.push.apply(that.collectProductList, res.data.list);
              that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
              that.page = that.page + 1;
          });
      } else {
          courseList(that.page, that.limit).then(res => {
              that.loading = false;
              //apply();js将一个数组插入另一个数组;
              that.collectProductList.push.apply(that.collectProductList, res.data.list);
              that.loadend = res.data.list.length < that.limit; //判断所有数据是否加载完成；
              that.page = that.page + 1;
          });
      }
    }
  }
};
</script>
<style scoped>
.my-order .nav{
  background-color:#fff;
  width:100%;
  height:10%;
  border-radius:0.06rem;
  margin:0 auto 0 auto;
}
.my-order .nav .item{
  text-align:center;
  font-size:0.26rem;
  color:#282828;
  padding: 0.29rem 0 0.2rem 0;
}
.my-order .nav .item.on{font-weight:bold;border-bottom:0.05rem solid #e93323;}
.my-order .nav .item .num{margin-top:0.1rem;}
/*.my-order .list_record{*/
/*  width: 100%;*/
/*  !*padding:0 0.3rem 0 0.3rem;*!*/
/*  border-bottom:1px solid #eee;*/
/*  height:1.8rem;*/
/*}*/
/*.my-order .list_record .item_record{*/
/*  background-color:#fff;*/
/*  border-radius:0.06rem;*/
/*  margin-bottom:0.14rem;*/
/*}*/
</style>
