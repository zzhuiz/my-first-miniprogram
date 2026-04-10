// pages/bind-info/bind-info.js
const app = getApp()

Page({
  data: {
    studentId: '',
    name: '',
    college: '',
    phone: '',
    canSubmit: false
  },

  onStudentIdChange(e) {
    this.setData({ studentId: e.detail.value })
    this.checkSubmit()
  },

  onNameChange(e) {
    this.setData({ name: e.detail.value })
    this.checkSubmit()
  },

  onCollegeChange(e) {
    this.setData({ college: e.detail.value })
    this.checkSubmit()
  },

  onPhoneChange(e) {
    this.setData({ phone: e.detail.value })
    this.checkSubmit()
  },

  checkSubmit() {
    const { studentId, name, college, phone } = this.data
    const phoneRegex = /^1[3-9]\d{9}$/
    this.setData({
      canSubmit: studentId && name && college && phoneRegex.test(phone)
    })
  },

  onSubmit() {
    const { studentId, name, college, phone } = this.data

    wx.showLoading({ title: '绑定中...' })

    // 模拟绑定成功
    setTimeout(() => {
      wx.hideLoading()
      
      // 更新全局用户信息
      app.globalData.user = {
        ...app.globalData.user,
        studentId,
        name,
        college,
        phone
      }

      wx.showToast({
        title: '绑定成功',
        icon: 'success'
      })

      // 跳转到活动列表
      setTimeout(() => {
        wx.switchTab({
          url: '../index/index'
        })
      }, 1500)
    }, 1000)
  }
})