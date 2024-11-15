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


<script>
/* eslint-disable */
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
// import JSEncrypt from 'jsencrypt/bin/jsencrypt';
import SIdentify from "../components/SIdentify"
import { mapMutations } from 'vuex';

export default {
  name: "login",
  components: { SIdentify },
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
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
      },
      publicKey: '',
      // 定义验证码的字符集
      identifyCodes: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''),
      // 定义生成的验证码
      identifyCode: '',
      showCode: false,
      count: 0,
      enpassword: ''
    }
  },
  mounted () {
    // 初始化验证码
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  created() {
    this.getPublickey();
    this.refreshCode();
  },
  methods: {
    ...mapMutations(['changeLogin']),
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 点击重置按钮，重置登录表单
    resetloginForm () {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录函数
    Signin () {
      const that = this;
      // that.getPublickey();
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; // 表单不合法，不执行登录
        // 表单合法，执行登录请求
        // if (that.loginForm.code !== that.identifyCode) {
        //   that.$message.error("验证码错误！");
        //   return; // 验证码错误，阻止登录请求
        // }

        const crypt = new JSEncrypt();
        crypt.setPublicKey(that.publicKey);
        that.enpassword = crypt.encrypt(that.loginForm.password);
        console.log(that.enpassword);
        // console.log(crypt.encrypt(that.loginForm.password));
        const res = await that.$api.signApi.signin({
          userAccount: that.loginForm.username,
          password: that.enpassword //加密密码
        });
        console.log(res);
        //that.userToken = 'Bearer ' + res.data.data.body.token;  // 将用户token保存到vuex中
        that.changeLogin({ Authorization: that.userToken });
       if (res.data.code === 0) {
          that.count = 0;
          that.$message.success(res.data.message);
          this.$router.push('/home');	   
          that.resetloginForm();
        } else {
          that.$message.error(res.data.message);
          that.count ++;
          if (that.count >= 3) that.showCode = true;
        }
      })
    },
    Signup() {
      this.$router.push("/register")
    },
    Findpsw() {
      this.$router.push("/resetpsw")
    },
    async getPublickey() {
      const that = this;
      try {
	        // 此处为调用后端接口。
	         const response = await that.$api.signApi.getPublicKey();
           console.log(response)
	         if (response.data.code === 0) {
	              that.publicKey = response.data.data;
                     }
	    }
	     catch (error) {
        that.$message.error(error.message);
	    }
    }
  }
}
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
