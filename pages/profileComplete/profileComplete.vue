<template>
  <view class="container">
    <text class="title">小研想更好地伴你考研</text>
    <text class="subtitle">填写考研信息让小研认识你吧！(๑•̀ㅂ•́)و✧</text>
    
    <view class="form">
      <view class="avatar-section">
        <image v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar"/>
        <view v-else class="avatar-placeholder"/>
        <text @click="uploadAvatar" class="upload-text">上传头像</text>
      </view>
	  
	  <view class="gender-selection">
	    <label>
	        <input type="radio" value="female" v-model="form.gender" /> 女生
	    </label>
	    <label>
			<input type="radio" value="male" v-model="form.gender" /> 男生
	    </label>
	    </view>
      
      <view class="input-group">
        <input v-model="form.nickname" placeholder="请填写昵称" class="input-field"/>
        <input v-model="form.year" placeholder="请填写考研年份" class="input-field"/>
        <input v-model="form.major" placeholder="请填写报考专业" class="input-field"/>
        <input v-model="form.school" placeholder="请填写目标院校" class="input-field"/>
      </view>

      
      <button @click="completeProfile" class="complete-button">正式上岸！</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        avatarUrl: '',
        nickname: '',
        year: '',
        major: '',
        school: '',
        gender: ''
      }
    };
  },
  methods: {
    async uploadAvatar() {
      try {
        const { tempFilePaths } = await uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        });
    
        if (!tempFilePaths.length) {
          throw new Error('未选择图片');
        }
    
        const filePath = tempFilePaths[0];
        const cloudPath = `avatars/${Date.now()}-${filePath.split('/').pop()}`;
    
        const uploadRes = await uniCloud.uploadFile({
          cloudPath,
          filePath
        });
    
        if (!uploadRes.fileID) {
          throw new Error('文件上传失败，未获取到 fileID');
        }
    
        // 假设这里之前使用了 res，但实际上应该使用 uploadRes
        this.form.avatarUrl = uploadRes.fileID;
      } catch (error) {
        console.error('上传头像错误:', error);
        uni.showToast({
          title: error.message || '上传失败，请重试',
          icon: 'none'
        });
      }
    },
    async completeProfile() {
      try {
        const { result } = await uniCloud.callFunction({
          name: 'completeProfile',
          data: this.form
        });
        if (result.success) {
          uni.showToast({ title: '资料完善成功', icon: 'success' });
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/home/home' });
          }, 1500);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '提交失败，请稍后再试',
          icon: 'none'
        });
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
  height: 100%;
  background-color: #fff;
}
.title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
}
.subtitle {
  font-size: 14px;
  color:  #ff4757;
  margin-bottom: 20px;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  height: auto; /* 调整高度为自动，以容纳下方文字 */
  margin-bottom: 20px;
}

.avatar, .avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ccc;
}

.avatar {
  object-fit: cover;
}

.upload-text {
  margin-top: 5px; /* 添加一些顶部空间 */
  color: #007aff;
  font-size: 12px;
  cursor: pointer;
}

.input-group {
  width: 90%;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.gender-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.gender-selection label {
  margin: 0 10px;
  font-size: 14px;
  color: #333;
}
.complete-button {
  width: 90%;
  padding: 10px;
  background-color: #ff4757;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 10px;
}
</style>
