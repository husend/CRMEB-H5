import cookie from "@utils/store/cookie";
import { getUserInfo } from "@api/user";
import dialog from "@utils/dialog";

const LOGIN_KEY = "login_status";
const USERINFO_KEY = "user_info";
const USERNO_KEY = "user_no";

const state = {
  footer: true,
  home: true,
  homeActive: false,
  token: cookie.get(LOGIN_KEY) || null,
  backgroundColor: "#fff",
  userInfo: cookie.get(USERINFO_KEY) || null,
  userNo: cookie.get(USERNO_KEY) || null,
};

const mutations = {
  SHOW_FOOTER(state) {
    state.footer = true;
  },
  HIDE_FOOTER(state) {
    state.footer = false;
  },
  SHOW_HOME(state) {
    state.home = true;
  },
  HIDE_HOME(state) {
    state.home = false;
  },
  OPEN_HOME(state) {
    state.homeActive = true;
  },
  CLOSE_HOME(state) {
    state.homeActive = false;
  },
  LOGIN(state, token) {
    state.token = token;
    cookie.set(LOGIN_KEY, token);
  },
  LOGOUT(state) {
    state.token = undefined;
    state.userInfo = null;
    cookie.remove(LOGIN_KEY);
    cookie.remove(USERINFO_KEY);
  },
  BACKGROUND_COLOR(state, color) {
    state.color = color;
    document.body.style.backgroundColor = color;
  },
  UPDATE_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
    cookie.set(USERINFO_KEY, userInfo, 1);
  },
  USERNO(state, userNo) {
    state.userNo = userNo;
    cookie.set(USERNO_KEY, userNo);
  }
};

const actions = {
  USERINFO({ state, commit }, force) {
    if (state.userInfo !== null && !force) {
      return state.userInfo;
    } else {
      // return new Promise(reslove => {
      //微信登录
      getUserInfo(1, state.userNo).then(res => {
        commit("LOGIN", res.data.token);
        commit("UPDATE_USERINFO", res.data.userExt);
      }).catch(err => {
        dialog.error("获取信息失败!");
        location.replace("/");
      });
    }
  }
};

export default {
  state,
  mutations,
  actions
};
