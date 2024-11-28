<template>
  <div>
    <div v-for="article in articles" :key="article.id" class="article">
      <h3>{{ article.title }}</h3>
      <p>{{ article.content }}</p>
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
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
    {title:'文章1',content:'内容1'},
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
/* 样式 */

</style>
  