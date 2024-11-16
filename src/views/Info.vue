<template>
    <div>
      <!-- 页面内容 -->
      <h1>用户名为：{{ username }}</h1>
      <h1>邮箱为：{{ email }}</h1>
      <h1>手机号为：{{ phone }}</h1>
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
  const email = ref(user ? user.email : '');
  const phone = ref(user ? user.phone : '');
  
  </script>
  
  <style scoped>
  /* 样式 */
  </style>
  