// pages/spot/spot.js
const app = getApp()
const myRequest = require('../../lib/api/request');
const chooseImg = require('../chinzoo/help');
const uploadImgPromise = require('../chinzoo/help');
const AV = require('../../utils/av-weapp-min.js')

Page({
  data: {
    popup6 : false,
    imgs: ['../../lib/images/spot.jpg', '../../lib/images/spot.jpg', '../../lib/images/spot.jpg'],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
      
  },

  toggleToast(e) {
    console.log("CLICKED YESSSS")
    console.log(e.detail)
  },

  onLoad: function (options) {
    
    let spot = JSON.parse(options.spot);
    console.log(spot)
    let that = this
    const spotId = options.id
    const spotType = options.type
    const url = options.url
    const address = options.address
    this.setData({
      spotType: spotType,
      spotId: spotId,
      url: url,
      imgs: this.data.imgs.push(url),
      address: address
    })

    myRequest.get({
      path: `spots/${spotId}/posts`,
      success(res) {
        console.log(res)
      }
    })
  },

  chooseImage: function () {
    let that = this

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths)
        res.tempFilePaths.forEach(function (e) {
          that.data.imgs.push(e);
        })
      }
    })
  },

  showPostWindow: function () {
    let that = this

    that.setData({
      popup6: true
    })
  },

  toggleToast(e) {
    console.log("SHIT")
  },

  addPostRequest: function () {
    let that = this

    wx.showLoading({
      title: 'Uploading...',
      mask: true
    })

    const checkImage = path =>
      new Promise(resolve => {
        new AV.File('file-name', {
          blob: {
            uri: path,
          },
        }).save().then(file => resolve(file.url())).catch(e => reject(e));
      });

    const loadImg = paths => Promise.all(paths.map(checkImage))

    let res = loadImg(that.data.imgs).then(result => {
      console.log("ALL PROMISES RESULT=", result)
      
      let post = {
        "description": "Cool place i have ever seen. AMAZING!!!",
        "user_id": app.globalData.currentUserId,
        "spot_id": that.data.spotId,
        "content": result
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
          wx.hideLoading();
          that.data.imgs = []
          console.log("CREATE POST RESULT:", res)
          that.handleClose();
        },
        fail: function (res) {
          wx.hideLoading();
          that.data.imgs = []
          console.log(res.data);
          console.log('failed!' + res.statusCode);
        }
      })
    })
  },

  showAddPostPopUp: function () {
    let that = this
    that.setData({
      popup6: true,
    });
  },

  handleClose() {
    this.setData({
      popup6: false,
      imgs: []
    });
  },

  onReady: function () {

  },

  onShow: function () {
    // let that = this
    // that.addPostRequest();
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