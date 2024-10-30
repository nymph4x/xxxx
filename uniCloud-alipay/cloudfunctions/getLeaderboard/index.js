const db = uniCloud.database();

//---------------用于自己测试---------
// 用于获取并更新头像 URL
async function fetchAvatarUrl(user_id) {
  try {
    const response = await uniCloud.callFunction({
      name: 'getAndUpdateAvatarUrl',
      data: { user_id }
    });
    
    if (response.result && response.result.code === 0) {
      return response.result.data.avatarUrl; // 返回更新后的头像 URL
    } else {
      console.error('Failed to fetch avatar URL:', response.result.msg);
      return '';
    }
  } catch (error) {
    console.error('Error fetching avatar URL:', error);
    return '';
  }
}
//-------------用于自己测试----------（发行后可删）

exports.main = async (event, context) => {
  const { user_id } = event; // 用于查询当前用户排名
  try {
    const leaderboardCollection = db.collection('leaderboard');
    const usersCollection = db.collection('users');

    // 获取排行榜数据，按分数降序排列，限制前10名
    const leaderboardResult = await leaderboardCollection.orderBy('score', 'desc').limit(10).get();
    const leaderboardData = leaderboardResult.data;

    // 合并排行榜数据和用户的头像、昵称
    const leaderboardWithUserInfo = await Promise.all(leaderboardData.map(async (entry, index) => {
      const userResult = await usersCollection.doc(entry.user_id).get();
      const user = userResult.data[0];
	  
	// 调用 fetchAvatarUrl 获取实际的头像 URL
	  const avatarUrl = await fetchAvatarUrl(entry.user_id);//------用于测试，后续可删-----

      return {
        rank: index + 1,
        user_id: entry.user_id,
        nickname: user ? user.nickname : '匿名用户',
        avatarUrl: avatarUrl || user.avatarUrl || '', // 使用获取到的 URL，或保持原样,
        score: entry.score
      };
    }));

    // 查找当前用户的分数和排名（如果提供了 user_id）
    let currentUser = null;
    if (user_id) {
      const currentUserResult = await leaderboardCollection.where({ user_id }).get();
      if (currentUserResult.data.length > 0) {
        const currentUserScore = currentUserResult.data[0].score;
        const rankResult = await leaderboardCollection
          .where({ score: db.command.gte(currentUserScore) })
          .count();
		
		 // 再次查询 usersCollection 以获取当前用户的昵称和其他信息
		const userResult = await usersCollection.doc(user_id).get();
		const user = userResult.data[0];
				
        currentUser = {
          rank: rankResult.total,
          score: currentUserScore,
          user_id: user_id,
          avatarUrl: await fetchAvatarUrl(user_id),
          nickname: userResult.data[0] ? userResult.data[0].nickname : '我'
        };
      }
    }

    return {
      code: 0,
      msg: '获取排行榜数据成功',
      data: {
        users: leaderboardWithUserInfo,
        currentUser: currentUser
      }
    };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return {
      code: 1,
      msg: '获取排行榜数据失败',
      data: null
    };
  }
};
