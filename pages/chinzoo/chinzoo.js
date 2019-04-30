// pages/chinzoo/chinzoo.js
const app = getApp()
const myRequest = require('../../lib/api/request');
const markerUrl = "https://www.topdraw.com/assets/uploads/2016/05/66255487_thumbnail-591x640.png"
const AV = require('../../utils/av-weapp-min.js')

function uploadToLeanCloud(tempFilePath) {
  // new AV.File('file-name', {
  //   blob: {
  //     uri: tempFilePath,
  //   },
  // }).save().then(file => console.log(file.url())).catch(console.error);
}

function generateSpotsJson() {
  const spots = app.globalData.spotTypes.Ledge;
  console.log("SPOTS===", spots)
  let markers = []

  spots.forEach(function (e) {
    console.log(e)
    markers.push({
      iconPath: markerUrl,
      id: e.id,
      latitude: e.geo_lat,
      longitude: e.geo_lng,
      width: 56,
      height: 56,
    })
  })
  console.log(spots);
  return markers;
}

Page({
  data: {
    lt: "31.219614",
    lg: "121.443877",
    sc: '14',
    mk: [
      {
        iconPath: markerUrl,
        id: 0,
        latitude: 31.219614,
        longitude: 121.443877,
        width: 56,
        height: 56,
        callout: { content: "Shanghai, China", fontSize: 15, color: "#000000", padding: 10 }
      }
    ]
  },

  getCenterLocation: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
        console.log(res.speed)
        console.log(res.accuracy)
        that.setData({ userLatitude: res.latitude, userLongitude: res.longitude })
      },
    })
  },

  navigateToAddSpotPage: function() {
    let that = this
    // wx.navigateTo({
    //   url: '../addSpot/addSpot'
    // })
    wx.chooseImage({
      count: 9, // Default 9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log("Result: ", tempFilePaths)
        // uploadToLeanCloud(tempFilePaths[0])
        that.uploadPromise(tempFilePaths[0]).then( res => {
          console.log('You can execute anything here');
          that.handleClick1();
          return res
        })
      }
    })
  },

  handleClick1() {
    Loading.show({
      content: 'Loading...',
      hide: () => Alert({
        title: '提示',
        content: '手动调用Hide方法关闭',
      }),
    })
    setTimeout(() => {
      Loading.hide()
    }, 3000);
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  onLoad: function (options) {
    this.setData({ mk: generateSpotsJson() })
    this.mapCtx = wx.createMapContext('myMap')
  },

  chooseLocation: function() {
    wx.chooseLocation({
      success: function (res) {
        console.log("LOCATION===", res)
      }
    })
  },

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

  },

  uploadPromise: function (tempFilePath) { 
    return new Promise((resolve, reject) => { new AV.File('file-name', { 
      blob: { uri: tempFilePath, }, 
    }).save().then(file => resolve(file.url())).catch(e => reject(e)); }) 
  }
})