// pages/publish-activity/publish-activity.js
const app = getApp()

Page({
  data: {
    categories: ['讲座', '比赛', '活动', '其他'],
    formData: {
      title: '',
      cover: '',
      time: '',
      location: '',
      maxParticipants: '',
      deadline: '',
      category: '讲座',
      categoryIndex: 0,
      description: ''
    },
    canSubmit: false
  },

  onLoad() {
    this.checkLogin()
  },

  checkLogin() {
    if (!app.globalData.user) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },

  onTitleChange(e) {
    this.setData({ 'formData.title': e.detail.value })
    this.checkSubmit()
  },

  onTimeChange(e) {
    this.setData({ 'formData.time': e.detail.value })
    this.checkSubmit()
  },

  onLocationChange(e) {
    this.setData({ 'formData.location': e.detail.value })
    this.checkSubmit()
  },

  onMaxParticipantsChange(e) {
    this.setData({ 'formData.maxParticipants': e.detail.value })
    this.checkSubmit()
  },

  onDeadlineChange(e) {
    this.setData({ 'formData.deadline': e.detail.value })
    this.checkSubmit()
  },

  onCategoryChange(e) {
    const index = e.detail.value
    this.setData({
      'formData.categoryIndex': index,
      'formData.category': this.data.categories[index]
    })
  },

  onDescriptionChange(e) {
    this.setData({ 'formData.description': e.detail.value })
    this.checkSubmit()
  },

  onUploadCover() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({ title: '上传中...' })
        
        // 上传图片到云存储
        wx.cloud.uploadFile({
          cloudPath: `activity-covers/${Date.now()}.png`,
          filePath: tempFilePaths[0],
          success: res => {
            wx.hideLoading()
            this.setData({ 'formData.cover': res.fileID })
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  checkSubmit() {
    const { title, time, location, maxParticipants, deadline, description } = this.data.formData
    this.setData({
      canSubmit: title && time && location && maxParticipants && deadline && description
    })
  },

  onSubmit() {
    wx.showLoading({ title: '发布中...' })

    wx.cloud.callFunction({
      name: 'activity',
      data: {
        action: 'publish',
        data: {
          ...this.data.formData,
          maxParticipants: parseInt(this.data.formData.maxParticipants)
        }
      },
      success: res => {
        wx.hideLoading()
        if (res.result.code === 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
          icon: 'none'
        })
      }
    })
  }
})
