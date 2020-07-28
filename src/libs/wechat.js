import WechatJSSDK from "wechat-jssdk/dist/client.umd";
import wx from 'weixin-js-sdk'
import { getWechatConfig, wechatAuth, getAppId } from "@api/public";
import { parseQuery } from "@utils";
import cookie from "@utils/store/cookie";
import store from "@/store";
import dayjs from "dayjs";

const STATE_KEY = "wx_authorize_state";
const WX_AUTH = "wx_auth";
const BACK_URL = "login_back_url";
const LOGINTYPE = "loginType";
const JS_URL = "http://husend.free.idcfengye.com"
let instance;
let wechatObj;

export default function wechat() {
  return new Promise((resolve, reject) => {

  });
}

export function clearAuthStatus() {
  cookie.remove(WX_AUTH);
  cookie.remove(STATE_KEY);
}

export function oAuth() {
  console.log(location.href)
  if (cookie.has(WX_AUTH) && store.state.app.token) return;
  const { code } = parseQuery();
  if (!code) {
    return toAuth();
  } else {
    const state = cookie.get(STATE_KEY)
    const url = location.href.split('?')[0]
    auth(code, state, url)
  }
}

export function auth(code, state, url) {
    let loginType = cookie.get(LOGINTYPE);
    wechatAuth(code, state).then(data => {
        store.commit("LOGIN", data.data.token);
        store.commit("UPDATE_USERINFO", data.data.userExt);
        store.commit("USERNO", data.data.userNo);
        cookie.set(WX_AUTH, code);
        cookie.remove(STATE_KEY);
        location.href = decodeURIComponent(
          decodeURIComponent(url)
        );
      }).catch(err => {
        location.replace("/");
    });
}

export function toAuth() {
  if (instance) {
    return resolve(instance);
  }
  // getWechatConfig().then(res => {
  //   const _wx = WechatJSSDK(res.data);
  //   wechatObj = _wx;
  //   _wx.initialize().then(() => {
  //     instance = _wx.wx;
  //     instance.initConfig = res.data;
  //     location.href = getAuthUrl(wechatObj);
  //   }).catch(err => {
  //     console.error(err);
  //   });
  // }).catch(err => {
  //   console.log(err);
  // });
  getAppId().then(res => {
    console.log(res.data.appid)
    console.log(res.data.state)
    // const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.data.appid}&redirect_uri=${res.data.redirectUri}&response_type=code&scope=snsapi_userinfo&state=${res.data.state}#wechat_redirect`
    location.href = getAuthUrl(res.data.appid, res.data.state);
  }).catch(err => {
    alert(err.msg)
  })
}

function getAuthUrl(appId, state) {
  const login_back_url = cookie.has(BACK_URL) ? cookie.get(BACK_URL) : location.pathname + location.search
  // const redirect_uri = encodeURIComponent(
  //   `${location.origin}/auth/` +
  //     encodeURIComponent(
  //       encodeURIComponent(login_back_url)
  //     )
  // );
  const redirect_uri = encodeURIComponent(`${location.origin}` + `/static` + `${login_back_url}`);
  cookie.remove(BACK_URL);
  cookie.set(STATE_KEY, state);
console.log(redirect_uri)
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
}

function toPromise(fn, config = {}) {
  return new Promise((resolve, reject) => {
    fn({
      ...config,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
      complete(err) {
        reject(err);
      },
      cancel(err) {
        reject(err);
      }
    });
  });
}

export function pay(config) {
  return toPromise(instance.chooseWXPay, config);
}

export function openAddress() {
  return new Promise((resolve, reject) => {
    wechatEvevt("openAddress", {})
      .then(res => {
        console.log(res);
        resolve(res);
      })
      .catch(res => {
        console.log(res);
        if (res.is_ready) {
          res.wx.openAddress({
            fail(res) {
              reject(res);
            },
            success(res) {
              resolve(res);
            }
          });
        } else {
          reject(res);
        }
      });
  });
}

export function openShareAll(config) {
  config || {};
  config.type = config.type == undefined ? "link" : config.type;
  getWechatConfig(location.href.split('#')[0]).then(res => {
    const wxConfig = {
      //前4个是微信验证签名必须的参数，第2-4个参数为类似上面 '/get-signature' 从node端获取的结果
      'appId': res.data.appId,
      'nonceStr': res.data.nonceStr,
      'signature': res.data.signature,
      'timestamp': res.data.timestamp,
      //下面为可选参数
      'debug': false, //开启 debug 模式
      'jsApiList': res.data.jsApiList //设置所有想要使用的微信jsapi列表, 默认值为 ['onMenuShareTimeline', 'onMenuShareAppMessage']，分享到朋友圈及聊天记录
    }
    wx.config(wxConfig)
    wx.ready(function(){
      wx.updateAppMessageShareData(config)
      wx.updateTimelineShareData(config)
    });
  });
}

export function openShareAppMessage(config) {
  instance.updateAppMessageShareData(config);
  instance.onMenuShareAppMessage && instance.onMenuShareAppMessage(config);
}

export function openShareTimeline(config) {
  instance.updateTimelineShareData(config);
  instance.onMenuShareTimeline && instance.onMenuShareTimeline(config);
}

/**
 * 公众号事件
 * @param name 事件名
 * @param config 配置
 * @returns {Promise<unknown>}
 */
export function wechatEvevt(name, config) {
  return new Promise((resolve, reject) => {
    let wx;
    let configDefault = {
      fail(res) {
        console.log(res);
        if (wx) return reject({ is_ready: true, wx: wx });
        getWechatConfig().then(res => {
          wechatObj.signSignature({
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            timestamp: res.data.timestamp
          });
          wx = wechatObj.getOriginalWx();
          reject({ is_ready: true, wx: wx });
        });
      },
      success(res) {
        resolve(res);
      }
    };
    Object.assign(configDefault, config);
    if (typeof instance !== "undefined") {
      instance.ready(() => {
        if (typeof name === "object") {
          name.forEach(item => {
            instance[item] && instance[item](configDefault);
          });
        } else instance[name] && instance[name](configDefault);
      });
    } else {
      getWechatConfig().then(res => {
        const _wx = WechatJSSDK(res.data);
        _wx.initialize().then(() => {
          instance = _wx.getOriginalWx();
          instance.ready(() => {
            if (typeof name === "object") {
              name.forEach(item => {
                instance[item] && instance[item](configDefault);
              });
            } else instance[name] && instance[name](configDefault);
          });
        });
      });
    }
  });
}

export function ready() {
  return new Promise(resolve => {
    if (typeof instance !== "undefined") {
      instance.ready(() => {
        resolve(instance);
      });
    } else {
      getWechatConfig().then(res => {
        const _wx = WechatJSSDK(res.data);
        _wx.initialize().then(() => {
          instance = _wx.wx;
          instance.ready(() => {
            resolve(instance);
          });
        });
      });
    }
  });
}
