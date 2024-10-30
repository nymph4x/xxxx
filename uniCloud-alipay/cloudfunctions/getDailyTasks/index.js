const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const dailytasksCollection = db.collection('dailytasks');

    // 获取用户的当日任务
    const tasksResult = await dailytasksCollection
      .where({
        user_id: user_id,
        date: currentDate
      })
      .get();

    return {
      code: 0,
      msg: '获取每日任务成功',
      data: tasksResult.data
    };
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    return {
      code: 1,
      msg: '获取每日任务失败',
      data: null
    };
  }
};
