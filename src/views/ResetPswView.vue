<template>
    <div class="reset-password-container">
      <div class="reset-password-box">
        <!-- 头像区域 -->
        <div class="avatar-box">
          <img src="../assets/logo.png" alt="" />
        </div>
        <!-- 表单区域 -->
        <el-form :model="resetForm" ref="resetFormRef" :rules="resetFormRules" label-width="0px" class="reset-password-form">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="resetForm.username" prefix-icon="User" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <!-- 邮箱地址 -->
          <el-form-item prop="email">
            <el-input v-model="resetForm.email" prefix-icon="Message" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
          <!-- 发送验证码按钮 -->
          <el-form-item prop="code">
            <el-row :span="24">
              <el-col :span="12">
                <el-input v-model="resetForm.code" auto-complete="off" placeholder="请输入邮箱验证码" ></el-input>
              </el-col>
              <el-col :span="12">
                <el-button :disabled="isCodeSent" type="primary" @click="sendEmailCode">
                  {{ isCodeSent ? '已发送' : '发送验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
  
          <!-- 新密码输入 -->
          <el-form-item prop="newPassword">
            <el-input v-model="resetForm.newPassword" prefix-icon="Lock" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <!-- 确认密码输入 -->
          <el-form-item prop="confirmPassword" >
            <el-input v-model="resetForm.confirmPassword" prefix-icon="Lock" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
  
          <!-- 提交按钮 -->
          <el-form-item class="btn">
            <el-button type="primary" @click="onSubmit">确认重置密码</el-button>
          </el-form-item>
          <div class="go-login">
            <router-link to='/login'>去登录</router-link>
          </div>
        </el-form>
      </div>
    </div>
  </template>
  
  <script>
    import JSEncrypt from 'jsencrypt/bin/jsencrypt';
    export default {
      data() {
      return {
        resetForm: {
          username: 'admin',
          email: '2370145097@qq.com',
          code: '',
          newPassword: '1234567',
          confirmPassword: '1234567'
        },
        resetFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: '请输入有效的邮箱地址', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 个字符之间', trigger: 'blur' },
          ],
          confirmPassword: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { validator: this.checkPasswordMatch, trigger: 'blur' },
          ]
        },
        isCodeSent: false,       // 控制发送验证码按钮状态
        emailCode: '',         // 存储从后台获取的验证码
        publicKey: ''
      };
    },
    created() {
      this.getPublickey();
    },
    methods: {
      // 发送验证码请求
      async sendEmailCode() {
        const that = this;
        if (!that.resetForm.email || !that.resetForm.username) {
          that.$message.error("请填写用户名和邮箱");
          return;
        }
        
        try {
          that.$api.signApi.getEmailVerifyCode({
            email: that.resetForm.email
          })
          .then(response => {
            //console.log(response)
            if (response.data.code === 0) {
              that.$message.success("验证码已发送，请查收邮箱");
              that.isCodeSent = true;  // 设置按钮为已发送状态
              that.emailCode = response.data.data;
              console.log(that.emailCode)
              // 启动一个倒计时，避免用户频繁点击发送验证码按钮
              setTimeout(() => {
                that.isCodeSent = false; // 倒计时结束，恢复按钮
              }, 60000); // 1分钟后按钮恢复
            } else {
              that.$message.error(response.data.message);
            }
          })
        } catch (error) {
          console.error("Error: ", error);
          that.$message.error("发送验证码失败，请重试");
        }
      },
      
      // 验证两次密码是否一致
      checkPasswordMatch(rules, value, callback) {
        if (value !== this.resetForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
  
      // 提交表单，重置密码
      onSubmit() {
        const that = this;
        that.$refs.resetFormRef.validate(async (valid) => {
          if (!valid) return;
  
          // 验证验证码是否正确
          if (that.resetForm.code != that.emailCode) {
            that.$message.error("验证码错误！");
            return;
          }

          const crypt = new JSEncrypt();
          crypt.setPublicKey(that.publicKey);
  
          try {
            // 提交新密码的重置请求
            const res = await that.$api.signApi.resetPassword({
              userAccount: that.resetForm.username,
              email: that.resetForm.email,
              password: crypt.encrypt(that.resetForm.newPassword)
            });
  
            if (res.data.code === 0) {
              that.$message.success(res.data.message);
              that.$router.push("/login");
            } else {
              that.$message.error(res.data.message);
            }
          } catch (error) {
            that.$message.error("密码重置失败，请重试");
          }
        });
      },
      getPublickey() {
      const that = this;
      try {
	        // 此处为调用后端接口。
	         that.$api.signApi.getPublicKey()
           .then(response => {
            //console.log(response)
            if (response.data.code === 0) {
	              that.publicKey = response.data.data;
	          }
           })
	    }
	     catch (error) {
        that.$message.error(error.message);
	    }
    },
    }
  };
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
  