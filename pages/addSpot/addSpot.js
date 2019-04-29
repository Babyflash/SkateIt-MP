// pages/addSpot/addSpot.js
const AV = require('../../utils/av-weapp-min.js')

function uploadToLeanCloud(tempFilePath) {
  new AV.File('file-name', { 
      blob: { 
        uri: tempFilePath, 
      }, 
    }).save().then(file => console.log(file.url())).catch(console.error); 
}

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
    wx.chooseImage({
      count: 9, // Default 9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        uploadToLeanCloud(tempFilePaths[0])
        wx.previewImage({
          current: tempFilePaths[0], // http link of the image currently displayed
          urls: tempFilePaths // List of http links of images to be previewed
        })
      }
    })
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