import { createWebHashHistory, createRouter } from 'vue-router'
import login from '../views/LoginView.vue'
import register from '../views/RegisterView.vue'
import resetpsw from '../views/ResetPswView.vue'
import home from '@/views/Home.vue'
import info from '@/views/Info.vue'
import chatai from '@/views/AssistAi.vue'
import about from '@/views/About.vue'
import home2 from '@/views/InsideHome.vue'
import changeInfo from '@/views/ChangeInfo.vue'
import changePassword from '@/views/ChangePassword.vue'
import confirmPassword from '@/views/ConfirmPassword.vue'
import { ElMessage } from 'element-plus'
import Test from '@/views/test.vue'
import musicAi from'@/views/musicAi.vue'
import artAi from '@/views/artAi.vue'
import ai from '@/views/Ai.vue'
import Release from '@/views/ReleaseView.vue'
import Space from '@/views/SpaceView.vue'
import PreView from '@/views/PreView.vue'
const routes = [
  { path: '', redirect: '/home' },
  { path: '/login', component: login },
  { path: '/register',component: register},
  { path: '/resetpsw',component: resetpsw},
  {
    path: '/ai',
    component: ai,
    children:[
      {
        path: '',
        redirect: '/ai/chatai',
      },
      {
        path: 'chatai',
        component: chatai
      },
      {
        path: 'musicai',
        component: musicAi
      },
      {
        path: 'artai',
        component: artAi
      }
    ]
  },
  {
    path:'/home',
    component:home,
    children:[
      {
        path: '',  // 默认子路由，如果访问 /home，会直接加载 home2 组件
        redirect: '/home/home2',  // 默认重定向到 home2
      },
      {
        path: 'home2',  // home2 子路由
        component: home2
      },
      {
        path:'info',
        component:info,
      },
      {
        path:'about',
        component:about
      },
      {
        path:'changeInfo',
        component:changeInfo
      },
      {
        path:'changePassword',
        component:changePassword
      },
      {
        path:'confirmPassword',
        component:confirmPassword
      }

    ]
  },
  { path: '/test', component: Test},
  { path: '/release', component: Release},
  { path: '/space', component: Space},
  { path: '/preview', component: PreView},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

//路由全局前置守卫
router.beforeEach((to, from, next) => {
  const whiteList = ['/register', '/login', '/', '/resetpsw', '/home', '/home/home2'];
  if (whiteList.includes(to.path)) {
    next();
  } else {
    let userToken = localStorage.getItem('token');
    console.log("Token为:" + userToken);
    if (userToken == null || userToken == '') {
      ElMessage.error("无权限，请先登录!");
      return next('/login');
    } else {
      next();
    }
  }
});



export default router
