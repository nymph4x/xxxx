// cloudfunctions/userLogin/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { account, password } = event;

  // 查找用户
  const user = await db.collection('users').where({ account, password }).get();
  if (user.data.length === 0) {
    return {
      success: false,
      message: '账号或密码错误'
    };
  }

  return {
    success: true,
    message: '登录成功'
  };
};
