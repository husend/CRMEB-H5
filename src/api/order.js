/*
 * 订单确认
 * */
import request from "@utils/request";

/**
 * 通过购物车 id 获取订单信息
 * @param cartId
 * @returns {*}
 */
export function postOrderConfirm(cartId) {
  return request.post("/order/confirm", { cartId });
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
  return request.post("/order/computed/" + key, data);
}

/**
 * 获取指定金额可用优惠券
 * @param price
 * @returns {*}
 */
export function getOrderCoupon(price) {
  return request.get("/coupons/order/" + (parseFloat(price) || 0));
}

/**
 * 生成订单
 * @param key
 * @param data
 * @returns {*}
 */
// export function createOrder(key, data) {
//   return request.post("/order/create/" + key, data || {});
// }

// 创建订单
export function createOrder(data) {
  return request.post("/course/auth/order/info/pay", data, {login: true})
}

// 订单继续支付
export function oldOrderPay(data) {
  return request.post("/course/auth/order/info/continue/pay", data, {login: true})
}

/**
 * 订单统计数据
 * @returns {*}
 */
export function getOrderData(data) {
  return request.post("/course/auth/order/info/getData", data, {login: true});
}

/**
 * 订单列表
 * @returns {*}
 */
export function getOrderList(data) {
  return request.post("/course/auth/order/info/list", data, {login: true});
}

/**
 * 取消订单
 * @returns {*}
 */
export function cancelOrder(id) {
  return request.post("/course/auth/order/info/close", { orderNo: id }, {login: true});
}

/**
 * 订单详情
 * @returns {*}
 */
export function orderDetail(data) {
  return request.post("/course/auth/order/info/view", data, {login: true});
}

/**
 * 退款理由
 * @returns {*}
 */
export function getRefundReason() {
  return request.get("/order/refund/reason");
}

/**
 * 提交退款
 * @returns {*}
 */
export function postOrderRefund(data) {
  return request.post("/order/refund/verify", data);
}

/**
 * 确认收货
 * @returns {*}
 */
export function takeOrder(uni) {
  return request.post("/order/take", { uni });
}

/**
 * 删除订单
 * @returns {*}
 */
export function delOrder(uni) {
  return request.post("/order/del", { uni });
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni) {
  return request.get("order/express/" + uni);
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function payOrder(uni, paytype, from) {
  return request.post("order/pay", { uni, paytype, from });
}
/**
 * 订单核销
 * @returns {*}
 */
export function orderVerific(verify_code, is_confirm) {
  return request.post("order/order_verific", { verify_code, is_confirm });
}
