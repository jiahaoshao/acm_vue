/* eslint-disable */
//封装axios
import axios from 'axios';
import router from '../router';
import store from '../store/index';
import { ElMessage } from 'element-plus';


const toSignin = function (msg) {
  store.dispatch("clearUserInfo");

  var message = msg ? msg : "session过期，即将前往登录页面";
  ElMessage.error({showClose: true, message: message, duration: 3000, onClose: function () {
      router.replace({path: '/login', query: {redirect: router.currentRoute.fullPath}
      });
  }});
}
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 400:
      ElMessage.error("请求参数有误！");
      break;
    // 401: 未登录状态，跳转登录页
    case 401:
      //vueobj.$message.error({showClose: true, message: "session过期，即将前往登录页面！", duration: 3000});
      toSignin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      ElMessage.error({showClose: true, message: "没有操作权限！", duration: 3000});
      break;
    // 404请求不存在
    case 404:
      ElMessage.error({showClose: true, message: "请求不存在", duration: 3000});
      break;
    case 500:
      ElMessage.error({showClose: true, message: "请求失败，服务器内部错误", duration: 3000});
      break;
    case 504:
      ElMessage.error({showClose: true, message: "与服务器连接失败！", duration: 3000});
      break;
    default:
      console.log(other);
  }}


// 创建axios实例
var instance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  timeout: 90000,
  
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'x-token': '777',
  },
  });

// 添加请求拦截器
instance.interceptors.request.use(
  function(config) {
    console.log('请求拦截1')
    // const newConfig = config;
    // Object.assign(newConfig.headers, { 'x-token': 'some-token' });
    if(localStorage.getItem('token')){
      config.headers.token = localStorage.getItem('token');
    }
    return config;
  },
  function(error) {
    // do......
    console.log('请求拦截2')
    // 对请求错误进行操作
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      if(typeof response.data != 'undefined'){
        return Promise.resolve(response);
      }else{
        return Promise.reject(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {

    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);

    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      //store.commit('changeNetwork', false);
      //toSignin();
      //vueobj.$message.error({showClose: true, message: "与服务器连接失败！", duration: 3000});

      var originalRequest = error.config;
      if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
        // originalRequest._retry = true
        // return axios.request(originalRequest);
        ElMessage.error({showClose: true, message: "请求超时，请稍后重试！", duration: 3000});
        return Promise.reject(response);
      }else{

      }
    }
  }
);

export default instance

