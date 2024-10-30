<template>
  <view class="container">
      <!-- 背景图片 -->
      <view class="background">
		  <image src="/static/bghxy.jpg" style="width:100%; height:100%;" mode="aspectFill" />
	  </view>

	 <!-- 排行榜 -->
    <view class="leaderboard">
      <view class="user" v-for="user in users" :key="user.user_id">
        <view class="avatar">
          <image :src="user.avatarUrl" mode="aspectFill" />
        </view>
        <view class="username">{{ user.nickname }}</view>
		<!-- 中间：福币数和福币logo -->
		<view class="fub-info">
		    <image src="/static/fub-logo.webp" class="fub-logo" />
		    <text class="fub-amount">{{ user.score }} 福币</text>
		</view>

		<view class="rank">{{ user.rank }}</view>
      </view>
    </view>


    <view class="current-user" @click="goToMyFub">
      <view class="avatar">
        <image :src="currentUser.avatarUrl" mode="aspectFill" />
      </view>
      <view class="username">{{ '我' }}</view>
	  <view class="fub-info">
	      <image src="/static/fub-logo.webp" class="fub-logo" />
	      <text class="fub-amount">{{ currentUser.score || 0 }} 福币</text>
	  </view>
	  <view class="rank">{{ currentUser.rank || '-' }}</view>
    </view>

  </view>
</template>


<script>
export default {
  data() {
    return {
      users: [], // 排行榜用户数据
      currentUser: {} // 当前用户信息
    };
  },
  async created() {
    await this.fetchLeaderboardData(); // 获取排行榜数据
  },
  methods: {
    async fetchLeaderboardData() {
      try {
        const userId = uni.getStorageSync('user_id'); // 获取当前用户的 user_id
		console.log("Retrieved user_id:", userId); // 调试输出 user_id

        // 调用云函数获取排行榜数据和当前用户排名
        const response = await uniCloud.callFunction({
          name: 'getLeaderboard',
          data: { user_id: userId }
        });

        if (response.result && response.result.code === 0) {
          this.users = response.result.data.users;
          this.currentUser = response.result.data.currentUser || {};
        } else {
          console.error('Failed to fetch leaderboard data:', response.result.msg);
        }
      } catch (error) {
        uni.showToast({ title: '获取排行榜失败', icon: 'none' });
        console.error(error);
      }
    },
	goToMyFub() {
	    const userId = uni.getStorageSync('user_id'); // 获取当前用户的 user_id
	    uni.navigateTo({
	      url: `/pages/myFub/myFub?user_id=${userId}`
	});
  }
}
};
</script>


<style>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

/* 背景图片 */
.background image{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35%; /* 背景图片覆盖顶部35%区域 */
  z-index: -1;
}

/* 排行榜 */
.leaderboard {
  position: relative;
    width: 90%;
    margin-top: 35%; /* 排行榜紧跟在背景图片下方 */
    padding: 15px 10px;
	background-color: #fff;
}

/* 每个用户条目 */
.user, .current-user {
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  background-color: #fff; /* 设置白色背景色以和阴影形成对比 */
  margin-bottom: 5px; /* 每个条目之间增加间距 */
}

.user:last-child, .current-user:last-child {
  border-bottom: none;
}


.avatar image{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 16px;
  color: #333;
}

/* 中间：福币数和福币logo */
.fub-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.fub-logo {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

.fub-amount {
  font-size: 16px;
  color: #d9534f;
}

.score {
  font-size: 16px;
  color: #e74c3c;
  font-weight: bold;
}

.rank {
  font-size: 34px;
  color: #d9363e; /* 排名颜色 */
  font-weight: bold;
  font-style: italic;
}

</style>