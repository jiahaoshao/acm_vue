<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="resetForm"
        ref="resetFormRef"
        :rules="resetFormRules"
        label-width="0px"
        class="reset-password-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="resetForm.username"
            prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 邮箱地址 -->
        <el-form-item prop="email">
          <el-input
            v-model="resetForm.email"
            prefix-icon="Message"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <!-- 发送验证码按钮 -->
        <el-form-item prop="code">
          <el-row :span="24">
            <el-col :span="12">
              <el-input
                v-model="resetForm.code"
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

        <!-- 新密码输入 -->
        <el-form-item prop="newPassword">
          <el-input
            v-model="resetForm.newPassword"
            prefix-icon="Lock"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <!-- 确认密码输入 -->
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="resetForm.confirmPassword"
            prefix-icon="Lock"
            type="password"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="onSubmit">确认重置密码</el-button>
        </el-form-item>
        <div class="go-login">
          <router-link to="/login">去登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import JSEncrypt from "jsencrypt/bin/jsencrypt";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { encryptedPwd, getKey } from "@/utils/encrypt";

const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $message = ElMessage
const $api = globalProperties.$api
const router = useRouter();
const store = useStore();
const resetFormRef = ref(null);
const resetForm = reactive({
  username: "admin",
  email: "2370145097@qq.com",
  code: "",
  newPassword: "1234567",
  confirmPassword: "1234567",
});
const isCodeSent = ref(false);
const emailCode = ref("");
const publicKey = ref("");
const checkPasswordMatch = (rule, value, callback) => {
  if (value !== resetForm.newPassword) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const resetFormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      message: "请输入有效的邮箱地址",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      min: 6,
      max: 15,
      message: "密码长度在 6 到 15 个字符之间",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { validator: checkPasswordMatch, trigger: "blur" },
  ],
};
const sendEmailCode = async () => {
  if (!resetForm.email || !resetForm.username) {
    $message.error("请填写用户名和邮箱");
    return;
  }
  try {
    const response = await $api.signApi.getEmailVerifyCode({
      email: resetForm.email,
    });
    if (response.data.code === 0) {
      $message.success("验证码已发送，请查收邮箱");
      isCodeSent.value = true;
      emailCode.value = response.data.data;
      console.log(emailCode.value)
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
const onSubmit = async () => {
  if (!resetFormRef.value) return;
  resetFormRef.value.validate(async (valid) => {
    if (!valid) return;
    if (resetForm.code != emailCode.value) {
      $message.error("验证码错误！");
      return;
    }
    try {
      const res = await $api.signApi.resetPassword({
        userAccount: resetForm.username,
        email: resetForm.email,
        password: encryptedPwd(resetForm.newPassword),
      });
      if (res.data.code === 0) {
        $message.success(res.data.message);
        router.push("/login");
      } else {
        $message.error(res.data.message);
      }
    } catch (error) {
      $message.error("密码重置失败，请重试");
    }
  });
};
onMounted(() => {
  getKey();
});
</script>
  
  <style lang="less" scoped>
.reset-password-container {
  background-color: #2b4b6b;
  height: 100%;
}

.reset-password-box {
  width: 450px;
  height: 600px; /* 增加高度，适应更多表单项 */
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
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

.avatar-box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.reset-password-form {
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
.go-login {
  margin-top: 10px;
  text-align: right;
}
.go-login a {
  color: #409eff;
  text-decoration: none;
}

.go-login a:hover {
  text-decoration: underline;
}
</style>
  