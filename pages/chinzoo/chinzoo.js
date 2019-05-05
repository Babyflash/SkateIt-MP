// pages/chinzoo/chinzoo.js
const app = getApp()
const myRequest = require('../../lib/api/request');
const markerUrl = "https://www.topdraw.com/assets/uploads/2016/05/66255487_thumbnail-591x640.png"
const AV = require('../../utils/av-weapp-min.js')

function generateSpotsJson() {
  const spots = app.globalData.spotTypes.Ledge;
  console.log("SPOTS===", spots)
  let markers = []
  if(spots) {
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
  }
  
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
    ],
    // filter click sevan
    isClicked: false,
    popup6: false,
    items1: ['Fuck1', 'Fuck2', 'Fuck3', 'Fuck4', 'Fuck5'],
  },
  //active click sevan
  active: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      isClicked: !this.data.isClicked
    })
  },
  handleClose() {
    this.setData({
      popup6: false,
    });
  },

  getCenterLocation: function () {
    let that = this
    console.log("GET LOCATION")
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

  

  showLoading() {
    wx.showLoading({
      title: 'Uploading...',
      mask: true
    })
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

  // function uploadToLeanCloud(tempFilePath) {
  //   new AV.File('file-name', {
  //     blob: {
  //       uri: tempFilePath,
  //     },
  //   }).save().then(file => console.log(file.url())).catch(console.error);
  // }

  uploadPromise: function (tempFilePath) { 
    let that = this
    that.showLoading();
    return new Promise((resolve, reject) => { 
      new AV.File('file-name', { 
        blob: {
           uri: tempFilePath, 
        }, 
      }).save().then(file => resolve(file.url())).catch(e => reject(e)); 
    }) 
  },

  properties: {
    image: {
      type: String,
      value: ''
    }
  },
  
  methods: {
    active: function () {
      this.setData({
        isClicked: !this.data.isClicked
      })
    }
  }
  
})