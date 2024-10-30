<template>
    <view class="task-list">
      <view class="task-item" v-for="(task, index) in tasks" 
	  :key="task._id" :class="task.completed ? 'completed' : 'incomplete'" @click="toggleTaskStatus(task)">
        <view class="task-number">{{ index + 1 }}.</view>
        <view class="task-details">
          <text class="task-name">{{ task.name }}</text>
          <view class="task-reward">
            <image src="/static/fub-logo.webp" class="reward-icon" />
            <text>x{{ task.reward }}</text>
          </view>
        </view>
        <view class="task-status" :class="task.completed ? 'completed' : 'incomplete'">
          <text>{{ task.completed ? '已完成' : '未完成' }}</text>
        </view>
      </view>
    </view>
</template>


<script>
export default {
  data() {
    return {
      tasks: [] // 每日任务列表
    };
  },
  async created() {
    const userId = uni.getStorageSync('user_id'); // 获取当前用户ID

    // 初始化每日任务
    await this.initializeDailyTasks(userId);
    // 获取每日任务列表
    await this.fetchDailyTasks(userId);
  },
  methods: {
    async initializeDailyTasks(userId) {
      try {
        const response = await uniCloud.callFunction({
          name: 'initializeDailyTasks',
          data: { user_id: userId }
        });

        if (response.result && response.result.code === 0) {
          console.log("每日任务初始化成功");
        } else {
          console.error('每日任务初始化失败:', response.result.msg);
        }
      } catch (error) {
        console.error('Error initializing daily tasks:', error);
      }
    },
    async fetchDailyTasks(userId) {
      try {
        const response = await uniCloud.callFunction({
          name: 'getDailyTasks',
          data: { user_id: userId }
        });

        if (response.result && response.result.code === 0) {
          this.tasks = response.result.data;
        } else {
          console.error('获取每日任务失败:', response.result.msg);
        }
      } catch (error) {
        console.error('Error fetching daily tasks:', error);
      }
    },
	async toggleTaskStatus(task) {
	      // 切换任务的完成状态
	      const newStatus = !task.completed;
		  const userId = uni.getStorageSync('user_id'); // 获取当前用户ID
	
	      try {
	        const response = await uniCloud.callFunction({
	          name: 'updateTaskStatus',
	          data: {
	            task_id: task._id, // 使用任务的唯一ID
	            completed: newStatus, // 新的完成状态
				user_id: userId // 传递用户ID
	          }
	        });
	
	        if (response.result && response.result.code === 0) {
	          uni.showToast({ title: newStatus ? '任务已完成' : '任务未完成', icon: 'success' });
	          // 更新前端任务状态
	          task.completed = newStatus;
	        } else {
	          uni.showToast({ title: response.result.msg || '更新失败', icon: 'none' });
	        }
	      } catch (error) {
	        console.error('Error updating task status:', error);
	        uni.showToast({ title: '更新任务状态失败', icon: 'none' });
	      }
	    }
  }
};
</script>


<style>
/* 样式部分 */
.container {
  padding: 20px;
  background-color: #dcdcdc;
}

.task-list {
  margin-top: 20px;
}

.task-item {
  position: relative; /* 确保伪元素相对于 .task-item 定位 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
}

/* 添加伪元素创建四分之一圆 */
.task-item::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 35px; /* 调整大小 */
  height: 35px;
  border-bottom-right-radius: 40px; /* 确保是一个四分之一圆 */
  border-top-left-radius: 0;
  transform: translate(-10px, -10px); /* 调整位置 */
}

/* 未完成任务的四分之一圆样式 */
.task-item.incomplete::before {
  background-color: #ccc; /* 灰色 */
}

/* 已完成任务的四分之一圆样式 */
.task-item.completed::before {
  background-color: #e57373; /* 红色 */
}

/* 编号样式 */
.task-number {
  position: absolute;
  top: 5px;
  left: 10px;
  color: white;
  font-weight: bold;
  font-style: italic;
}

.task-details {
  flex: 1;
  padding-left: 10px;
}

.task-name {
  font-size: 16px;
  font-weight: 520;
  color: #333;
  margin-left: 10px;
}

.task-reward {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #888;
  margin-top: 10px; /* 调整图标和文字间距 */
}

.reward-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.task-status {
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 15px;
  text-align: center;
  min-width: 60px;
}

.task-status.completed {
  color: #d9363e;
  border: 1px solid #d9363e;
}

.task-status.incomplete {
  color: #888;
  border: 1px solid #e0e0e0;
}
</style>
