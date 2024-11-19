<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username"
          ><!-- 用户名 -->
          <el-input v-model="loginForm.username"
          type="text"
          prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password"
          ><!-- 密码 -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="showCode">
            <el-row :span="24">
              <el-col :span="12">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" size=""></el-input>
              </el-col>
              <el-col :span="12">
                <div class="login-code" @click="refreshCode">
                  <!--验证码组件-->
                  <s-identify :identifyCode="identifyCode"></s-identify>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        <el-form-item class="btn"
          ><!-- 按钮区域 -->
          <el-button type="primary" @click="Signin">登录</el-button>
          <el-button type="info" @click="Signup">注册</el-button>
        </el-form-item>
        <div class="forgot-password">
          <router-link to="/resetpsw">忘记密码？</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import SIdentify from "../components/SIdentify";
import { useRouter, useRoute } from 'vue-router';
import { encryptedPwd, decryptedPwd, getKey } from '@/utils/encrypt';
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus';

// 引入 store 和 router
const router = useRouter();
const route = useRoute();
const store = useStore();
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api

// 表单引用 
const loginFormRef = ref(null);

// 登录表单的数据绑定对象
const loginForm = reactive({
  username: 'admin',
  password: '123456'
});

// 表单验证规则对象
const loginFormRules = {
  username: [
    { required: true, message: '请输入登录名', trigger: 'blur' },
    {
      min: 3,
      max: 10,
      message: '长度在 3 到 10 个字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: '长度在 6 到 15 个字符',
      trigger: 'blur'
    }
  ]
};

const publicKey = ref('');
const identifyCodes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
const identifyCode = ref('');
const showCode = ref(false);
const count = ref(0);

// 初始化验证码
const refreshCode = () => {
  identifyCode.value = '';
  makeCode(identifyCodes, 4);
};

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += o[randomNum(0, o.length)];
  }
};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};



const Signin = async () => {
  // 表单验证（简化示例）
  if (!loginForm.username || !loginForm.password) {
    ElMessage.error('请填写完整的登录信息');
    return;
  }

  if((loginForm.code !== identifyCode.value) && showCode.value){
    refreshCode();
    ElMessage.error('验证码错误!');
    return;
  }

  try {
    const response = await $api.signApi.signin({
      userAccount: loginForm.username,
      password: encryptedPwd(loginForm.password)
    });
     console.log(response);
  
    if (response.data.code === 200) {
      count.value = 0;
      showCode.value = false;
      store.commit('setToken',response.data.token)
      store.commit('setUser',response.data.user)
      ElMessage.success(response.data.message);
      router.push('/home')
      
    } else {
      ElMessage.error(response.data.message);
      count.value++;
      if (count.value >= 3) showCode.value = true;
      refreshCode();
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('登录失败');
  }
};

const Signup = () => {
  router.push("/register");
};

onMounted(() => {
  getKey();
  // 自动填写用户名和密码
  loginForm.username = route.query.username || loginForm.username;
  loginForm.password = decryptedPwd(route.query.password) || loginForm.password;
});
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; // 圆角效果
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #eee; // 加个灰色边框
  border-radius: 50%; // div组件变成圆形
  padding: 10px; // 图片和边框之间有10px间隙
  box-shadow: 0 0 10px #ddd; // 添加一个阴影，向外扩散10像素
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%; // 图片变成圆形
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0px; // 靠下
  width: 100%;
  padding: 0 20px; // 上下内边距0，左右内边距20px
  box-sizing: border-box;
}

.btn {
  display: flex; // flex布局
  justify-content: flex-end; // 按钮右对齐
}

.forgot-password {
  margin-top: 10px;
  text-align: right;
  
}
.forgot-password a {
  color: #409eff;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
