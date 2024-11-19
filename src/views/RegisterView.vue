<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="registerForm"
        ref="registerFormRef"
        :rules="registerFormRules"
        label-width="0px"
        class="register_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            prefix-icon="PhoneFilled"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            prefix-icon="Message"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            prefix-icon="Lock"
            type="password"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :span="24">
            <el-col :span="12">
              <el-input
                v-model="registerForm.code"
                auto-complete="off"
                placeholder="请输入邮箱验证码"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-button
                :disabled="isCodeSent"
                type="primary"
                @click="sendEmailCode"
              >
                {{ isCodeSent ? "已发送" : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="SignUp">注册</el-button>
          <el-button type="info" @click="toLogin">已有账号？登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

  <script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { encryptedPwd, getKey } from "@/utils/encrypt";

const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $message = ElMessage
const $api = globalProperties.$api
const router = useRouter();
const registerFormRef = ref(null);
const registerForm = reactive({
  username: "admin",
  phone: "15727931358",
  email: "2370145097@qq.com",
  password: "123456",
  confirmPassword: "123456",
  code: "1",
});

const checkPasswordMatch = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerFormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入有效的手机号码",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      message: "请输入有效的邮箱地址",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: checkPasswordMatch, trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const publicKey = ref("");
const isCodeSent = ref(false);
const emailCode = ref("");
const sendEmailCode = async () => {
  if (!registerForm.email) {
    $message.error("请输入邮箱地址");
    return;
  }
  try {
    const response = await $api.signApi.getEmailVerifyCode({
      email: registerForm.email,
    });
    if (response.data.code === 0) {
      $message.success("验证码已发送，请查收邮箱");
      isCodeSent.value = true;
      emailCode.value = response.data.data;
      console.log(emailCode.value);
      setTimeout(() => {
        isCodeSent.value = false;
      }, 60000);
    } else {
      $message.error(response.data.message);
    }
  } catch (error) {
    console.error("Error: ", error);
    $message.error("发送验证码失败，请重试");
  }
};

const SignUp = async () => {
  if (!registerFormRef.value) return;
  registerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    if (registerForm.code != emailCode.value) {
      $message.error("验证码错误！");
      return;
    }

    const res = await $api.signApi.signup({
      userAccount: registerForm.username,
      password: encryptedPwd(registerForm.password),
      email: registerForm.email,
      phone: registerForm.phone,
    });
    if (res.data.code === 0) {
      $message.success(res.data.message);
      router.push({
        path: 'login',
        query: {
          username: registerForm.username,
          password: encryptedPwd(registerForm.password)
        }
      })
    } else {
      $message.error(res.data.message);
    }
  });
};
const toLogin = () => {
  router.push('/login');
}

onMounted(() => {
  getKey();
});
</script>
  <style lang="less" scoped>
.register_container {
  background-color: #2b4b6b;
  height: 100%;
}

.register_box {
  width: 450px;
  height: 600px; /* 增加高度，适应更多表单项 */
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.register_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
  
    
   