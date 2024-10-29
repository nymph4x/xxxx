<template>
  <view class="container">
    <view class="header">
      <text class="title">福币排行榜</text>
    </view>

    <view class="leaderboard">
      <view class="user" v-for="user in users" :key="user.user_id">
        <view class="rank">{{ user.rank }}</view>
        <view class="avatar">
          <image :src="user.avatarUrl" mode="aspectFill" />
        </view>
        <view class="username">{{ user.nickname }}</view>
        <view class="score">{{ user.score }} 福币</view>
      </view>
    </view>


    <view class="current-user">
      <view class="rank">{{ currentUser.rank }}</view>
      <view class="avatar">
        <image :src="currentUser.avatarUrl" mode="aspectFill" />
      </view>
      <view class="username">{{ currentUser.nickname }}</view>
      <view class="score">{{ currentUser.score }} 福币</view>
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
    }
  }
};
</script>


<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.header {
  text-align: center;
  padding: 20px 0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #d9534f;
}

.leaderboard, .current-user {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  padding: 15px;
}

.user, .current-user {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

.user:last-child, .current-user {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  font-size: 18px;
  color: #d9534f;
  margin-right: 10px;
  width: 30px;
  text-align: center;
}

.avatar image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  flex: 1;
  font-size: 16px;
}

.score {
  font-size: 16px;
  color: #d9534f;
}
</style>