// pages/spot/spot.js
const app = getApp()
const myRequest = require('../../lib/api/request');
const chooseImg = require('../chinzoo/help');
const uploadImgPromise = require('../chinzoo/help');
const AV = require('../../utils/av-weapp-min.js')

Page({
  data: {
    numLikes: Math.floor(Math.random() * 10) + 2,
    liked: false,
    popup6 : false,
    defaultImage: '',
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
    postCount: 0,
    createdUserAvatar: 'https://kitt.lewagon.com/placeholder/users/ClaraMorgen',
    favCount: 0
  },
  checkLike: function(){
    getApp().globalData.favorites.forEach((x)=>{
      if(x.id === this.data.spot.id){
        this.setData({
          bFavourite: true
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // From the forward button within the page
      console.log(res.target)
    }
    return {
      title: "Hello world",
      path: '/page/user?id=123'
    }
  },
  toggleToast(e) {

  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "Spot Page"
    })
    if (getApp().globalData.userInfo === null){
      this.setData({
        nullSession: true
      })
    }
    let that = this
    let spot = JSON.parse(options.spot);
    console.log('spot',spot)
    const spotId = spot.id
    let userAvatarUrl = ''
    if(spot.user){
      userAvatarUrl = spot.user.avatar_url
    }
    else if (spot.createdUserUrl) {
      userAvatarUrl = spot.createdUserUrl
    }

    that.setData({
      defaultImage: spot.default_image.url,
      spot: spot,
      spotType: spot.spot_type,
      spotId: spotId,
      url: spot.default_image.url,
      address: spot.address,
      createdUserAvatar: userAvatarUrl
    })

    that.getFavoritesCount();
    that.updateComments();
  },
  load: function(){
    wx.reLaunch({
      url: '../load/load',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  doFavourite: function () {
    console.log(getApp().globalData.userInfo)
    if (getApp().globalData.userInfo === null){
      wx.showToast({
        title: 'you need to log in',
        icon: 'none',
        duration: 2000
      })
    } else {
      let that = this
      let spot = {
        "user_id": app.globalData.currentUserId,
        "spot_id": that.data.spotId
      }

      myRequest.post({
        header: {
          'Content-Type': 'application/json',
          'X-User-Email': wx.getStorageSync('userEmail'),
          'X-User-Token': wx.getStorageSync('token')
        },
        path: 'users/favorites',
        data: spot,
        success(res) {
          that.setData({
            bFavourite: (res.data.status === 'unliked') ? false : true
          })
          console.log(res);
          if (that.data.bFavourite === true) {
            that.setData({
              favCount: that.data.favCount + 1
            })
            getApp().globalData.favorites.push(that.data.spot)
          } else {
            that.setData({
              favCount: that.data.favCount - 1
            })
            let count = 0
            getApp().globalData.favorites.forEach((x) => {
              if (x.id === that.data.spot.id) {
                getApp().globalData.favorites.splice(count, 1)
              }
              count++
            })
          }
        }
      })
    }
  
  },

  navigateToMap: function () {
    const that = this

    wx.navigateTo({
      url: '/pages/sevan/sevan?lat=' + that.data.spot.geo_lat + '&lng=' + that.data.spot.geo_lng
    })
  },
  updateTime: function(){
    let that = this
    let newTimes = []
    that.data.spots.forEach((x) => {
      console.log('this is a spot')
    })
    that.setData({
      createAt: newTimes
    })
  },

  getFavoritesCount: function () {
    const that = this;
    myRequest.get({
      header: {
        'Content-Type': 'application/json',
        'X-User-Email': wx.getStorageSync('userEmail'),
        'X-User-Token': wx.getStorageSync('token')
      },
      path: 'spots/favorites',
      data: { 'spotId': that.data.spotId },
      success(res) {
        that.setData({
          favCount: res.data.favCount
        })
      }
    })
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
        const datas = res.data;
        const imgs = []
        const newTimes = []
        imgs.push(that.data.defaultImage);
        wx.hideLoading();
        that.setData({
          spots: datas,
        })
        
        if(datas) {
          datas.forEach(function (e) {
            e.post_contents.forEach(function(img) {
              imgs.push(img.media_url.url);
            })
            const newtime = new Date(e.created_at)
            const timeAgo = that.time(newtime)
            newTimes.push(timeAgo)
          })
        }
        that.setData({ 
          imgs: imgs,
          createdAt: newTimes
          })
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
        res.tempFilePaths.forEach(function (e) {
          that.data.imgs.push(e);
        })
      }
    })
  },
  goThere: function () {
    let that = this
    console.log(that.data.spot)
    let spot = that.data.spot
    console.log('gps spot', spot)
    wx.openLocation({
      latitude: spot.geo_lat,
      longitude: spot.geo_lng,
      scale: 18,
      name: spot.spot_type + ' spot',
      address: 'Near ' + spot.address
    })
  },
  showPostWindow: function () {
    if(this.data.nullSession){
      wx.showToast({
        title: 'you need to log in',
        icon: 'none',
        duration: 2000
      })
    } else{
    let that = this

    that.setData({
      popup6: true
    })
    }
  },

  toggleToast(e) {
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

    const checkImage = (path) =>{
      return new Promise(resolve => {
        new AV.File('file-name', {
          blob: {
            uri: path,
          },
        }).save().then(file => resolve(file.url())).catch(e => reject(e));
      });}

    const loadImg = paths => Promise.all(paths.map(checkImage))

    let res = loadImg(that.data.imgs).then(result => {
      
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
          that.handleClose();
        },
        fail: function (res) {
          wx.hideLoading();
          that.data.imgs = []
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
  time: function (date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.abs(Math.floor(seconds)) + " seconds";
  },
  onReady: function () {
  },

  onShow: function () {
    // let that = this
    // that.addPostRequest();
    console.log('comment', this.properties.spot)
    this.checkLike()
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