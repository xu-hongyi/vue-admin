<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="http://98c.top/img/33.jpg" alt="" />
      </div>
      <el-form
        class="login_form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="_login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '../api/login'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度必须在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    _login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        try {
          const data = await login(this.loginForm)
          window.sessionStorage.setItem('token', data.token)
          this.$router.push('/home')
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      img {
        background: #eee;
        border-radius: 50%;
        border: 1px solid #ddd;
        height: 100%;
        width: 100%;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
