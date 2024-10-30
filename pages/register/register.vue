<template>
  <view class="container">
    <text class="title">即将记录您的考研之旅...</text>
    <image src="/static/logo.jpg" class="logo" />
    <text class="subtitle">福小研</text>
	<text class="subtitle">陪伴你上岸的每一步</text>

    <view class="form">
      <input v-model="form.account" placeholder="学号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <input v-model="form.confirmPassword" type="password" placeholder="再次确认密码" />
      <button class="register-button" @click="register">开始记录...</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        account: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    async register() {
      try {
        const { account, password, confirmPassword } = this.form;
    
        // 检查密码是否一致
        if (password !== confirmPassword) {
          return uni.showToast({ title: '密码不一致', icon: 'none' });
        }
    
        // 调用云函数注册用户
        const callRes = await uniCloud.callFunction({
          name: 'userRegister',
          data: { account, password }
        });
    
        if (callRes.result && callRes.result.success) {
		  
          uni.showToast({ title: '注册成功', icon: 'success' });
          uni.redirectTo({ url: '/pages/profileComplete/profileComplete' });
        } else {
          uni.showToast({ title: callRes.result.message || '注册失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '调用云函数失败', icon: 'none' });
        console.error(error);
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
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  margin-bottom: 10px;
}
.form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.register-button {
  width: 100%;
  padding: 12px;
  background-color: #E63946;
  color: white;
  text-align: center;
  border-radius: 5px;
}
</style>
