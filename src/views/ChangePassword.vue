<template>
     <div class="confirm-old-password-page">
        <h1 class="modify-password-title">修改密码</h1>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="当前密码" prop="currentPassword">
        <el-input v-model="form.currentPassword" type="password" placeholder="请输入当前密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </el-form-item>
    </el-form>
     </div>
</template>
<script setup>
import router from '@/router';
import store from '@/store';
import { ElMessage } from 'element-plus';
import { onMounted, reactive,ref,getCurrentInstance } from 'vue';
import { encryptedPwd,getKey } from '@/utils/encrypt';
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 
const user = reactive( storedUser ? JSON.parse(storedUser) : null); 
    const form = reactive({
        currentPassword:''
    })
    const rules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ]
};
    const formRef=ref()
    function handleSubmit()
    {
        formRef.value.validate((valid)=>{
            if(valid){
                 change()
            }
            else{
                ElMessage.error("验证失败")
            }
        })
    }
    const change=async()=>{
       const response=await $api.signApi.signin({
      userAccount: user.username,
      password: encryptedPwd(form.currentPassword)
    });
        try {
            if(response.data.code===200){
                router.push('/home/confirmPassword')
            }
            else{
                ElMessage.error(response.data.msg)
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