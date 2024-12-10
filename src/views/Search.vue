<template>
    <div class="article-container">
    
      <div v-for="article in filteredArticles" :key="article.aid" class="article-card" @click="goToArticle(article.aid)" style="cursor: pointer">
        <div class="author-info" v-if="article.author">
          <el-avatar
            shape="circle"
            :size="30"
            :src="article.author.avatar"
            @click="goToSpace(article.author.uid)"
            class="author-avatar"
            style="cursor: pointer"
            ></el-avatar>
          <span class="author-name" @click="goToSpace(article.author.uid)" style="cursor: pointer">{{ article.author.username }}</span>
          <span class="create-time">{{ article.formattedDate }}</span>
        </div>
        <h3 class="article-title">{{ article.title }}</h3>
        <!-- <div class="article-content">{{ article.summary }}</div> -->
        <v-md-preview :text="article.summary"></v-md-preview>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="!hasMore" class="no-more">没有更多文章了</div>
    </div>
  </template>
    
  <script setup>
  import { onMounted, reactive, ref, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { marked } from 'marked'; // 引入 marked 库
  import nProgress from 'nprogress'   // 导入 nprogress
  import '@/components/nprogress'   // 导入样式，否则看不到效果
import { refresh } from "less";
  
  
  const router = useRouter();
  const globalProperties =
    getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
  const $api = globalProperties.$api;
  const articles = ref([]);
  const page = ref(1); // 当前页数
  const limit = ref(10); // 每页文章数量
  const hasMore = ref(true); // 是否还有更多数据
  const loading = ref(false); // 加载状态
  const searchQuery = ref("")
  const filteredArticles = ref([])

  // 加载文章
  const loadArticles = async () => {
    nProgress.start(); // 开始加载进度条
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    try {
      const res = await $api.articleApi.search({ keyword: searchQuery.value });
      console.log(res)
      const data = res.data;
      for (const article of data) {
        const authorRes = await $api.userApi.getuserbyuid({ uid: article.authorId });
          console.log(authorRes)
        if (authorRes.status === 200) {
          article.author = authorRes.data.data;
        } else {
          article.author = { avatar: 'https://jsd.cdn.zzko.cn/gh/fangyi002/picture_bed/images/avatar/default.png', username: '未知作者' }; // 默认作者信息
        }
        // 使用 extractSummary 函数生成摘要
        article.summary = extractSummary(article.content);
          // 格式化日期
        article.formattedDate = formatDate(article.createTime);
      }
      articles.value.push(...data);
      filteredArticles.value = [...articles.value]
      //searchArticles();
      hasMore.value = data.hasMore;
    } catch (err) {
      console.error("加载失败", err);
    } finally {
      loading.value = false;
      page.value++;
    }
    nProgress.done(); // 结束加载进度条
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 提取摘要的函数
  const extractSummary = (content) => {
    // 定义正则表达式，处理 options 可选情况
    const imageRegex = /!\[(.*?)\]\((.*?)\)(\{\{\{(.*?)\}\}\})?/g;
  
    // 替换图片语法
    const modifiedContent = content.replace(imageRegex, (match, alt, url, optionsGroup, options) => {
      return `![${alt}](${url})`;
    });
  
    // 使用 marked 解析修改后的内容
    const htmlContent = marked.parse(modifiedContent);
  
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
  
    // 提取文字内容
    let text = div.innerText || div.textContent || '';
    text = text.replace(imageRegex, ' ').trim();
    const summaryText = text.length > 100 ? text.substring(0, 100) + '...' : text;
  
    // 提取前 3 张图片
    const imgElements = div.querySelectorAll('img');
    const images = [];
    for (let i = 0; i < Math.min(imgElements.length, 3); i++) {
      if(imgElements[i].width > 300) {
        imgElements[i].style.width = '300px';
        imgElements[i].style.height = 'auto';
      }
      images.push(imgElements[i].outerHTML);
    }
    const imagesHtml = images.join('');
  
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

  onMounted(() => {
    searchQuery.value = router.currentRoute.value.query.q || "";
    console.log(searchQuery.value)
    loadArticles();
    window.addEventListener("scroll", handleScroll);
  });

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
  
  /* 文章头部部分：标题和作者 */
  .article-header {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 垂直居中 */
  }
  
  .article-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
    flex-grow: 1; /* 让标题占据更多空间 */
  }
  
  .article-authorName {
    font-size: 14px; /* 设置作者名的字体较小 */
    color: #7f8c8d;
    font-weight: normal;
    margin: 0;
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
  
  .loading, .no-more {
    text-align: center;
    font-size: 16px;
    color: #888;
  }
  .search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  </style>
    