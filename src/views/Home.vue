<template>
  <div id="home">
    <!-- 顶部导航栏 -->
    <div class="topbar">
      <nav>
        <ul class="left-nav">
          <li><router-link to="/home/home2">首页</router-link></li>
          <li><router-link to="/home/ai">AI助手</router-link></li>
          <li><router-link to="/home/about">关于我们</router-link></li>
        </ul>
        
        <!-- 右侧导航栏 -->
        <ul class="right-nav">
          <!-- 判断用户是否登录 -->
          <li v-if="!isLoggedIn">
            <button @click="goToLogin" class="auth-button">登录</button>
          </li>
          <li v-if="!isLoggedIn">
            <button @click="goToSignup" class="auth-button">注册</button>
          </li>
          
          <!-- 只有登录后才显示个人信息 -->
          <li v-if="isLoggedIn">
            <router-link to="/home/info">个人信息</router-link>
          </li>
          
          <!-- 只有登录后才显示注销按钮 -->
          <li v-if="isLoggedIn">
            <button @click="logout" class="auth-button">退出登录</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view></router-view> <!-- 渲染子路由 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    // 从 Vuex 中获取用户是否已登录的状态
    isLoggedIn() {
      return !!this.$store.state.user; // 如果用户信息存在，则认为用户已登录
    }
  },
  methods: {
    // 跳转到登录页
    goToLogin() {
      this.$router.push('/login'); // 跳转到登录页面
    },
    // 跳转到注册页
    goToSignup() {
      this.$router.push('/signup'); // 跳转到注册页面
    },
    // 注销用户
    logout() {
      this.$store.commit('logout'); // 调用 Vuex 的 logout mutation
      this.$router.push('/login'); // 注销后跳转到登录页面
    }
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column; /* 主容器垂直布局 */
  height: 100vh;
}

.topbar {
  width: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 0px 0;
}

.topbar nav {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
}

.left-nav,
.right-nav {
  list-style: none;
  display: flex;
  padding: 0;
}

.left-nav li,
.right-nav li {
  margin: 0 20px;
}

.left-nav li a,
.right-nav li a,
.auth-button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.left-nav li a:hover,
.right-nav li a:hover,
.auth-button:hover {
  background-color: #34495e;
}

/* 右侧导航项自动推到右边 */
.right-nav {
  margin-left: auto;
}

/* 按钮样式 */
.auth-button {
  background-color: #2980b9;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 5px;
}

.auth-button:hover {
  background-color: #3498db;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f4f6f9;
}

.router-link-active {
  background-color: #42b983; /* 选中的项变色 */
  color: white; /* 选中的项文字颜色 */
  border-radius: 5px;
}
</style>
