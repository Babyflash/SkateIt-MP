// pages/spot/spot.js
const app = getApp()
const myRequest = require('../../lib/api/request');

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this
    
    const spotId = options.id
    const spotType = options.type
    const url = options.url
    const address = options.address
    this.setData({
      spotType: spotType,
      spotId: spotId,
      url: url,
      address: address
    })

    myRequest.get({
      path: `spots/${spotId}/posts`,
      success(res) {
        console.log(res)
      }
    })
  },

  addPostRequest: function () {
    let that = this
    let post = {
      "description": "Cool place i have ever seen. AMAZING!!!",
      "user_id": app.globalData.currentUserId,
      "spot_id": that.data.spotId
    }

    myRequest.post({
      header: {
        'Content-Type': 'application/json',
        'X-User-Email': wx.getStorageSync('userEmail'),
        'X-User-Token': wx.getStorageSync('token')
      },
      path: `spots/${that.data.spotId}/posts`,
      data: post,
      success(res) {
        console.log("CREATE POST RESULT:", res)
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {
    let that = this
    that.addPostRequest();
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})