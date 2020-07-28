import Vue from "vue";
import Router from "vue-router";
import module from "./module";
import Index from "@views/home/Index";
import Search from "@views/shop/GoodSearch";
import Category from "@views/shop/GoodsClass";
import ShoppingCart from "@views/shop/ShoppingCart";
import LearningCenter from "@views/user/LearningCenter";
import GoodsList from "@views/shop/GoodsList";
import NotDefined from "@views/NotDefined";
import $store from "../store";
import toLogin from "@libs/login";
import Loading from "@views/Loading";

Vue.use(Router);

const router = new Router({
  mode: "history",
    base: "/static/",
  routes: [
    {
      path: "/",
      name: "Index",
      meta: {
        title: "首页",
        keepAlive: true,
        footer: true,
        backgroundColor: "#fff",
        home: false
      },
      component: Index
    },
    {
      path: "/customer/chat/:id",
      name: "CustomerService",
      meta: {
        title: "客服聊天",
        keepAlive: false,
        home: false,
        auth: true
      },
      component: () => import("@views/user/CustomerService.vue")
    },
    {
      path: "/category/:pid?",
      name: "GoodsClass",
      meta: {
        title: "课程中心",
        keepAlive: true,
        footer: true,
        home: false,
        backgroundColor: "#fff"
      },
      component: Category
    },
    {
      path: "/collection",
      name: "GoodsCollection",
      meta: {
        title: "收藏课程",
        keepAlive: false,
        home: false,
        auth: true
      },
      component: () => import("@views/shop/GoodsCollection.vue")
    },
    {
      path: "/purchased",
      name: "GoodsPurchased",
      meta: {
        title: "已购课程",
        keepAlive: false,
        home: false,
        auth: true
      },
      component: () => import("@views/shop/GoodsPurchased.vue")
    },
    {
      path: "/search",
      name: "GoodSearch",
      meta: {
        title: "搜索课程",
        keepAlive: true,
        home: false,
        backgroundColor: "#fff"
      },
      component: Search
    },
    {
      path: "/news_detail/:id",
      name: "NewsDetail",
      meta: {
        title: "新闻详情",
        keepAlive: true,
        home: false,
        backgroundColor: "#fff"
      },
      component: () => import("@views/shop/news/NewsDetail.vue")
    },
    {
      path: "/news_list",
      name: "NewsList",
      meta: {
        title: "新闻",
        keepAlive: true,
        home: false,
        backgroundColor: "#fff"
      },
      component: () => import("@views/shop/news/NewsList.vue")
    },
    {
      path: "/evaluate_list/:id",
      name: "EvaluateList",
      meta: {
        title: "课程评分",
        keepAlive: true,
        home: false,
        auth: true
      },
      component: () => import("@views/shop/EvaluateList.vue")
    },
    {
      path: "/goods_evaluate/:id",
      name: "GoodsEvaluate",
      meta: {
        title: "课程评价",
        keepAlive: true,
        home: false,
        auth: true
      },
      component: () => import("@views/shop/GoodsEvaluate.vue")
    },
    {
      path: "/promotion",
      name: "GoodsPromotion",
      meta: {
        title: "促销课程",
        home: false,
        keepAlive: false
      },
      component: () => import("@views/shop/GoodsPromotion.vue")
    },
    {
      path: "/hot_new_goods/:type",
      name: "HotNewGoods",
      meta: {
        title: "热门榜单",
        home: false,
        keepAlive: false
      },
      component: () => import("@views/shop/HotNewGoods.vue")
    },
    {
      path: "/detail/:id",
      name: "GoodsCon",
      meta: {
        title: "课程详情",
        home: false,
        keepAlive: false
      },
      component: () => import("@views/shop/GoodsCon.vue")
    },
    {
      path: "/cart",
      name: "ShoppingCart",
      meta: {
        title: "购物车",
        keepAlive: true,
        footer: true,
        home: false,
        auth: true
      },
      component: ShoppingCart
    },
    {
      path: "/user/learning_center",
      name: "LearningCenter",
      meta: {
        title: "学习中心",
        keepAlive: true,
        footer: true,
        home: false,
        auth: true
      },
      component: LearningCenter
    },
    {
      path: "/goods_list",
      name: "GoodsList",
      meta: {
        title: "课程列表",
        home: false,
        keepAlive: true
      },
      component: GoodsList
    },
    {
      path: "/register",
      name: "Register",
      meta: {
        title: "注册",
        home: false,
        keepAlive: true
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "@views/user/Register.vue")
    },
    {
      path: "/change_password",
      name: "ChangePassword",
      meta: {
        title: "修改密码",
        keepAlive: true,
        backgroundColor: "#fff",
        home: false,
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "@views/user/ChangePassword.vue")
    },
    {
      path: "/retrieve_password",
      name: "RetrievePassword",
      meta: {
        title: "找回密码",
        home: false,
        keepAlive: true
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "@views/user/RetrievePassword.vue")
    },
    {
      path: "/login",
      name: "Login",
      meta: {
        title: "登录",
        keepAlive: true,
        home: false
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "@views/user/Login.vue")
    },
    ...module,
    {
      path: "/auth/:url",
      name: "Loading",
      meta: {
        title: " 加载中",
        keepAlive: true,
        home: false
      },
      component: Loading
    },
    {
      path: "*",
      name: "NotDefined",
      meta: {
        title: "页面找不到",
        keepAlive: true,
        home: false,
        backgroundColor: "#F4F6FB"
      },
      component: NotDefined
    }  ],
  scrollBehavior(to, from) {
    from.meta.scrollTop = window.scrollY;
    return { x: 0, y: to.meta.scrollTop || 0 };
  }
});

const { back, replace } = router;

router.back = function() {
  this.isBack = true;
  back.call(router);
};
router.replace = function(...args) {
  this.isReplace = true;
  replace.call(router, ...args);
};

router.beforeEach((to, form, next) => {
  const { title, backgroundColor, footer, home, auth } = to.meta;
  document.title = title || process.env.VUE_APP_NAME || "知码在线课堂";
  if (!$store.state.app.userNo) { // 加上“auth === true &&”进来不授权登录
    if (form.name === "Login") return;
    return toLogin(true, to.fullPath);
  }
  //判断是否显示底部导航
  footer === true ? $store.commit("SHOW_FOOTER") : $store.commit("HIDE_FOOTER");

  //控制悬浮按钮是否显示
  home === false ? $store.commit("HIDE_HOME") : $store.commit("SHOW_HOME");

  $store.commit("BACKGROUND_COLOR", backgroundColor || "#F5F5F5");

  if (auth) {
    $store.dispatch("USERINFO").then(() => {
      next();
    })
  } else next();
});

export default router;
