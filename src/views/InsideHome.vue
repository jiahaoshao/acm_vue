<template>
  <div>
    <!-- 页面内容 -->
    <h1>用户名为：{{username}}</h1>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex'


const store = useStore();
// 从 localStorage 获取 user 对象 
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 
const user = storedUser ? JSON.parse(storedUser) : null; 
// 获取 user 对象中的 username 属性 
const username = ref(user ? user.username : '');

</script>
  
<style scoped>
/* 样式 */
</style>
  