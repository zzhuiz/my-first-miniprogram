// pages/my-applies/my-applies.js
const app = getApp()

Page({
  data: {
    user: {},
    applies: [],
    currentTab: 'all',
    filteredApplies: []
  },

  onLoad() {
    this.checkLogin()
    this.getMyApplies()
  },

  onShow() {
    this.getMyApplies()
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

  getMyApplies() {
    wx.showLoading({ title: '加载中...' })

    // 模拟报名数据
    setTimeout(() => {
      wx.hideLoading()
      
      const mockApplies = [
        {
          _id: '1',
          activityId: '1',
          status: 'pending',
          createdAt: new Date(),
          activity: {
            _id: '1',
            title: '校园科技节',
            cover: '../../images/home.png',
            time: '2026-04-15 14:00',
            location: '科技楼报告厅'
          }
        },
        {
          _id: '2',
          activityId: '2',
          status: 'approved',
          createdAt: new Date(),
          activity: {
            _id: '2',
            title: '人工智能讲座',
            cover: '../../images/home.png',
            time: '2026-04-16 10:00',
            location: '图书馆报告厅'
          }
        }
      ]
      
      this.setData({ 
        applies: mockApplies
      })
      this.filterApplies()
    }, 1000)
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.filterApplies()
  },

  filterApplies() {
    const { currentTab, applies } = this.data
    if (currentTab === 'all') {
      this.setData({ filteredApplies: applies })
    } else {
      this.setData({ 
        filteredApplies: applies.filter(item => item.status === currentTab)
      })
    }
  },

  onActivityTap(e) {
    const activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../activity-detail/activity-detail?id=${activityId}`
    })
  },

  formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
})
