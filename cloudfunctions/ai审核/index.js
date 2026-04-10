// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { text } = event

  try {
    // 调用微信云开发的内容安全API
    const result = await cloud.openapi.security.msgSecCheck({
      content: text
    })

    return {
      code: 0,
      data: result
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}