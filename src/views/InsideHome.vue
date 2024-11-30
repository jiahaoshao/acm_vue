<template>
  <div class="article-container">
    <div v-for="article in articles" :key="article.aid" class="article-card" @click="goToArticle(article.aid)">
      <div class="article-header">
        <h3 class="article-title">{{ article.title }}</h3>
        <h3 class="article-authorName">by：{{ article.authorName }}</h3>
      </div>
      <p class="article-content"  v-html="parseMarkdown(getShortContent(article.content))"></p>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!hasMore" class="no-more">没有更多文章了</div>
  </div>
</template>
  
<script setup>
import MarkdownIt from "markdown-it";
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useStore } from "vuex";

const md = new MarkdownIt();
import router from '@/router';
const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;
const articles = ref([]);
const page = ref(1); // 当前页数
const limit = ref(10); // 每页文章数量
const hasMore = ref(true); // 是否还有更多数据
const loading = ref(false); // 加载状态
// 加载文章
const loadArticles = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const res = await $api.articleApi.getArticle(page.value, limit.value);
    const data = res.data;
      for(let article of data.data)
    {
      const authorRes=await $api.articleApi.getAuthorInfo(article.authorId);
      article.authorName=authorRes.data.data.username;
    }
    articles.value.push(...data.data);
    hasMore.value = data.hasMore;
  } catch (err) {
    console.error("加载失败", err);
  } finally {
    loading.value = false;
    page.value++;
  }
};
    //文本显示前100
    const getShortContent = (content) => {
  return content.length > 100 ? content.slice(0, 100) + '...' : content;
};

const parseMarkdown = (content) => { 
  return md.render(content); 
};
//滚动条监听

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight; // 文档的总高度
  const scrollTop = document.documentElement.scrollTop; // 滚动的高度
  const clientHeight = document.documentElement.clientHeight; // 可见区域高度
  if (scrollTop + clientHeight >= scrollHeight - 10) loadArticles();
};
    //点击跳转
    const goToArticle = (articleId) => {
      router.push({ name: 'ArticleDetail', params: { articleId } });
};
onMounted(() => {
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
  margin-top: 10px;
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
</style>
  