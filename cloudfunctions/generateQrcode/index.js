// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { scene, page } = event

  try {
    // 调用微信云开发的二维码生成API
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene,
      page,
      width: 430
    })

    // 上传二维码到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: `qrcodes/${Date.now()}.png`,
      fileContent: result.buffer
    })

    return {
      code: 0,
      data: {
        qrcodeUrl: uploadResult.fileID
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}