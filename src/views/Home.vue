<template>
    <div id="home">
      <div class="sidebar">
        <nav>
          <ul>
            <li><router-link to="/home/home2">首页</router-link></li>
            <li><router-link to="/home/ai">ai助手</router-link></li>
            <li><router-link to="/home/info">个人信息</router-link></li> 
            <li><router-link to="/home/about">关于我们</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="main-content">
        <router-view></router-view> <!-- 渲染子路由 -->
      </div>
    </div>
  </template>
  <script>
    export default {
        name:'Home'
    }
</script>
<style scoped>
#home {
  display: flex;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  padding-top: 20px;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  margin: 20px 0;
}

.sidebar nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar nav ul li a:hover {
  background-color: #34495e;
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