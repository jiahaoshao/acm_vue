<template>
  <div class="article-container">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-content">{{ article.content }}</p>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!hasMore" class="no-more">没有更多文章了</div>
  </div>
</template>
  
<script setup>
import { onMounted, reactive, ref,getCurrentInstance } from 'vue';
import { useStore } from 'vuex'
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api
const articles = ref([
]); 
    const page = ref(1); // 当前页数
    const limit = ref(10); // 每页文章数量
    const hasMore = ref(true); // 是否还有更多数据
    const loading = ref(false); // 加载状态
    // 加载文章
    const loadArticles = async () => {
      if (loading.value || !hasMore.value) return; 
      loading.value = true;
      try {
        const res=await $api.articleApi.getArticle(page.value,limit.value)
        const data=res.data
        articles.value.push(...data.data)
        hasMore.value=data.hasMore
      } catch (err) {
        console.error('加载失败', err);
      } finally {
        loading.value = false; 
      }
    };
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight; // 文档的总高度
      const scrollTop = document.documentElement.scrollTop; // 滚动的高度
      const clientHeight = document.documentElement.clientHeight; // 可见区域高度
      if (scrollTop + clientHeight >= scrollHeight - 10) 
        loadArticles(); 
    };


onMounted(() => {
  loadArticles(); 
  window.addEventListener('scroll', handleScroll);
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
  