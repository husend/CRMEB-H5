import axios from "axios";
import $store from "../store";
import toLogin from "@libs/login";
import { VUE_APP_API_URL } from "@utils/index";

const instance = axios.create({
  baseURL: VUE_APP_API_URL,
  timeout: 8000
});

const defaultOpt = { login: true };

// // request拦截器
// instance.interceptors.request.use(
//   config => {
//     const token = $store.state.app.token;
//     config.headers['token'] = token || null // 让每个请求携带自定义token 请根据实际情况自行修改
//     return config
//   },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )
// //
// // // response 拦截器
// instance.interceptors.response.use(
//   response => {
//
//     return response.data
//   },
//   error => {
//     console.log('err' + error) // for debug
//     return Promise.reject(error)
//   }
// )

function baseRequest(options) {
  const token = $store.state.app.token;
  const headers = options.headers || {};
  headers["token"] = token;
  // headers["Access-Control-Allow-Origin"] = "*";
  options.headers = headers;
  if (options.login && !token) {
    toLogin();
    return;
  }
  console.log(options);
  return instance(options).then(res => {
    const data = res.data || {};
    if (res.status !== 200)
      return { msg: "请求失败", res, data };

    if (data.code === 301) {
      toLogin();
      return { msg: res.data.msg, res, data, toLogin: true };
    } else if (data.code === 200) {
      return data;
    } else {
      return { msg: res.data.msg, res, data };
    }
  });
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ["post", "put", "patch"].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, data, method }, defaultOpt, options)
    );
  };
  return request;
}, {});
//
["get", "delete", "head"].forEach(method => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, params, method }, defaultOpt, options)
    );
  };
});

export default request;
