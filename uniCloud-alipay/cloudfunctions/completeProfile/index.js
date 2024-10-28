// cloudfunctions/completeProfile/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { avatarUrl, nickname, year, major, school, account } = event;

  // 更新用户资料
  try {
    await db.collection('users').where({ account }).update({
      avatarUrl,
      nickname,
      year,
      major,
      school,
      updatedAt: Date.now(),
    });
    return {
      success: true,
      message: '资料完善成功'
    };
  } catch (error) {
    return {
      success: false,
      message: '资料更新失败，请重试',
      error
    };
  }
};
