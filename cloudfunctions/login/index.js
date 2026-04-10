// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, userInfo } = event

  try {
    if (action === 'login') {
      // 检查用户是否已存在
      const userResult = await db.collection('users').where({
        openid: wxContext.OPENID
      }).get()

      if (userResult.data.length > 0) {
        // 用户已存在，返回用户信息
        return {
          code: 0,
          data: userResult.data[0]
        }
      } else {
        // 用户不存在，创建新用户
        const newUser = {
          openid: wxContext.OPENID,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          studentId: '',
          name: '',
          college: '',
          phone: '',
          role: 'student', // 默认角色为学生
          createdAt: new Date()
        }

        const addResult = await db.collection('users').add({
          data: newUser
        })

        return {
          code: 0,
          data: {
            ...newUser,
            _id: addResult._id
          }
        }
      }
    } else if (action === 'bindInfo') {
      // 绑定学生信息
      const { studentId, name, college, phone } = event

      const updateResult = await db.collection('users').where({
        openid: wxContext.OPENID
      }).update({
        data: {
          studentId,
          name,
          college,
          phone,
          updatedAt: new Date()
        }
      })

      return {
        code: 0,
        data: updateResult
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}