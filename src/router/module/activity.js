export default [
  {
    path: "/activity"
  },
  {
    path: "/activity/goods_seckill",
    name: "GoodsSeckill",
    meta: {
      title: "限时抢购",
      keepAlive: true,
      home: false,
      backgroundColor: "#ffffff"
    },
    component: () => import("@views/activity/GoodsSeckill.vue")
  },
  {
    path: "/activity/seckill_detail/:id?/:time",
    name: "SeckillDetails",
    meta: {
      title: "抢购详情页",
      home: false,
      keepAlive: true
    },
    component: () => import("@views/activity/SeckillDetails.vue")
  },
  {
    path: "/activity/bargain/:id",
    name: "BargainDetails",
    meta: {
      title: "砍价详情页",
      home: false,
      keepAlive: true,
      auth: false
    },
    component: () => import("@views/activity/BargainDetails.vue")
  },
  {
    path: "/activity/bargainRecord",
    name: "BargainRecord",
    meta: {
      title: "砍价记录页",
      home: false,
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/activity/BargainRecord.vue")
  },
  {
    path: "/activity/conversion",
    name: "Conversion",
    meta: {
      title: "兑换中心",
      home: false,
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/activity/Conversion.vue")
  }
  ,
  {
    path: "/activity/assembleRecord",
    name: "AssembleRecord",
    meta: {
      title: "拼团记录页",
      home: false,
      keepAlive: true,
      auth: true
    },
    component: () => import("@views/activity/AssembleRecord.vue")
  }
];
