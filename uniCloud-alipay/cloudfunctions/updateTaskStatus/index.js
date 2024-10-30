const db = uniCloud.database();

exports.main = async (event, context) => {
  const { task_id, completed, user_id } = event; // 传入 user_id 以便更新福币分数

  try {
    const dailytasksCollection = db.collection('dailytasks');
    const leaderboardCollection = db.collection('leaderboard');

    // 获取任务信息
    const taskResult = await dailytasksCollection.doc(task_id).get();
    if (taskResult.data.length === 0) {
      return { code: 1, msg: '任务不存在' };
    }
    
    const task = taskResult.data[0];

    // 检查任务是否已完成，如果未完成并且现在完成，则更新福币分数
    if (!task.completed && completed) {
      const reward = task.reward; // 获取任务的奖励分数

      // 更新任务状态为已完成
      await dailytasksCollection.doc(task_id).update({ completed: true });

      // 将奖励分数添加到用户的福币分数
      await leaderboardCollection.where({ user_id }).update({
        score: db.command.inc(reward) // 增加用户的福币分数
      });

      return {
        code: 0,
        msg: '任务完成，奖励已添加到福币',
        data: null
      };
    } else if (task.completed && !completed) {
      // 如果是将已完成的任务状态改为未完成，则移除福币奖励
      await dailytasksCollection.doc(task_id).update({ completed: false });

      await leaderboardCollection.where({ user_id }).update({
        score: db.command.inc(-task.reward) // 移除奖励分数
      });

      return {
        code: 0,
        msg: '任务未完成，奖励已移除',
        data: null
      };
    } else {
      return {
        code: 0,
        msg: '任务状态未变更',
        data: null
      };
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    return {
      code: 1,
      msg: '更新任务状态失败',
      data: null
    };
  }
};
