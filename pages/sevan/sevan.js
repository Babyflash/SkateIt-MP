//index.js
//获取应用实例
const markerUrl = "../../lib/images/Marker1.png"

function generateSpotsJson() {
  const spots = app.globalData.spotTypes.Ledge;
  console.log("SPOTS===", spots)
  let markers = []
  if (spots) {
    spots.forEach(function (e) {
      console.log(e)
      markers.push({
        iconPath: markerUrl,
        id: e.id,
        latitude: e.geo_lat,
        longitude: e.geo_lng,
        width: 40,
        height: 56,
        callout: { content: e.address, fontSize: 15, color: "#000000", padding: 10 }
      })
    })
  }

  console.log(spots);
  return markers;
}

const app = getApp()
Page({
  data: {
    // pop item click sevan
    isClicked: false,
    menuClick: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    clicked: false,
    longpress: false,
    show: false,
    selectPerson: true,
    firstPerson: '兴趣',
    selectArea: false,
    open: false,
    first: false,
    second: false,
    lt: "39.90469",
    lg: "116.40717",
    sc: '14',
    mk: [
      {
        iconPath: markerUrl,
        id: 0,
        latitude: 31.219614,
        longitude: 121.443877,
        width: 48,
        height: 36,
        callout: { content: "Shanghai, China", fontSize: 15, color: "#000000", padding: 10 }
      }
    ]
  },

  locating: false,
  locationCount: 0,

  _hanldeLocation: function () {
    let that = this
    if (that.mapCtx) {
      if (!that.locating) {
        wx.showLoading({
          title: 'Get Location',
          mask: true
        })
      }
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          console.log(res);
          if (res.latitude && res.longitude) {
            that.setData({
              lt: res.latitude,
              lg: res.longitude
            })
            that.mapCtx.moveToLocation();
            wx.hideLoading();
            that.locating = false;
            that.locationCount = 0;
          } else {
            console.log(res);
            if (that.locationCount < 5) {
              that.locationCount++;
              that._hanldeLocation();
            } else {
              that.locationCount = 0;
              wx.hideLoading();
              that.locating = false;
              wx.showToast({
                title: 'Failed to get location, please try again',
                icon: 'none'
              })
            }
          }
        },
        fail: err => {
          wx.hideLoading();
          that.locating = false;
          wx.showToast({
            title: 'Failed to get location, please try again',
            icon: 'none'
          })
        }
      });
    }
  },

  navigateToAddSpotPage: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        that.setData({ userLatitude: res.latitude, userLongitude: res.longitude })
      },
    })

    wx.chooseImage({
      count: 9, // Default 9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        // that.setData({
          //   popup6: true
          // })
          
        that.uploadPromise(tempFilePaths[0]).then(res => {
          wx.hideLoading();
          
          console.log("Result: ", res)
          let spot = {
            "spot_rating": 5,
            "difficulty_rating": 5,
            "spot_type": "Ledge",
            "default_image": res,
            "remote_default_image_url": res,
            "user_id": app.globalData.currentUserId,
            "geo_lat": that.data.userLatitude,
            "geo_lng": that.data.userLongitude,
            "address": "Mongolia"
          }

          myRequest.post({
            header: {
              'Content-Type': 'application/json',
              'X-User-Email': wx.getStorageSync('userEmail'),
              'X-User-Token': wx.getStorageSync('token')
            },
            path: 'spots',
            data: spot,
            success(res) {
              console.log("ADD POST RESULT:", res)
            }
          })

        })
      }
    })
  },

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

  closefilters: function(){
    this.setData({
      first: false,
      second: false
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  handleTouchEnd: function(){
    console.log('end')
    this.setData({
      longpress: false
    })
  },
  active: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      isClicked: !this.data.isClicked
    })
  },
  long: function (e) {
    let that = this;

    that.setData({
      touch_start: e.timeStamp,
      longpress: true
    })
    console.log(e.timeStamp + '- touch-start')
  },

  accordion: function(e){
    console.log('grow and shrink')
    // console.log(e.timeStamp)
    
    this.setData({
      clicked: this.data.clicked ? false : true,
      show: !this.data.clicked
    })
    console.log(this.data.show)
   
  },
  move: function(){
    console.log('grow and shrink')
    // console.log(e.timeStamp)
    this.setData({
      clicked: this.data.clicked ? false : true,
      show: !this.data.clicked
    })
  },
  bindHomeTap: function () {
    wx.navigateTo({
      url: '../home/home'
    })
  },

  onLoad: function () {
    this.mapCtx = wx.createMapContext('map', this)
    this.setData({
      spotTypes: app.globalData.spotTypes,
      mk: generateSpotsJson()
    })
    
    let page = this
    //fetch items from rails api

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理

    }
  },
  firstChoice: function(e){
    console.log('first')
    console.log(e.currentTarget)
    this.setData({
      first: !this.data.first,
      second: false,
    })
  },
  secondChoice: function () {
    console.log('second')
    this.setData({
      first: false,
      second: !this.data.second,
    })
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})