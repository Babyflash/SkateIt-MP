// pages/spot/spot.js
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
    console.log(options.id)
    // let that = this;
    // wx.request({
    //   url: `http://localhost:3000/api/v1/spots/${options.id}`,
    //   method: 'GET',
    //   success(res) {
    //     const spot = res.data;
    //     // Update local data
    //     that.setData({
    //       spot
    //     });
    //     console.log(spot)
    //     wx.hideToast();
    //   }
    // });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

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