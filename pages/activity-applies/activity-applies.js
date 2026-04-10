// pages/activity-applies/activity-applies.js
const app = getApp()

Page({
  data: {
    activityId: '',
    applies: [],
    totalApplies: 0,
    approvedApplies: 0,
    signedApplies: 0
  },

  onLoad(options) {
    this.setData({ activityId: options.activityId })
    this.checkLogin()
    this.getActivityApplies()
  },

  checkLogin() {
    if (!app.globalData.user) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },

  getActivityApplies() {
    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: 'apply',
      data: {
        action: 'getActivityApplies',
        data: {
          activityId: this.data.activityId
        }
      },
      success: res => {
        wx.hideLoading()
        if (res.result.code === 0) {
          const applies = res.result.data
          this.setData({
            applies,
            totalApplies: applies.length,
            approvedApplies: applies.filter(item => item.status === 'approved').length,
            signedApplies: applies.filter(item => item.signed).length
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },

  onApprove(e) {
    const applyId = e.currentTarget.dataset.id
    wx.showLoading({ title: '审核中...' })

    wx.cloud.callFunction({
      name: 'apply',
      data: {
        action: 'audit',
        data: {
          applyId,
          status: 'approved',
          reason: ''
        }
      },
      success: res => {
        wx.hideLoading()
        if (res.result.code === 0) {
          wx.showToast({
            title: '审核通过',
            icon: 'success'
          })
          this.getActivityApplies()
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '审核失败',
          icon: 'none'
        })
      }
    })
  },

  onReject(e) {
    const applyId = e.currentTarget.dataset.id
    wx.showModal({
      title: '拒绝理由',
      placeholderText: '请输入拒绝理由',
      editable: true,
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '审核中...' })

          wx.cloud.callFunction({
            name: 'apply',
            data: {
              action: 'audit',
              data: {
                applyId,
                status: 'rejected',
                reason: res.content || '不符合报名条件'
              }
            },
            success: res => {
              wx.hideLoading()
              if (res.result.code === 0) {
                wx.showToast({
                  title: '已拒绝',
                  icon: 'success'
                })
                this.getActivityApplies()
              }
            },
            fail: err => {
              wx.hideLoading()
              wx.showToast({
                title: '审核失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  onSignin(e) {
    const applyId = e.currentTarget.dataset.id
    wx.showLoading({ title: '签到中...' })

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
          wx.showToast({
            title: '签到成功',
            icon: 'success'
          })
          this.getActivityApplies()
        } else {
          wx.showToast({
            title: res.result.message || '签到失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    })
  },

  formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
})
