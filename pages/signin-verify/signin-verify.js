// pages/signin-verify/signin-verify.js
const app = getApp()

Page({
  data: {
    activityId: '',
    status: 'loading', // loading, success, error
    errorMessage: '',
    activity: {}
  },

  onLoad(options) {
    // 从二维码扫描获取参数
    const scene = options.scene
    if (scene) {
      // 解析scene参数
      const params = new URLSearchParams(scene)
      this.setData({ activityId: params.get('activityId') })
      this.verifySignin()
    } else {
      this.setData({
        status: 'error',
        errorMessage: '无效的签到码'
      })
    }
  },

  verifySignin() {
    wx.showLoading({ title: '验证中...' })

    // 检查用户是否已登录
    if (!app.globalData.user) {
      wx.hideLoading()
      this.setData({
        status: 'error',
        errorMessage: '请先登录'
      })
      return
    }

    // 检查用户是否已报名该活动
    wx.cloud.callFunction({
      name: 'apply',
      data: {
        action: 'getMyApplies',
        data: {}
      },
      success: res => {
        if (res.result.code === 0) {
          const applies = res.result.data
          const apply = applies.find(item => item.activityId === this.data.activityId && item.status === 'approved')
          
          if (apply) {
            // 检查是否已签到
            if (apply.signed) {
              wx.hideLoading()
              this.setData({
                status: 'error',
                errorMessage: '您已经签到过了'
              })
            } else {
              // 执行签到
              this.doSignin(apply._id)
            }
          } else {
            wx.hideLoading()
            this.setData({
              status: 'error',
              errorMessage: '您未报名该活动或报名未通过'
            })
          }
        }
      },
      fail: err => {
        wx.hideLoading()
        this.setData({
          status: 'error',
          errorMessage: '验证失败'
        })
      }
    })
  },

  doSignin(applyId) {
    wx.cloud.callFunction({
      name: 'apply',
      data: {
        action: 'signin',
        data: {
          applyId
        }
      },
      success: res => {
        wx.hideLoading()
        if (res.result.code === 0) {
          // 获取活动信息
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
                this.setData({
                  status: 'success',
                  activity: res.result.data
                })
              }
            }
          })
        } else {
          this.setData({
            status: 'error',
            errorMessage: res.result.message || '签到失败'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        this.setData({
          status: 'error',
          errorMessage: '签到失败'
        })
      }
    })
  }
})
