// pages/login/login.js
const app = getApp()

Page({
  data: {
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        // 保存用户信息到全局变量
        app.globalData.userInfo = res.userInfo
        
        // 模拟登录成功，创建本地用户数据
        const mockUser = {
          openid: 'test_openid',
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          studentId: '',
          name: '',
          college: '',
          phone: '',
          role: 'student',
          createdAt: new Date()
        }
        
        // 保存用户信息
        app.globalData.user = mockUser
        
        // 跳转到绑定信息页面
        wx.navigateTo({
          url: '../bind-info/bind-info'
        })
      }
    })
  }
})