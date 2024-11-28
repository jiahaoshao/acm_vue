<template>
    <div class="article-detail">
      <h1>{{article.title}}</h1>
      <p>{{ article.content }}</p>
    </div>
  </template>
  
  <script setup>
  import { ElMessage } from 'element-plus';
  import { ref, onMounted,getCurrentInstance } from 'vue';
  import { useRoute } from 'vue-router';
  const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
  const $api = globalProperties.$api
  const route = useRoute();
  const article = ref({
    title:'',
    content:''
  });
  async function fetchArticle(articleId){
      try{
        const res=await $api.articleApi.getArticleById(articleId)
        if(res.data.code===0){
            article.value=res.data
        }
        else{
            ElMessage.error("获取失败")
        }
      }catch(error){
         ElMessage.error("获取失败")
      }
}
onMounted(() => {
       const articleId = route.params.articleId;
    //    fetchArticle(articleId);
  });
  </script>
  
  <style scoped>
    .article-detail {
  max-width: 800px; /* 最大宽度，确保内容不拉得太长 */
  margin: 20px auto; /* 中心对齐 */
  padding: 20px;
  background-color: #fff; /* 背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
  color: #333; /* 文字颜色 */
}

.article-detail h1 {
  font-size: 2.5em; /* 标题字号 */
  font-weight: bold;
  margin-bottom: 20px; /* 标题底部间距 */
  color: #2c3e50; /* 标题颜色 */
  line-height: 1.4;
}

.article-detail p {
  font-size: 1.2em; /* 内容字号 */
  line-height: 1.8; /* 行高，增强可读性 */
  color: #555; /* 内容颜色 */
  white-space: pre-wrap; /* 保持格式 */
  word-wrap: break-word; /* 防止内容过长溢出 */
}

@media (max-width: 600px) {
  .article-detail {
    padding: 15px;
  }

  .article-detail h1 {
    font-size: 2em;
  }

  .article-detail p {
    font-size: 1em;
  }
}
  </style>
  