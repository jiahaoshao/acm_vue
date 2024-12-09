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

  <!-- 上传组件和提示信息 -->
  
  <el-upload drag :show-file-list="false" :limit="1" action="#" :auto-upload="false" accept=".png"
               :on-change="handleChanges">
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text" >
        <em> 点击 </em> 或<em> 拖动文件 </em>上传来修改头像
      </div>
      <template #tip>
        <div class="el-upload__tip">
          仅支持 jpg/png 格式文件大小小于 2MB
        </div>
      </template>
    </el-upload>
</template>
  
<script setup>
import router from '@/router';
import { ElLoading, ElMessage } from 'element-plus';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex'

const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const api = globalProperties.$api
const store = useStore();
// 从 localStorage 获取 user 对象 
const storedUser = localStorage.getItem('user'); 
// 解析存储的 user 对象 

function changeInfo()
{
  router.push('/home/changeInfo')
}
function changePassword()
{
  router.push('/home/changePassword')
}

const user = ref({});

// 生命周期钩子，初始化时获取用户信息
onMounted(() => {
  //gain();
  user.value = JSON.parse(localStorage.getItem("user"));
});


//上传头像
const handleChanges = (file) => {
    // 启动加载动画
    const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在上传图片...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  if (file.raw.type !== 'image/png') {//限制文件类型
    ElMessage.error({message: "只能上传png格式的文件", grouping: true, showClose: true});
    return false;
  }
  if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大于 5MB!')
    return false;
  }
  const param = new FormData();
  param.append('file', file.raw);
  api.userApi.updateavatar({
    file: file.raw,
    uid: user.value.uid
  }).then((res) => {
    console.log(res)
    if(res.status === 200){
      if(res.data.code == 0) {
        ElMessage.success('上传成功')
        user.value = res.data.data;
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      else {
        ElMessage.error('上传失败')
      }
    }
  })
  loadingInstance.close();
};

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
  