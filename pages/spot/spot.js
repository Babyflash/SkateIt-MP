// pages/spot/spot.js
const app = getApp()
const myRequest = require('../../lib/api/request');
const chooseImg = require('../chinzoo/help');
const uploadImgPromise = require('../chinzoo/help');
const AV = require('../../utils/av-weapp-min.js')

Page({
  data: {
    popup6 : false,
    imgs: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    spots: [],
    postCount: 0
  },

  toggleToast(e) {
    console.log("CLICKED YESSSS")
    console.log(e.detail)
  },

  onLoad: function (options) {
    let spot = JSON.parse(options.spot);
    console.log(spot)
    let that = this
    const spotId = spot.id
    const spotType = spot.spot_type
    const url = spot.default_image.url
    console.log("URL: ", url)
    const address = spot.address
    const allImg = that.data.imgs;
    allImg.push(url)
    console.log("CARAOUSEL IMAGE", allImg)
    this.setData({
      spot: spot,
      spotType: spotType,
      spotId: spotId,
      url: url,
      imgs: allImg,
      address: address
    })
    
    that.updateComments();
  },

  updateComments: function () {
    let that = this

    wx.showLoading({
      title: 'Loading...',
      mask: true
    })

    myRequest.get({
      path: `spots/${that.data.spotId}/posts`,
      success(res) {
        wx.hideLoading();
        that.setData({
          spots: res.data,
        })
        console.log("ALL POSTS HERE: ", res.data)
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
    console.log("FROM POST PAGE: ", e)
    let that = this
    that.setData({
      popup6: false
    })
    that.updateComments();
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
      popup6: false
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