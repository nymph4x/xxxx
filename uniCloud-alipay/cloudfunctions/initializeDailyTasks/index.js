const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;
  const currentDate = new Date().toISOString().split('T')[0];

  const dailytasksCollection = db.collection('dailytasks');

  try {
    // 检查当日是否已存在任务
    const existingTasks = await dailytasksCollection.where({
      user_id: user_id,
      date: currentDate
    }).get();

    // 如果当日任务不存在，则插入默认任务
    if (existingTasks.data.length === 0) {
      const defaultTasks = [
        {
          user_id: user_id,
          name: "今日登录打卡",
          reward: 5,
          completed: false,
          date: currentDate
        },
        {
          user_id: user_id,
          name: "自习室学习时长达到4h",
          reward: 10,
          completed: false,
          date: currentDate
        }
      ];
      
      await dailytasksCollection.add(defaultTasks);
    }

    return {
      code: 0,
      msg: '每日任务初始化成功',
      data: existingTasks.data.length > 0 ? existingTasks.data : defaultTasks
    };
  } catch (error) {
    console.error('Error initializing daily tasks:', error);
    return {
      code: 1,
      msg: '每日任务初始化失败',
      data: null
    };
  }
};

