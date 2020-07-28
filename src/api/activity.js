import request from "@utils/request";

/**
 * 拼团列表
 */
export function getCombinationList(data) {
  return request.get("/combination/list", data, { login: false });
}

/**
 * 拼团产品详情
 *
 * @param {*} id
 */
export function getCombinationDetail(id) {
  return request.get("/combination/detail/" + id, {}, { login: false });
}

/**
 * 拼团 开团
 * @param {*} id
 */
// export function getCombinationPink(id) {
//   return request.get("/combination/pink/" + id);
// }

/**
 * 拼团 开团/参团
 * @param {*} data
 */
export function combinationPart(data) {
  return request.post("/course/auth/assemble/save", data);
}

/**
 * 拼团 取消开团
 */
// export function getCombinationRemove(data) {
//   return request.post("/combination/remove", data);
// }

/**
 * 拼团海报
 * @param {*} id
 */
// export function getCombinationPoster(data) {
//   return request.post("/combination/poster", data);
// }

/**
 * 拼团记录
 * @param {*} id
 */
export function getAssembleRecord(data) {
  return request.post("/course/auth/assemble/record", data);
}

/**
 * 是否正在拼团
 * @param {*} id
 */
export function isAssembleIng(data) {
  return request.post("/course/auth/assemble/isAssemble", data);
}

/**
 * 秒杀列表配置
 */
export function getSeckillConfig() {
  return request.get("/seckill/index", {}, { login: false });
}

/**
 * 秒杀列表
 */
export function getSeckillList(time, data) {
  return request.get("/seckill/list/" + time, data, { login: false });
}

/**
 * 秒杀产品详情
 */
export function getSeckillDetail(id) {
  return request.get("/seckill/detail/" + id, {}, { login: false });
}

/**
 * 砍价列表
 * @param {*} data
 */
export function getBargainList(data) {
  return request.get("/bargain/list", data, { login: false });
}

/**
 * 砍价详情
 */
export function getBargainDetail(data) {
  return request.post("/course/auth/bargain/view", data);
}

/**
 * 砍价 观看/分享/参与次数
 */
export function getBargainShare(data) {
  return request.post("/bargain/share", data);
}

/**
 * 砍价开启
 * @param {*} data
 */
export function getBargainStart(data) {
  return request.post("/course/auth/bargain/save", data);
}

/**
 * 砍价 帮助好友砍价
 * @param {*} data
 */
export function toBargainHelp(data) {
  return request.post("/course/auth/bargain/help", data);
}

/**
 * 是否已经帮砍价
 * @param {*} data
 */
export function getBargainHelpByUid(data) {
  return request.post("/course/auth/bargain/user/getBargainHelpByUid", data);
}

/**
 * 砍价记录
 * @param {*} id
 */
export function getBargainRecord(data) {
  return request.post("/course/auth/bargain/record", data);
}

/**
 * 是否正在砍价
 * @param {*} id
 */
export function isBargainIng(data) {
  return request.post("/course/auth/bargain/isBargainIng", data);
}

/**
 * 砍价海报
 * @param {*} id
 */
export function getBargainPoster(data) {
  return request.post("/system/api/poster/getByPosterType", data);
}

/**
 * 砍价 砍掉金额
 * @param {*} data
 */
// export function getBargainHelpPrice(data) {
//   return request.post("/bargain/help/price", data);
// }

/**
 * 砍价 砍价帮总人数、剩余金额、进度条、已经砍掉的价格
 * @param {*} data
 */
// export function getBargainHelpCount(data) {
//   return request.post("/bargain/help/count", data);
// }

/**
 * 砍价 开启砍价用户信息
 * @param {*} data
 */
// export function getBargainStartUser(data) {
//   return request.post("/bargain/start/user", data);
// }

/**
 * 砍价 砍价帮
 * @param {*} data
 */
// export function getBargainHelpList(data) {
//   return request.post("/bargain/help/list", data);
// }

/**
 * 砍价海报
 * @param {*} data
 */
// export function getBargainPoster(data) {
//   return request.post("/bargain/poster", data);
// }

/**
 * 砍价列表(已参与)
 * @param {*} data
 */
// export function getBargainUserList(data) {
//   return request.get("/bargain/user/list", data);
// }

/**
 * 砍价取消
 */
// export function getBargainUserCancel(data) {
//   return request.post("/bargain/user/cancel", data);
// }
