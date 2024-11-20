<template>
  <div class="user-profile" v-if="isLogin">
    <div class="user-info" >
        <h2>{{ user.username }}</h2>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex'


const isLogin = ref(false)
const store = useStore();
// 从 localStorage 获取 user 对象 
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 
const user =reactive( storedUser ? JSON.parse(storedUser) : null); 
// 获取 user 对象中的 username 属性 
const username = ref(user ? user.username : '');

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(localStorage.getItem("user"));
    isLogin.value = true;
  }
});


</script>
  
<style scoped>
/* 样式 */
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
  