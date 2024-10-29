const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;

  try {
    // 获取用户记录
    const userRecord = await db.collection('users').doc(user_id).get();
    if (userRecord.data.length === 0) {
      return {
        code: 1,
        msg: "用户未找到"
      };
    }

    let avatarUrl = userRecord.data[0].avatarUrl;

    // 检查 avatarUrl 是不是 fileID（如果不是完整 URL 则认为是 fileID）
    if (!avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
      // 生成临时 URL
      const result = await uniCloud.getTempFileURL({
        fileList: [avatarUrl]
      });

      if (result.fileList && result.fileList[0].tempFileURL) {
        avatarUrl = result.fileList[0].tempFileURL;

        // 更新用户记录，将新的 tempFileURL 写入 avatarUrl 字段
        await db.collection('users').doc(user_id).update({
          avatarUrl: avatarUrl
        });
      } else {
        return {
          code: 2,
          msg: "获取 tempFileURL 失败"
        };
      }
    }

    // 返回头像 URL
    return {
      code: 0,
      msg: "头像 URL 获取成功",
      data: {
        avatarUrl: avatarUrl
      }
    };

  } catch (error) {
    console.error("云函数执行出错:", error);
    return {
      code: 3,
      msg: "云函数执行出错",
      error: error
    };
  }
};
