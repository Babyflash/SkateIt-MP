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
    spotImg: 'https://res.cloudinary.com/doe2rb42f/image/upload/v1556766724/i2akfplvygrf8gmvenoy.jpg',
    types: ['Ledge', 'Manual pad', 'Rail', 'Stair set', 'Transition', 'handrail'],
    isVisible: true,
    isClicked: false,
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

  handleClick1(e) {
    this.setData({ popup1: !this.data.popup1 });
    console.log(this.data.popup1)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick2(e) {
    this.setData({ popup2: true });
    console.log(this.data.popup2)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick3(e) {
    this.setData({ popup3: true });
    console.log(this.data.popup3)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick4(e) {
    console.log(this.data.popup4)
    this.setData({ popup4: true });
    console.log(e.currentTarget.dataset.id)
  },
  handleClick5(e) {
    this.setData({ popup5: true });
    console.log(this.data.popup5)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick6(e) {
    this.setData({ popup6: true });
    console.log(this.data.popup6)
    console.log(e.currentTarget.dataset.id)
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
    this.animation = wx.createAnimation()
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
      this.animation.translateY(-1 * height * 0.75).step()
      this.setData({ animation: this.animation.export() })
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