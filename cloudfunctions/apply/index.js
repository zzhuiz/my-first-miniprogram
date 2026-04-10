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
    if (action === 'apply') {
      // 活动报名
      const { activityId, formData } = data

      // 检查是否已经报名
      const existingApply = await db.collection('applies').where({
        activityId,
        openid: wxContext.OPENID
      }).get()

      if (existingApply.data.length > 0) {
        return {
          code: -1,
          message: '您已经报名过该活动'
        }
      }

      // 检查活动是否存在
      const activity = await db.collection('activities').doc(activityId).get()
      if (!activity.data) {
        return {
          code: -1,
          message: '活动不存在'
        }
      }

      // 检查活动是否已满
      if (activity.data.applyCount >= activity.data.maxParticipants) {
        return {
          code: -1,
          message: '活动报名人数已满'
        }
      }

      // 创建报名记录
      const applyData = {
        activityId,
        openid: wxContext.OPENID,
        formData,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date()
      }

      const addResult = await db.collection('applies').add({
        data: applyData
      })

      // 更新活动报名人数
      await db.collection('activities').doc(activityId).update({
        data: {
          applyCount: activity.data.applyCount + 1
        }
      })

      return {
        code: 0,
        data: {
          ...applyData,
          _id: addResult._id
        }
      }
    } else if (action === 'getMyApplies') {
      // 获取我的报名记录
      const applies = await db.collection('applies').where({
        openid: wxContext.OPENID
      }).orderBy('createdAt', 'desc').get()

      // 获取活动信息
      const activityIds = applies.data.map(item => item.activityId)
      const activities = await db.collection('activities').where({
        _id: db.command.in(activityIds)
      }).get()

      const activityMap = {}
      activities.data.forEach(activity => {
        activityMap[activity._id] = activity
      })

      const result = applies.data.map(apply => ({
        ...apply,
        activity: activityMap[apply.activityId]
      }))

      return {
        code: 0,
        data: result
      }
    } else if (action === 'getActivityApplies') {
      // 获取活动的报名记录
      const { activityId } = data

      // 检查是否是活动发布者
      const activity = await db.collection('activities').doc(activityId).get()
      if (activity.data.publisherOpenid !== wxContext.OPENID) {
        return {
          code: -1,
          message: '无权限查看'
        }
      }

      const applies = await db.collection('applies').where({
        activityId
      }).orderBy('createdAt', 'desc').get()

      // 获取用户信息
      const openids = applies.data.map(item => item.openid)
      const users = await db.collection('users').where({
        openid: db.command.in(openids)
      }).get()

      const userMap = {}
      users.data.forEach(user => {
        userMap[user.openid] = user
      })

      const result = applies.data.map(apply => ({
        ...apply,
        user: userMap[apply.openid]
      }))

      return {
        code: 0,
        data: result
      }
    } else if (action === 'audit') {
      // 审核报名
      const { applyId, status, reason } = data

      // 检查报名记录
      const apply = await db.collection('applies').doc(applyId).get()
      if (!apply.data) {
        return {
          code: -1,
          message: '报名记录不存在'
        }
      }

      // 检查是否是活动发布者
      const activity = await db.collection('activities').doc(apply.data.activityId).get()
      if (activity.data.publisherOpenid !== wxContext.OPENID) {
        return {
          code: -1,
          message: '无权限审核'
        }
      }

      // 更新报名状态
      await db.collection('applies').doc(applyId).update({
        data: {
          status,
          reason,
          updatedAt: new Date()
        }
      })

      return {
        code: 0,
        data: '审核成功'
      }
    } else if (action === 'signin') {
      // 活动签到
      const { applyId } = data

      // 检查报名记录
      const apply = await db.collection('applies').doc(applyId).get()
      if (!apply.data) {
        return {
          code: -1,
          message: '报名记录不存在'
        }
      }

      // 检查是否已签到
      if (apply.data.signed) {
        return {
          code: -1,
          message: '您已经签到过'
        }
      }

      // 检查是否是活动发布者
      const activity = await db.collection('activities').doc(apply.data.activityId).get()
      if (activity.data.publisherOpenid !== wxContext.OPENID) {
        return {
          code: -1,
          message: '无权限签到'
        }
      }

      // 更新签到状态
      await db.collection('applies').doc(applyId).update({
        data: {
          signed: true,
          signedAt: new Date()
        }
      })

      return {
        code: 0,
        data: '签到成功'
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}