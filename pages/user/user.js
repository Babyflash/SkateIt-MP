// pages/user/user.js
const app = getApp();
const myRequest = require('../../lib/api/request');
Page({

  /**
   * Page initial data
   */
  data: {
    favorites: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "Favorites"
    })
    console.log(app.globalData.userInfo.nickName)
    this.setData({
      userName: app.globalData.userInfo.nickName
    })
  },

  // doFavourite: function () {
  //   let that = this
  //   let spot = {
  //     "user_id": app.globalData.currentUserId
  //   }

  //   myRequest.get({
  //     header: {
  //       'Content-Type': 'application/json',
  //       'X-User-Email': wx.getStorageSync('userEmail'),
  //       'X-User-Token': wx.getStorageSync('token')
  //     },
  //     path: 'users/profile',
  //     data: spot,
  //     success(res) {
  //       console.log('Profile Response: ', res)
  //       that.setData({
  //         spots: res.data
  //       })
  //     }
  //   })
  // },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    // const that = this
    // that.doFavourite();
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log(getApp().globalData.spotTypes)
    let spots = getApp().globalData.spotTypes
    this.setData({
      userAvatar: getApp().globalData.userInfo.avatarUrl,
      city: getApp().globalData.userInfo.city,
      favorites: getApp().globalData.favorites
    })
    console.log('favorites', this.data.favorites)
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