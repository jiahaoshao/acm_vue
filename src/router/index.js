import { createWebHashHistory, createRouter } from 'vue-router'
import login from '../views/LoginView.vue'
import register from '../views/RegisterView.vue'
import resetpsw from '../views/ResetPswView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/register',component: register},
  { path: '/resetpsw',component: resetpsw}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
