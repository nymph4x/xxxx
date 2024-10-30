// cloudfunctions/userRegister/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { account, password } = event;

  // 检查账号是否已存在
  const existingUser = await db.collection('users').where({ account }).get();
  if (existingUser.data.length > 0) {
    return {
      success: false,
      message: '该账号已存在'
    };
  }

  // 插入新用户数据
  try {
    await db.collection('users').add({
      account,
      password, // 生产环境中建议对密码进行加密
      createdAt: Date.now(),
    });
    return {
      success: true,
      message: '注册成功',
    };
  } catch (error) {
    return {
      success: false,
      message: '注册失败，请重试',
	  data: null
      error
    };
  }
};
