// pages/addSpot/addSpot.js
const AV = require('../../utils/av-weapp-min.js')

const MOCK_DATA = {
  productName: 'iphone X max',
  total: 1,
  num: 642135,
  id: 2143324234,
  price: 12700.0,
  desc: 'iphone is good',
};

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
    popup1: false,
    popup2: false,
    popup3: false,
    popup4: false,
    popup5: false,
    popup6: false,
    items1Str: '',
    items1: [
      {
        text: '复选框1',
        ...MOCK_DATA,
      },
      {
        text: '复选框2',
        ...MOCK_DATA,
      },
      {
        text: '复选框3',
        ...MOCK_DATA,
      },
    ],
    items3: ['测试1', '测试2', '测试3', '测试4', '测试5'],
  },

  handleClose() {
    this.setData({
      popup1: false,
      popup2: false,
      popup3: false,
      popup4: false,
      popup5: false,
      popup6: false,
    });
  },

  handleClick1() {
    this.setData({ popup1: true });
  },
  handleClick2() {
    this.setData({ popup2: true });
  },
  handleClick3() {
    this.setData({ popup3: true });
  },
  handleClick4() {
    this.setData({ popup4: true });
  },
  handleClick5() {
    this.setData({ popup5: true });
  },
  handleClick6() {
    this.setData({ popup6: true });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this
    wx.chooseImage({
      count: 9, // Default 9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        uploadToLeanCloud(tempFilePaths[0])
        page.setData({
          popup6: true
        })
        // wx.previewImage({
        //   current: tempFilePaths[0], // http link of the image currently displayed
        //   urls: tempFilePaths // List of http links of images to be previewed
        // })
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