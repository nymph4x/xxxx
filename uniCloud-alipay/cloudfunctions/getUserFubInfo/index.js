const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;

  try {
    const leaderboardCollection = db.collection('leaderboard');
    const dailytasksCollection = db.collection('dailytasks'); // 修改集合名称

    // 获取用户福币数据
    const userResult = await leaderboardCollection.where({ user_id }).get();
    if (userResult.data.length === 0) {
      return { code: 1, msg: '未找到用户福币信息' };
    }

    const user = userResult.data[0];
    const rankResult = await leaderboardCollection
      .where({ score: db.command.gte(user.score) })
      .count();

    // 查询 dailytasks 集合，检查该用户当日任务的完成情况
    const currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期字符串
    const tasksResult = await dailytasksCollection
      .where({
        user_id: user_id,
        date: currentDate
      })
      .get();

    // 检查当日任务是否全部完成
    const dailyTaskCompleted = tasksResult.data.length > 0 && tasksResult.data.every(task => task.completed === true);

    return {
      code: 0,
      msg: '获取福币信息成功',
      data: {
        fub: user.score,
        rank: rankResult.total,
        dailyTaskCompleted: dailyTaskCompleted
      }
    };
  } catch (error) {
    console.error('Error fetching user FUB info:', error);
    return {
      code: 1,
      msg: '获取福币信息失败',
      data: null
    };
  }
};
