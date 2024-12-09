<template>
  <div id="home">
    <!-- 顶部导航栏 -->
    <div class="topbar">
      <nav>
        <ul class="left-nav">
          <li><router-link to="/home/home2">首页</router-link></li>
          <li><a href="#/ai" target="'_blank'">AI中心</a></li>
        </ul>

        <!-- 右侧导航栏 -->
        <ul class="right-nav">
          <!-- 判断用户是否登录 -->

          <!-- 只有登录后才显示个人信息 -->
          <li>
            <el-dropdown
              trigger="hover"
              class="el-tooltip__trigger"
              style="cursor: pointer"
            >
              <span>
                <el-avatar
                  shape="circle"
                  :size="50"
                  :src="imageBase64"
                  @click="goToSpace(user.uid)"
                  class="avatar"
                  style="cursor: pointer"
                  v-if="isLoggedIn"
                  ></el-avatar
                >
                <el-avatar
                  shape="circle"
                  :size="50"
                  @click="goToLogin"
                  class="avatar"
                  style="cursor: pointer"
                  v-if="!isLoggedIn"
                  >登录</el-avatar
                >
              </span>

              <template #dropdown>
                <el-dropdown-menu
                  class="custom-dropdown-menu"
                  v-if="isLoggedIn"
                >
                  <el-dropdown-item icon="UserFilled" @click="goToInfo" class="dropdown-item"
                    >个人中心</el-dropdown-item
                  >
                  <el-dropdown-item icon="Reading" @click="goToAbout" class="dropdown-item"
                    >关于我们</el-dropdown-item
                  >
                  <el-dropdown-item icon="SwitchButton" @click="signout" class="dropdown-item" divided
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
                <el-dropdown-menu
                  v-if="!isLoggedIn"
                  class="login-dropdown-menu"
                >
                  <div class="login-message">
                    <span>登录后你可以：</span>
                    <ul class="benefits-list">
                      <li>免 费 看 高 清 视 频</li>
                      <li>多 端 同 步 播 放 记 录</li>
                      <li>发 表 评 论 / 弹 幕</li>
                      <li>热 门 番 剧 影 视 看 不 停</li>
                    </ul>
                  </div>
                  <el-button
                    type="primary"
                    @click="goToLogin"
                    class="login-button"
                    >立即登录</el-button
                  >
                  <div class="signup-message">
                    <span>首次使用？</span>
                    <router-link to="/register" class="signup-link"
                      >点击注册</router-link
                    >
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
          <li>
            <el-button
              @click="goToRelease"
              class="release-button"
              icon="CirclePlusFilled"
              >发布</el-button
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view></router-view>
      <!-- 渲染子路由 -->
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import myJson from "@/../public/static/config.json";

const { image_url } = myJson;


const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;

const router = useRouter();
const route = useRoute();
const store = useStore();

const user = ref({});
//const image = ref("");
const isLoggedIn = ref(false);
const imageBase64 = ref("https://jsd.cdn.zzko.cn/gh/fangyi002/picture_bed/images/avatar/default.png");

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(localStorage.getItem("user"));
    isLoggedIn.value = true;
    imageBase64.value = user.value.avatar;
    //console.log(user.value)
  }
});

const goToLogin = () => {
  router.push("/login"); // 跳转到登录页面
};

const goToSignup = () => {
  router.push("/register"); // 跳转到注册页面
};

const goToInfo = () => {
  router.push("/home/info");
};

const goToSpace = (uid) => {
  router.push(`/space/${uid}`);
};

const goToRelease = () => {
  router.push("/release");
};

const goToAbout = () => {
  router.push("/home/about");
};

const signout = () => {
  store.commit("signout"); // 调用 Vuex 的 logout mutation
  location.reload();
};
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column; /* 主容器垂直布局 */
  height: 80vh;
}

.topbar {
  width: 100%;
  background-color: white;
  color: white;
  padding: 0px 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
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
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中 */
}

.left-nav li a,
.right-nav li a,
.auth-button {
  color: black;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
}

.left-nav li a:hover,
.right-nav li a:hover,
.auth-button:hover {
  animation: text-jump 0.5s alternate;
}

/* 右侧导航项自动推到右边 */
.right-nav {
  margin-left: auto;
}

.main-content {
  flex-grow: 1;
  padding: 100px;
  background-color: #f4f6f9;
}

/* 保证下拉框内容的显示与交互 */
.el-dropdown__wrapper {
  display: inline-block;
  position: relative;
}
/* 头像的悬停效果 */
.el-avatar {
  transition: transform 0.3s ease; /* 头像变大的过渡动画 */
}
/* 头像悬停时放大 */
.el-avatar:hover {
  transform: scale(1.4); /* 放大头像 */
}
/* 当下拉框悬停时保持头像放大 */
.el-dropdown__wrapper:hover .el-avatar {
  transform: scale(1.4); /* 在下拉框悬停时，头像保持放大 */
}

.release-button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 20px 15px;
  border-radius: 5px;
  background-color: #ef632b;
  border: none;
  cursor: pointer;
}

.release-button:hover {
  background-color: #f97d1c;
  color: white; /* 保持字体颜色不变 */
}

/* 定义文字跃动的关键帧 */
@keyframes text-jump {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5px);
  }
  100% {
    transform: translate(0, 0);
  }
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.custom-dropdown-menu {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  min-width: 250px; /* 确保下拉框有足够的宽度 */
  min-height: 110px; /* 给下拉框设置一个最小高度，确保菜单项显示 */
  padding: 20px;
  background-color: #f4f6f9; /* 淡灰色背景 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  font-size: 18px;
}
.login-dropdown-menu {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  min-width: 250px; /* 确保下拉框有足够的宽度 */
  min-height: 200px; /* 给下拉框设置一个最小高度，确保菜单项显示 */
  padding: 20px;
  background-color: #f4f6f9; /* 淡灰色背景 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  text-align: center;
  font-size: 16px;
}
.login-message {
  margin-bottom: 10px;
  font-weight: bold; /* 粗体显示 */
}
.benefits-list {
  list-style: none; /* 去掉列表样式 */
  padding: 0;
  margin: 0;
}
.benefits-list li {
  margin: 5px 0;
}
.login-button {
  margin: 10px 0;
  width: 100%; /* 宽度占满 */
  text-align: center; /* 文本居中 */
  font-size: 18px;
}
.signup-message {
  margin-top: 10px;
  text-align: center; /* 文字居中 */
  font-weight: bold; /* 粗体显示 */
}
.signup-link {
  color: #3498db; /* 蓝色链接 */
  text-decoration: none; /* 去掉下划线 */
}
.signup-link:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}
.dropdown-item{
  font-size: 18px;
}
</style>
