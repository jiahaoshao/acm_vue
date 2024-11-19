<template>
    <div class="confirm-password-page">
    <h1 class="modify-password-title">修改密码</h1>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
  </template>
<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive,ref,getCurrentInstance } from 'vue';
import { encryptedPwd,getKey } from '@/utils/encrypt';
import router from '@/router';
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 
const user =reactive( storedUser ? JSON.parse(storedUser) : null); 
const validateConfirmPassword=(rule,value,callback)=>{
    if(value===form.newPassword)
{
    callback()
}
else
{
    callback(new Error('请保证两次输入一致'))
}
}
    const form=reactive({
        newPassword:'',
        confirmPassword:''
    })
    const rules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度应在 6 到 15 个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};
    async function handleSubmit()
    {
        try {
            const response=await $api.signApi.resetPassword({
        userAccount:user.username,
        email: user.email,
        password: encryptedPwd(form.newPassword),
      });
        if(response.data.code===0)
      {
        ElMessage.success(response.data.message)
        router.push('/home/info')
      }
      else{
        ElMessage.error(response.data.message)
      }
        } catch (error) {
            ElMessage.error("修改失败")
        }
    }
    onMounted(() => {
  getKey();
});
</script>
<style>
.modify-password-title {
  font-size: 2.0rem;             /* 增加字体大小，使其更醒目 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 使用现代字体 */
  font-weight: 700;              /* 更加加粗，突出标题 */
  color: #000000;                /* 使用绿色，传达积极的感觉 */
  text-align: center;            /* 居中对齐 */
  margin-top: 50px;              /* 顶部间距，避免紧凑 */
  margin-bottom: 30px;           /* 底部间距，避免拥挤 */
  line-height: 1.4;              /* 合适的行高 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 添加文字阴影，增强立体感 */
  transition: all 0.3s ease-in-out; /* 添加过渡效果 */
}
</style>