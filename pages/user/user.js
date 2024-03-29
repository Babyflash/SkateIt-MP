// pages/user/user.js
const app = getApp();
const myRequest = require('../../lib/api/request');
Page({
  /**
   * Page initial data
   */
  data: {
    favorites: [],
    tabs4: [
      'Favorites',
      'Created Spots'
    ],
    index: 1
  },
  /**
   * Lifecycle function--Called when page load
   */
  handleChange(e) {
    const index = e.detail.index;
    console.log(e);
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "Favorites"
    })
    this.setData({
      userName: app.globalData.userInfo.nickName
    })
  },
  onReady: function () {
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
 
    let spots = getApp().globalData.spotTypes
    this.setData({
      userAvatar: getApp().globalData.userInfo.avatarUrl,
      city: getApp().globalData.userInfo.city,
      favorites: getApp().globalData.favorites
    })
    console.log(this.data.favorites)
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})