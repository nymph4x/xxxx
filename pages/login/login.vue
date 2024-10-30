<template>
  <view class="container">
    <image src="/static/logo.jpg" class="logo" />
    <text class="title">你的考研伴侣</text>

    <view class="form">
      <input v-model="form.account" placeholder="学号" />
      <input v-model="form.password" type="password" placeholder="密码" />

      <text class="link" @click="goToRegister">没有账号？点击注册</text>
      <button class="login-button" @click="login">上 岸</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        account: '',
        password: ''
      }
    };
  },
  methods: {
    goToRegister() {
      uni.navigateTo({ url: '/pages/register/register' });
    },
    async login() {
          try {
            const res = await uniCloud.callFunction({
              name: 'userLogin',
              data: { account: this.form.account, password: this.form.password }
            });
            
            if (res.result.success) {
              // 将 user_id 存储到本地
              const userId = res.result.data.user_id;
              uni.setStorageSync('user_id', userId);
			  console.log("Stored user_id:", uni.getStorageSync('user_id')); // 输出 user_id
              
              uni.showToast({ title: '登录成功', icon: 'success' });
			  uni.navigateTo({ url: '/pages/leaderboard/leaderboard' });//自己测试
              //uni.switchTab({ url: '/pages/home/home' });
            } else {
              uni.showToast({ title: res.result.message || '登录失败', icon: 'none' });
            }
          } catch (error) {
            console.error("Login error:", error);
            uni.showToast({ title: '登录失败', icon: 'none' });
          }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}
.title {
  font-size: 24px;
  margin-bottom: 20px;
}
.form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.link {
  color: #007aff;
  font-size: 14px;
  margin-top: 10px;
  text-align: right;
}
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #E63946;
  color: white;
  text-align: center;
  border-radius: 5px;
}
</style>
