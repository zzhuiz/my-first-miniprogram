// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-0g5i94e823a45945',
      traceUser: true
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    user: null
  }
})
