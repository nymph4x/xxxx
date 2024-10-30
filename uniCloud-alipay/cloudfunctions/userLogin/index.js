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

  const result = {
    success: true,
    message: '登录成功',
    data: {
      user_id: user.data[0]._id // 返回用户的 _id
    }
  };
  
  console.log("userLogin result:", JSON.stringify(result)); // 输出完整的 result 对象
  return result;

};
