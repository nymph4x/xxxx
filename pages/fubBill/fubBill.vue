<template>
    <view class="bill-list">
      <view class="bill-item" v-for="(item, index) in transactions" :key="index">
        <view class="description">
          <text>{{ item.description }}</text>
          <text :class="item.amount > 0 ? 'amount positive' : 'amount negative'">
            {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
          </text>
        </view>
        <view class="date">{{ item.date }}</view>
      </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      transactions: [] // 存储福币交易记录
    };
  },
  async created() {
    await this.fetchTransactions(); // 获取交易数据
  },
  methods: {
    async fetchTransactions() {
      try {
        const userId = uni.getStorageSync('user_id'); // 从本地存储获取 user_id
        const response = await uniCloud.callFunction({
          name: 'getUserTransactions',
          data: { user_id: userId }
        });

        if (response.result && response.result.code === 0) {
          this.transactions = response.result.data;
        } else {
          console.error('Failed to fetch transactions:', response.result.msg);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  }
};
</script>

<style>
/* 样式部分 */
.container {
  background-color: #ffffff;
  padding: 20px;
}


.bill-list {
  margin: 20px;
}

.bill-item {
  padding: 15px 0;
  border-bottom: 1px solid #eaeaea;
}

.description {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 520;
  color: #333;
}

.amount {
  font-size: 16px;
}

.amount.positive {
  color: #ff4d4f; /* 红色 */
}

.amount.negative {
  color: #666; /* 灰色 */
}

.date {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}
</style>
