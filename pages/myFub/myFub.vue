<template>
  <view class="my-fub">
      <text class="rank">RANK {{ userInfo.rank }}</text>
    <view class="fub-info">
      <image class="fub-logo" src="/static/fub-logo.webp" />
      <text class="fub-title">我的福币</text>
      <view class="fub-balance">
        <text class="fub-currency">FUB</text>
        <text class="fub-amount">{{ userInfo.fub || 0 }}</text>
      </view>
      <text class="fub-note" @click="goToDailyTasks">完成每日任务，可免费得福币 ></text>
    </view>
    <view class="buttons">
      <button class="btn-bill" @click="goToBill">福币账单</button>
      <button :class="['btn-task', { 'completed': dailyTaskCompleted }]" @click="goToDailyTasks">
        {{ dailyTaskCompleted ? '今日任务已完成' : '今日任务未完成' }}
      </button>
    </view>
    <view class="fub-intro">
      <view class="title">什么是福币</view>
      <view class="content">福币是仅限于在福小研交易的货币</view>
      <view class="title">如何使用福币</view>
      <view class="content">1. 福币可用于发布求助；</view>
	  <view class="content">2. 福币可用于兑换考研相关实体书。</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}, // 用户福币信息和排名
      dailyTaskCompleted: false // 假设每日任务状态
    };
  },
  async created() {
    const userId = uni.getStorageSync('user_id'); // 从本地获取当前用户ID
    await this.fetchUserFubInfo(userId); // 获取福币信息和任务状态
  },
  methods: {
    async fetchUserFubInfo(userId) {
      try {
        const response = await uniCloud.callFunction({
          name: 'getUserFubInfo',
          data: { user_id: userId }
        });

        if (response.result && response.result.code === 0) {
          this.userInfo = response.result.data;
          this.dailyTaskCompleted = response.result.data.dailyTaskCompleted; // 设置每日任务状态
        } else {
          console.error('Failed to fetch FUB info:', response.result.msg);
        }
      } catch (error) {
        console.error('Error fetching FUB info:', error);
      }
    },
    goBack() {
      uni.navigateBack();
    },
    goToBill() {
      uni.navigateTo({ url: '/pages/fubBill/fubBill' });
    },
	goToDailyTasks() {
	  uni.navigateTo({ url: '/pages/dailyTasks/dailyTasks' }); // 跳转到每日任务页面
	}
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
}

.rank {
  font-size: 14px;
  color: #e57373;
  font-weight: bold;
  position: absolute;
  right: 20px; /* 将排名固定到右边 */
  top: 10px;
}

.fub-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.fub-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.fub-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
}

.fub-balance {
  display: flex;
  align-items: baseline;
  font-weight: bold;
  margin-top: 5px;
}

.fub-currency {
  font-size: 16px;
  color: #333;
  margin-right: 5px;
}

.fub-amount {
  font-size: 36px;
  color: #333;
}

.fub-note {
  font-size: 16px;
  color: #e57373;
  margin-top: 5px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}

.btn-bill, .btn-task {
  width: 150px; /* 控制按钮宽度 */
  height: 40px; /* 控制按钮高度 */
  border-radius: 20px; /* 圆角效果 */
  font-size: 16px; /* 调整字体大小 */
  font-weight: bold;
  text-align: center;
  line-height: 40px; /* 垂直居中 */
}

.btn-bill {
  background-color: #e57373;
  color: #fff;
}

.btn-task {
  background-color: #e0e0e0;
  color: #666;
}

.btn-task.completed {
  background-color: #87d068;
  color: #fff;
}

.fub-intro {
  position: fixed;
    bottom: 40px;
    left: 0;
    width: 100%;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 10px 10px 0 0; /* 使顶部圆角 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.fub-intro .title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
}

.fub-intro .content {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  line-height: 1.5;
}

</style>
