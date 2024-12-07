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
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

// 引入 markdown-it
import MarkdownIt from 'markdown-it';
// 引入 markdown-it-attrs 插件
import markdownItAttrs from 'markdown-it-attrs';

// highlightjs
import hljs from 'highlight.js';
import Prism from 'prismjs';

const md = MarkdownIt();
md.use(markdownItAttrs);

VMdEditor.use(vuepressTheme,{
  Prism,
  extend(md) {
    md.set({ html: true });
    md.use(markdownItAttrs);
  }
});

VMdPreview.use(vuepressTheme,{
  Prism,
  extend(md) {
    md.set({ html: true });
    md.use(markdownItAttrs);
  }
});

const app = createApp(App)

app.use(VMdEditor);
app.use(VMdPreview);

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

const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
  
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}




