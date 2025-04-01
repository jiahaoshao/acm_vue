<template>
  <div id="home">
    <Homebar></Homebar>
    <div class="main-content">
  <div class="article-container">
    <div
      class="article-card"
    >
    <div class="author-info">
      <el-avatar
          shape="circle"
          :size="50"
          :src="user.avatar"
          @click="goToSpace(user.uid)"
          class="author-avatar"
          style="cursor: pointer"
        ></el-avatar>
        <span
          class="author-name"
          >{{ user.username }} 的个人空间</span
        >
    </div>
   
    </div>
    <div
      v-for="article in articles"
      :key="article.aid"
      class="article-card"
      @click="goToArticle(article.aid)"
      style="cursor: pointer"
    >
      <div class="author-info" v-if="article.author">
        <el-avatar
          shape="circle"
          :size="30"
          :src="article.author.avatar"
          @click="goToSpace(article.author.uid)"
          class="author-avatar"
          style="cursor: pointer"
        ></el-avatar>
        <span
          class="author-name"
          @click="goToSpace(article.author.uid)"
          style="cursor: pointer"
          >{{ article.author.username }}</span
        >
        <span class="create-time">{{ article.formattedDate }}</span>
      </div>
      <h3 class="article-title">{{ article.title }}</h3>
      <!-- <div class="article-content">{{ article.summary }}</div> -->
      <v-md-preview :text="article.summary"></v-md-preview>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!hasMore" class="no-more">没有更多文章了</div>
  </div>
</div>
  </div>
</template>
  
<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked"; // 引入 marked 库
import nProgress from "nprogress"; // 导入 nprogress
import "@/components/nprogress"; // 导入样式，否则看不到效果
import { useStore } from "vuex";
import Homebar from "@/components/Homebar.vue";

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

let router = useRouter();
const route = useRoute();
const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;
const articles = ref([]);
const page = ref(1); // 当前页数
const limit = ref(10); // 每页文章数量
const hasMore = ref(true); // 是否还有更多数据
const loading = ref(false); // 加载状态
const uid = ref();


onMounted(() => {
  uid.value = route.params.uid;
  loadArticles();
  window.addEventListener("scroll", handleScroll);
});

// 加载文章
const loadArticles = async () => {
  nProgress.start(); // 开始加载进度条
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const res = await $api.articleApi.getArticle(page.value, limit.value);
    const data = res.data.data;

    // console.log(data);
    // console.log(uid.value);
    // 过滤掉 authorId 不等于 uid 的文章
    const filteredArticles = data.filter(
      (article) => article.authorId == uid.value
    );

    for (const article of filteredArticles) {
      const authorRes = await $api.userApi.getuserbyuid({
        uid: article.authorId,
      });
      if (authorRes.status === 200) {
        article.author = authorRes.data.data;
      } else {
        article.author = {
          avatar:
            "https://jsd.cdn.zzko.cn/gh/fangyi002/picture_bed/images/avatar/default.png",
          username: "未知作者",
        }; // 默认作者信息
      }
      // 使用 extractSummary 函数生成摘要
      article.summary = extractSummary(article.content);
      // 格式化日期
      article.formattedDate = formatDate(article.createTime);
    }
    articles.value.push(...filteredArticles); // 将新文章添加到 articles 中
    if (filteredArticles.length < limit.value) {
      hasMore.value = false; // 如果返回的文章数量少于 limit，说明没有更多文章了
    }
    page.value++; // 增加页数
  } catch (error) {
    console.error("加载文章失败", error);
  } finally {
    loading.value = false;
    nProgress.done(); // 结束加载进度条
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 提取摘要的函数
const extractSummary = (content) => {
  // 定义正则表达式，处理 options 可选情况
  const imageRegex = /!\[(.*?)\]\((.*?)\)(\{\{\{(.*?)\}\}\})?/g;

  // 替换图片语法
  const modifiedContent = content.replace(
    imageRegex,
    (match, alt, url, optionsGroup, options) => {
      return `![${alt}](${url})`;
    }
  );

  // 使用 marked 解析修改后的内容
  const htmlContent = marked.parse(modifiedContent);

  const div = document.createElement("div");
  div.innerHTML = htmlContent;

  // 提取文字内容
  let text = div.innerText || div.textContent || "";
  text = text.replace(imageRegex, " ").trim();
  const summaryText = text.length > 100 ? text.substring(0, 100) + "..." : text;

  // 提取前 3 张图片
  const imgElements = div.querySelectorAll("img");
  const images = [];
  for (let i = 0; i < Math.min(imgElements.length, 3); i++) {
    if (imgElements[i].width > 300) {
      imgElements[i].style.width = "300px";
      imgElements[i].style.height = "auto";
    }
    images.push(imgElements[i].outerHTML);
  }
  const imagesHtml = images.join("");

  return summaryText + imagesHtml;
};

const goToSpace = (uid) => {
  router.push({ path: `/space/${uid}` });
};

const goToArticle = (aid) => {
  router.push({ path: `/article/${aid}` });
};

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight; // 文档的总高度
  const scrollTop = document.documentElement.scrollTop; // 滚动的高度
  const clientHeight = document.documentElement.clientHeight; // 可见区域高度
  if (scrollTop + clientHeight >= scrollHeight - 10) loadArticles();
};
</script>
  
<style scoped>
.article-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* 文章卡片的样式 */
.article-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
}

/* 文章标题 */
.article-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* 文章内容 */
.article-content {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  word-wrap: break-word;
}

.article-content img {
  max-width: 50%;
  height: auto;
  display: block;
}

/* 加载中提示 */
.loading {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}

/* 没有更多文章提示 */
.no-more {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}

/* 页面滚动时的容器间距 */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.author-avatar {
  margin-right: 10px;
}

.author-name {
  font-weight: bold;
  font-size: 16px;
}

.create-time {
  margin-left: auto; /* 将日期放到右侧 */
  font-size: 14px;
  color: #888;
}

.loading,
.no-more {
  text-align: center;
  font-size: 16px;
  color: #888;
}
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
.dropdown-item {
  font-size: 18px;
}
</style>
  