import request from "@utils/request";

/**
 * 首页
 * @returns {*}
 */
export function getHomeData() {
  return request.get("index", {}, { login: false });
}

// 首页推荐课程
export function zoneCourse(zoneLocation) {
  return request.post('/course/api/zone/course/listAll', { zoneLocation: zoneLocation }, { login: false });
}

// 首页轮播图
export function advList(platShow) {
  return request.post('/course/api/adv/list', {platShow: platShow}, { login: false });
}

/**
 * 文章 轮播列表
 * @returns {*}
 */
export function getArticleBanner() {
  return request.get("/article/banner/list", {}, { login: false });
}

/**
 * 文章分类列表
 * @returns {*}
 */
export function getArticleCategory() {
  return request.get("/article/category/list", {}, { login: false });
}

/**
 * 文章 热门列表
 * @returns {*}
 */
export function getArticleHotList() {
  return request.get("/article/hot/list", {}, { login: false });
}

/**
 * 文章列表
 * @returns {*}
 */
export function getArticleList(q, cid) {
  return request.get("/article/list/" + cid, q, { login: false });
}

/**
 * 分享
 * @returns {*}
 */
export function getShare() {
  return request.get("/share", {}, { login: false });
}

/**
 * 文章详情
 * @returns {*}
 */
export function getArticleDetails(id) {
  return request.get("/article/details/" + id, {}, { login: false });
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig(url) {
  return request.get(
    "/user/api/user/config",  {url: url},
    { login: false }
  );
}

/**
 * 确定微信授权
 * @returns {*}
 */
export function wechatAuth(code, state) {
  return request.post(
    "/user/api/user/getCode",
    { code: code, state: state },
    { login: false }
  );
}

/**
 * 获取微信appid
 * @returns {*}
 */
export function getAppId() {
  return request.post(
    "/user/api/user/getAppId",
    {},
    { login: false }
  );
}

/**
 * 获取快递公司
 * @returns {*}
 */
export function getLogistics() {
  return request.get("/logistics", {}, { login: false });
}

/**
 * 获取登陆logo
 * @returns {*}
 */
export function getLogo(type) {
  return request.get("/wechat/get_logo", { type: type }, { login: false });
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image, headImg) {
  return request.post("/course/api/course/image_base64",{ image: image, headImg: headImg },{ login: false });
}
