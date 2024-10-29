const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id, scoreChange } = event;

  try {
    const leaderboardCollection = db.collection('leaderboard');

    // 查找用户在 leaderboard 中的记录
    const userResult = await leaderboardCollection.where({ user_id }).get();

    if (userResult.data.length === 0) {
      // 如果用户记录不存在，则新增一条记录
      await leaderboardCollection.add({
        user_id,
        score: scoreChange, // 初始分数
        updatedAt: Date.now()
      });
    } else {
      // 如果用户记录存在，则更新分数
      const user = userResult.data[0];
      const newScore = (user.score || 0) + scoreChange;

      await leaderboardCollection.doc(user._id).update({
        score: newScore,
        updatedAt: Date.now()
      });
    }

    return {
      code: 0,
      msg: '分数更新成功'
    };
  } catch (error) {
    console.error('Error updating user score:', error);
    return {
      code: 1,
      msg: '分数更新失败',
      data: null
    };
  }
};
