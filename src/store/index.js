// 不需要 import Vue 和 Vuex 2.x 的用法
import { createStore } from 'vuex';
import axios from 'axios';
export default createStore({
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
  },
  getters: {},
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
    }
  },
  actions: {},
  modules: {}
});
axios.interceptors.request.use(
  config => {
    const token = createStore.state.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);