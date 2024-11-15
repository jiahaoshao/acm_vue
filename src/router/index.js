import { createWebHashHistory, createRouter } from 'vue-router'
import login from '../views/LoginView.vue'
import register from '../views/RegisterView.vue'
import resetpsw from '../views/ResetPswView.vue'
import home from '@/views/Home.vue'
import info from '@/views/Info.vue'
import ai from '@/views/AssistAi.vue'
import about from '@/views/About.vue'
import home2 from '@/views/InsideHome.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/register',component: register},
  { path: '/resetpsw',component: resetpsw},
  {
    path:'/home',
    component:home,
    children:[
      // {
      //   path: '',  // 默认子路由，如果访问 /home，会直接加载 home2 组件
      //   redirect: 'home2',  // 默认重定向到 home2
      // },
      {
        path: 'home2',  // home2 子路由
        component: home2
      },
      {
        path:'info',
        component:info
      },
      {
        path:'ai',
        component:ai
      },
      {
        path:'about',
        component:about
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
