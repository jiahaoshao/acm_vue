<template>
  <div class="user-info-page">
    <h1>个人信息</h1>
    <!-- 使用 el-form 组件来包装用户信息表单 -->
    <el-form :model="formData" :rules="formRules" ref="userForm">
      <div class="user-profile">
        <div class="user-info">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" type="tel" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveChanges">保存</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 从 localStorage 获取 user 对象并解析
const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : { username: '', email: '', phone: '' };

// 创建响应式变量，绑定表单输入
const formData = ref({
  username: user.username,
  email: user.email,
  phone: user.phone
});

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名长度应在 3 到 10 个字符之间', trigger: ['blur', 'change'] }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: ['blur', 'change'] }
  ]
};

const userForm=ref()
// 保存修改后的信息
const saveChanges = () => {
  // 手动触发表单验证
  userForm.value.validate((valid=>{
    if(valid){
      user.username=formData.value.username
      user.email=formData.value.email
      user.phone=formData.value.phone
      localStorage.setItem('user',JSON.stringify(user))
      ElMessage.success('保存成功')
      router.push('/home/info')
  }
  else{
      ElMessage.error("表单验证失败")
      return false
  }
  }))
};
</script>

<style scoped>
.user-info-page {
  width: 400px;
  margin: 0 auto;
  padding: 30px; /* 增加内边距，给元素更大的呼吸空间 */
  background: linear-gradient(135deg, #f6f8fc, #e9eff9); /* 渐变背景色 */
  border: 1px solid #ddd; /* 边框颜色略浅 */
  border-radius: 15px; /* 增加圆角，使其更柔和 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  font-family: 'Arial', sans-serif; /* 更现代的字体 */
  color: #333; /* 设置字体颜色为深灰色 */
}

.user-info-page h1 {
  text-align: center; /* 标题居中 */
  color: #4a90e2; /* 标题颜色 */
  font-size: 24px; /* 增加字体大小 */
  margin-bottom: 20px; /* 增加标题与内容之间的间距 */
}

.user-info-page .user-info {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 每个输入框之间的间距 */
}

.user-info-page input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px; /* 圆角输入框 */
  outline: none;
  transition: border 0.3s ease; /* 平滑的过渡效果 */
}

.user-info-page input:focus {
  border-color: #4a90e2; /* 输入框获得焦点时的边框颜色 */
}

.user-info-page button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4a90e2; /* 按钮背景色 */
  color: white;
  border: none;
  border-radius: 5px; /* 圆角按钮 */
  cursor: pointer;
  transition: background-color 0.3s ease; /* 按钮的过渡效果 */
}

.user-info-page button:hover {
  background-color: #357ab7; /* 悬停时的按钮背景色 */
}

.user-profile {
  padding: 20px;
}

.user-info p {
  margin: 10px 0;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
