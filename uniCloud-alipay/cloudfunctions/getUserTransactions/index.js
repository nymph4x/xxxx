// cloudfunctions/getUserTransactions/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { user_id } = event;

  try {
    const transactionCollection = db.collection('transactions'); // 假设有一个 `transactions` 集合存储交易记录
    const transactionResult = await transactionCollection.where({ user_id }).orderBy('date', 'desc').get();

    if (transactionResult.data.length === 0) {
      return { code: 1, msg: '未找到交易记录' };
    }

    return {
      code: 0,
      msg: '获取交易记录成功',
      data: transactionResult.data
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      code: 1,
      msg: '获取交易记录失败',
      data: null
    };
  }
};
