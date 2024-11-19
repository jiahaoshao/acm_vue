<template>
    <!-- 上传组件和提示信息 -->
    <el-upload drag :show-file-list="false" :limit="1" action="#" :auto-upload="false" accept=".png"
               :on-change="handleChanges">
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text" >
        <em> 点击 </em> 或<em> 拖动文件 </em>上传
      </div>
      <template #tip>
        <div class="el-upload__tip">
          仅支持 jpg/png 格式文件大小小于 2MB
        </div>
      </template>
    </el-upload>
    <div class="blog">
        <div class="gain">
            <img :src = "images" class="showavatar">
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, getCurrentInstance, onMounted } from "vue";

const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const api = globalProperties.$api

// 响应式引用，用于存储用户信息

const user = ref({});
const images = ref("");

// 生命周期钩子，初始化时获取用户信息
onMounted(() => {
  //gain();
  user.value = JSON.parse(localStorage.getItem("user"));
  images.value = "http://26.201.192.85:8181/" + user.value.avatar;
  console.log(images.value)
});

// 处理文件变化，上传文件并更新用户信息

//上传头像
const handleChanges = (file) => {
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
  api.userApi.uploadavatar({
    file: file.raw,
    uid: user.value.uid
  }).then((res) => {
    console.log(res)
    console.log(user.value);
    if(res.data.code == 0){
      ElMessage.success(res.data.message)
      api.userApi.updateuser({
        uid: user.value.uid
      })
      .then( (res) => {
        // console.log(res)
        if(res.data.code == 0){
          ElMessage.success(res.data.message)
          localStorage.setItem("user", JSON.stringify(res.data.data))
          user.value = JSON.parse(localStorage.getItem("user"));
          images.value = "http://26.201.192.85:8181/" + user.value.avatar;
          console.log(user.value)
        }
        else {
          ElMessage.error(res.data.message)
        }
      })

    } else {
      ElMessage.error(res.data.message)
    }
  })
};

</script>

<style scoped>
:deep(.el-descriptions__label) {
  min-width: 60px !important;
}

.showavatar {
  border: 1px dashed #f50505;
  border-radius: 50%;
  width: 160px;
  height: 160px;

  background-size: 60px;
}

</style>
