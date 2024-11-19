/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus, { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './styles/index.less' // 导入全局样式
import api from './requset/api/index'
import axios from 'axios'

const app = createApp(App)



for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 将各模块api挂载在vue实例上
app.config.globalProperties.$api = api
app.provide('$api', api)
//axios.defaults.baseURL = 'http://26.201.192.85:8181'
axios.defaults.withCredentials = true
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

app.use(store).use(router).use(ElementPlus).mount('#app')



