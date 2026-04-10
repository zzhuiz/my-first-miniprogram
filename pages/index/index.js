// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    categories: ['全部', '讲座', '比赛', '活动', '其他'],
    currentCategory: '全部',
    activities: [],
    page: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad() {
    // 检查登录状态
    this.checkLogin()
    // 获取活动列表
    this.getActivities()
  },

  onShow() {
    // 页面显示时刷新活动列表
    this.setData({ page: 1, activities: [], hasMore: true })
    this.getActivities()
  },

  checkLogin() {
    if (!app.globalData.user) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },

  getActivities() {
    wx.showLoading({ title: '加载中...' })

    // 模拟活动数据
    setTimeout(() => {
      wx.hideLoading()
      
      const mockActivities = [
        {
          _id: '1',
          title: '校园科技节',
          cover: '../../images/home.png',
          time: '2026-04-15 14:00',
          location: '科技楼报告厅',
          maxParticipants: 100,
          applyCount: 50,
          category: '活动',
          description: '校园科技节是我校一年一度的科技盛会，旨在展示学生的科技创新成果，促进科技交流与合作。',
          createdAt: new Date()
        },
        {
          _id: '2',
          title: '人工智能讲座',
          cover: '../../images/home.png',
          time: '2026-04-16 10:00',
          location: '图书馆报告厅',
          maxParticipants: 200,
          applyCount: 150,
          category: '讲座',
          description: '邀请知名AI专家来校讲座，介绍人工智能的最新发展和应用。',
          createdAt: new Date()
        },
        {
          _id: '3',
          title: '编程竞赛',
          cover: '../../images/home.png',
          time: '2026-04-18 09:00',
          location: '计算机实验室',
          maxParticipants: 50,
          applyCount: 45,
          category: '比赛',
          description: '面向全校学生的编程竞赛，展示编程技能，赢取丰厚奖品。',
          createdAt: new Date()
        }
      ]
      
      this.setData({
        activities: mockActivities,
        hasMore: false
      })
    }, 1000)
  },

  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category
    })
  },

  loadMore() {
    if (this.data.hasMore) {
      this.setData({ page: this.data.page + 1 })
      this.getActivities()
    }
  },

  onActivityTap(e) {
    const activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../activity-detail/activity-detail?id=${activityId}`
    })
  },

  onPublish() {
    wx.navigateTo({
      url: '../publish-activity/publish-activity'
    })
  }
})
