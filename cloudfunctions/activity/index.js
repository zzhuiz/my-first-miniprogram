// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event

  try {
    if (action === 'publish') {
      // 发布活动
      const activityData = {
        ...data,
        publisherOpenid: wxContext.OPENID,
        status: 'active', // active, ended, cancelled
        applyCount: 0,
        createdAt: new Date()
      }

      const addResult = await db.collection('activities').add({
        data: activityData
      })

      return {
        code: 0,
        data: {
          ...activityData,
          _id: addResult._id
        }
      }
    } else if (action === 'getList') {
      // 获取活动列表
      const { category, page = 1, pageSize = 10 } = data
      const skip = (page - 1) * pageSize

      let query = db.collection('activities').where({
        status: 'active'
      })

      if (category) {
        query = query.where({ category })
      }

      const totalResult = await query.count()
      const listResult = await query
        .orderBy('createdAt', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()

      return {
        code: 0,
        data: {
          list: listResult.data,
          total: totalResult.total,
          page,
          pageSize
        }
      }
    } else if (action === 'getDetail') {
      // 获取活动详情
      const { activityId } = data

      const detailResult = await db.collection('activities').doc(activityId).get()

      return {
        code: 0,
        data: detailResult.data
      }
    } else if (action === 'getMyActivities') {
      // 获取我发布的活动
      const activities = await db.collection('activities').where({
        publisherOpenid: wxContext.OPENID
      }).orderBy('createdAt', 'desc').get()

      return {
        code: 0,
        data: activities.data
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}