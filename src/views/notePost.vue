<template>
  <div class="create-article">
    <h3>Create Article</h3>
    <form @submit.prevent="createArticle">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="article.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="tags">Tags</label>
        <input type="text" v-model="article.tags" id="tags" />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <mavon-editor v-model="article.content" />
      </div>
      <button type="submit">Publish</button>
    </form>
  </div>
</template>

<script setup>
// 导入 Vue 3 的相关功能和 mavon-editor 组件
import { reactive } from 'vue';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

    // 使用 reactive 来声明响应式数据
    const article = reactive({
      title: '',
      tags: '',
      content: '', // 确保初始值是一个空字符串
    })

    // 定义 createArticle 方法
    const createArticle = async () => {
      try {
        await fetch('/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article),
        });
        alert('Article published successfully!');
      } catch (error) {
        alert('Failed to publish article.');
      }
    };
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
