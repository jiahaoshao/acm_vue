/* eslint-disable */
/*
登录注册模块
*/
import axios from '@/requset/http';
// import axios from 'axios';
import querystring from 'querystring';

const signApi = {
  //登录
  signin(params){
    return axios.post('/sign/signin', params);
  },
  //注册
  signup(params){
    return axios.post(`/sign/signup`, params);
  },
  //登出
  signout(params){
    return axios.get('/sign/signout',{params: params});
  },
  //获取验证码
  getEmailVerifyCode(params){
    return axios.get('/sign/getemailverifycode', {params: params});
  },
  //获取公钥
  getKey(){
    return axios.get('/sign/getkey');
  },
  //重置密码
  resetPassword(params){
    return axios.post('/sign/resetpassword', params);
  }
};

export default signApi;
