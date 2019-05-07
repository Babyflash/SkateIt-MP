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
    createdUserAvatar: 'https://kitt.lewagon.com/placeholder/users/ClaraMorgen'
  },
  checkLike: function(){
    console.log("spot id on spot",this.data.spot.id)
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
    console.log("CLICKED YESSSS")
    console.log(e.detail)
  },

  onLoad: function (options) {
    let that = this
    let spot = JSON.parse(options.spot);
    console.log("Spot page's spot instance: ", spot)
    const spotId = spot.id
    console.log(111,spotId)
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
    
    that.updateComments();
  },

  doFavourite: function () {
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
        console.log('Favourite Post Response: ', res.data.status)
        that.setData({
          bFavourite: (res.data.status === 'unliked') ? false : true
        })
        if( that.data.bFavourite === true){
          getApp().globalData.favorites.push(that.data.spot)
          console.log('count fav',getApp().globalData.favorites.length)
        } else {
          let count = 0
          getApp().globalData.favorites.forEach( (x) => {
            if(x.id === that.data.spot.id){
             getApp().globalData.favorites.splice(count, 1)
            }
            count++ 
          })       
        }
      }
    })
  },

  navigateToMap: function () {
    const that = this

    wx.navigateTo({
      url: '/pages/sevan/sevan?lat=' + that.data.spot.geo_lat + '&lng=' + that.data.spot.geo_lng
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
        imgs.push(that.data.defaultImage);
        console.log("GET POST RESPONSE: ",res.data)
        wx.hideLoading();
        that.setData({
          spots: datas,
        })
        
        if(datas) {
          console.log(datas)
          datas.forEach(function (e) {
            e.post_contents.forEach(function(img) {
              imgs.push(img.media_url.url);
            })
          })
        }
        that.setData({ imgs: imgs })
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

    const checkImage = (path) =>{
      console.log(333, path)
      return new Promise(resolve => {
        new AV.File('file-name', {
          blob: {
            uri: path,
          },
        }).save().then(file => resolve(file.url())).catch(e => reject(e));
      });}

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