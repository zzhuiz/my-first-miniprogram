// pages/signin/signin.js
const app = getApp()

Page({
  data: {
    activityId: '',
    activity: {},
    qrcodeUrl: '',
    totalApplies: 0,
    signedApplies: 0
  },

  onLoad(options) {
    this.setData({ activityId: options.activityId })
    this.checkLogin()
    this.getActivityDetail()
    this.generateQrcode()
  },

  checkLogin() {
    if (!app.globalData.user) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },

  getActivityDetail() {
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        action: 'getDetail',
        data: {
          activityId: this.data.activityId
        }
      },
      success: res => {
        if (res.result.code === 0) {
          this.setData({ activity: res.result.data })
        }
      }
    })
  },

  generateQrcode() {
    wx.showLoading({ title: '生成二维码中...' })

    // 生成签到二维码，包含活动ID
    const scene = `activityId=${this.data.activityId}`
    const page = 'pages/signin-verify/signin-verify'

    wx.cloud.callFunction({
      name: 'generateQrcode',
      data: {
        scene,
        page
      },
      success: res => {
        wx.hideLoading()
        if (res.result.code === 0) {
          this.setData({ qrcodeUrl: res.result.data.qrcodeUrl })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '生成二维码失败',
          icon: 'none'
        })
      }
    })
  },

  refreshQrcode() {
    this.generateQrcode()
  }
})
