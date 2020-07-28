<template>
  <div class="productList"><!--原来的样式是goodList-->
<!--  图片排列  -->
    <div class="list acea-row row-between-wrapper" style="margin-top: 0.2rem;"
      :class="Switch === true ? '' : 'on'" ref="container">
      <router-link
        :to="{path: '/detail/' + item.id}"
        class="item"
        :class="Switch === true ? '' : 'on'"
        v-for="(item, index) in goodList"
        :key="index" :title="item.courseName">
        <div class="pictrue" style="height: 2.45rem;" :class="Switch === true ? '' : 'on'">
          <img :src="item.courseLogo" :class="Switch === true ? '' : 'on'" />
        </div>
        <div class="text" :class="Switch === true ? '' : 'on'">
          <div class="name line1" :class="Switch === true ? '' : 'on'">{{ item.courseName }}</div>
          <div
            class="money font-color-red" style="margin-right: 0.2rem;height:48px;"
            :class="Switch === true ? '' : 'on'"
          >
            <span v-if="item.isFree === 0">
              <span class="num" :class="Switch === true ? '' : 'on'">
                  ￥{{ item.courseOriginal }}&nbsp;
                  <div v-if="item.courseSvipDiscount != item.courseOriginal">
                    {{item.courseDiscount ? '￥' + item.courseSvipDiscount.toFixed(2) : '免费'}}
                    <img style="width:0.46rem;height:0.21rem;margin-left:0.04rem;" src="@assets/images/vip.png"/>
                  </div>
                </span>
            </span>
            <span v-else>
              <span class="num" style="position: relative;top:0.44rem;" :class="Switch === true ? '' : 'on'">免费</span>
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "GoodList",
  props: {
    goodList: {
      type: Array,
      default: () => []
    },
    isSort: {
      type: Boolean,
      default: true
    },
      Switch: {
        type: Boolean,
        default: false
    }
  },
  data: function() {
    return {

    };
  }
};
</script>
