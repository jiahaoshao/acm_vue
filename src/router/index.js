import { createWebHashHistory, createRouter } from 'vue-router'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import ResetPsw from '../views/ResetPswView.vue'
import Home from '@/views/Home.vue'
import Info from '@/views/Info.vue'
import AssistAi from '@/views/AssistAi.vue'
import About from '@/views/About.vue'
import Home2 from '@/views/InsideHome.vue'
import ChangeInfo from '@/views/ChangeInfo.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import ConfirmPassword from '@/views/ConfirmPassword.vue'
import { ElMessage } from 'element-plus'
import Test from '@/views/test.vue'
import musicAi from'@/views/musicAi.vue'
import artAi from '@/views/artAi.vue'
import Ai from '@/views/Ai.vue'
import Release from '@/views/ReleaseView.vue'
import Space from '@/views/SpaceView.vue'
import PreView from '@/views/PreView.vue'
import Article from '@/views/Article.vue'
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/resetpsw', component: ResetPsw },
  { path: '/home', component: Home, children: [
      { path: '', redirect: '/home/home2' },
      { path: 'home2', component: Home2 },
      { path: 'info', component: Info },
      { path: 'about', component: About },
      { path: 'changeInfo', component: ChangeInfo },
      { path: 'changePassword', component: ChangePassword },
      { path: 'confirmPassword', component: ConfirmPassword }
    ]
  },
  { path: '/ai', component: Ai, children: [
      { path: '', redirect: '/ai/assistai' },
      { path: 'musicAi', component: musicAi },
      { path: 'artAi', component: artAi },
      { path: 'assistai', component: AssistAi }
    ]
  },
  { path: '/test', component: Test },
  { path: '/release', component: Release },
  { path: '/space/:uid', component: Space }, // 修改此行，添加动态参数 :uid
  { path: '/preview', component: PreView },
  { path: '/article/:aid', component: Article } // 修改此行，添加动态参数 :aid
];

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
