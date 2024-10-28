<template>
  <view class="container">
    <image src="/static/logo.jpg" class="logo" />
    <text class="title">福小研</text>
    <text class="subtitle">is all you Need!</text>
  </view>
</template>

<script>
export default {
  onLoad() {
     const url = '/pages/login/login';
      console.log("跳转路径:", url);
      setTimeout(() => {
        uni.redirectTo({
          url
        });
      }, 2000);
     // 停留 2 秒后跳转
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: white;
}
.logo {
  width: 150px;
  height: 150px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #E63946;
  margin-top: 20px;
}
.subtitle {
  font-size: 18px;
  color: #E63946;
}
</style>
