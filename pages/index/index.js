//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  sevan: function() {
    wx.navigateTo({
      url: '../sevan/sevan'
    })
  },
  chinzoo: function () {
    wx.navigateTo({
      url: '../chinzoo/chinzoo'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  bindHomeTap: function () {
    wx.navigateTo({
      url: '../home/home'
    })
  },

  onLoad: function () {
  },

  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
