// pages/activity-detail/activity-detail.js
const app = getApp()

Page({
  data: {
    activityId: '',
    activity: {},
    user: {},
    remark: '',
    hasApplied: false,
    applyStatus: '',
    isPublisher: false
  },

  onLoad(options) {
    this.setData({ activityId: options.id })
    this.checkLogin()
    this.getActivityDetail()
  },

  checkLogin() {
    if (!app.globalData.user) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      this.setData({ user: app.globalData.user })
    }
  },

  getActivityDetail() {
    wx.showLoading({ title: '加载中...' })

    // 模拟活动详情数据
    setTimeout(() => {
      wx.hideLoading()
      
      const mockActivity = {
        _id: this.data.activityId,
        title: '校园科技节',
        cover: '../../images/home.png',
        time: '2026-04-15 14:00',
        location: '科技楼报告厅',
        maxParticipants: 100,
        applyCount: 50,
        category: '活动',
        description: '校园科技节是我校一年一度的科技盛会，旨在展示学生的科技创新成果，促进科技交流与合作。活动将包括科技展览、学术讲座、科技竞赛等多个环节，欢迎广大师生积极参与。',
        publisherOpenid: 'test_openid',
        createdAt: new Date()
      }
      
      this.setData({ 
        activity: mockActivity,
        isPublisher: mockActivity.publisherOpenid === app.globalData.user.openid
      })
    }, 1000)
  },

  onRemarkChange(e) {
    this.setData({ remark: e.detail.value })
  },

  onApply() {
    wx.showLoading({ title: '报名中...' })

    // 模拟报名成功
    setTimeout(() => {
      wx.hideLoading()
      
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      })
      
      this.setData({ 
        hasApplied: true,
        applyStatus: '待审核'
      })
    }, 1000)
  },

  onViewApplies() {
    wx.navigateTo({
      url: `../activity-applies/activity-applies?activityId=${this.data.activityId}`
    })
  },

  formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
})
