<template>
  <div class="user-profile">
    <div class="user-info">
      <h2>{{ user.username }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <p><strong>Status:</strong> {{ user.status }}</p>
      <p><strong>Uid:</strong> {{ user.uid }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
    </div>
  </div>
  <button @click="changeInfo">修改信息</button>
  <button @click="changePassword">修改密码</button>
</template>
  
<script setup>
import router from '@/router';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex'
const store = useStore();
// 从 localStorage 获取 user 对象 
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 
const user = reactive( storedUser ? JSON.parse(storedUser) : null); 
console.log(user);
console.log(user.id)
function changeInfo()
{
  router.push('/home/changeInfo')
}
function changePassword()
{
  router.push('/home/changePassword')
}
</script>
  
<style scoped>
/* 样式 */
button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
.user-profile {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.user-info h2 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.user-info p {
  font-size: 16px;
  color: #666;
}

.user-info strong {
  color: #333;
}
</style>
  