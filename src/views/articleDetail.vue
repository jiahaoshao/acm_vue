<template>
  <div class="article-detail">
    <div class="header">
      <h1>{{ article.title }}</h1>
      <h2 class="author-name">by:{{ article.authorName }}</h2>
    </div>
    <p class="content" v-html="parseMarkdown(article.content)"></p>
  </div>
</template>
  
  <script setup>
  import MarkdownIt from "markdown-it";
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
  const md = new MarkdownIt();
  const parseMarkdown = (content) => { 
  return md.render(content); 
};
  async function fetchArticle(articleId){
      try{
        const res=await $api.articleApi.getArticleById(articleId)
        if(res.data.code===0){
          const Ares=await $api.articleApi.getAuthorInfo(res.data.data.authorId)
          article.value=res.data.data
          article.value.authorName=Ares.data.data.username
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
       fetchArticle(articleId);
  });
  </script>
  
  <style scoped>
  .article-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: 'Arial', sans-serif;
}

.article-detail .header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
}

.article-detail h1 {
  font-size: 2.5em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.article-detail h2.author-name {
  font-size: 1em;
  color: #7f8c8d;
  font-weight: normal;
  margin: 0;
}

.article-detail p.content {
  font-size: 1.2em;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .article-detail {
    padding: 20px;
  }

  .article-detail h1 {
    font-size: 2.2em;
  }

  .article-detail h2.author-name {
    font-size: 0.9em;
  }

  .article-detail p.content {
    font-size: 1em;
  }
}
  </style>
  