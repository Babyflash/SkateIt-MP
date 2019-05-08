//index.js
//获取应用实例
const markerUrl = "https://res.cloudinary.com/doe2rb42f/image/upload/v1557301345/marker_b8h9gy.svg"
const AV = require('../../utils/av-weapp-min.js')
const myRequest = require('../../lib/api/request');

const distance = (la1, lo1, la2, lo2) => {
  var R = 6371; // km (change this constant to get miles)
  var dLat = (la2 - la1) * Math.PI / 180;
  var dLon = (lo2 - lo1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  //   if(d> 1) return Math.round(d) + "km";
  // else if (d <= 1) return Math.round(d * 1000) + "m";
  return Math.round(d);
}

function generateSpotsJson() {
  const spots = app.globalData.spotTypes
  let markers = []
  for(let key in spots){
    spots[key].forEach((e) =>{
        markers.push({
        iconPath: markerUrl,
        id: e.id,
        latitude: e.geo_lat,
        longitude: e.geo_lng,
        width: 36,
        height: 36,
        callout: { content: e.address, fontSize: 14, color: "#000000", padding: 10 }
      })
    })
  }
  return markers;
}

const app = getApp()
Page({
  data: {
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
    typeFilter: 'All',
    filteredSpots: '',
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

  updateSpots: function() {
    myRequest.get({
      path: 'spots',
      success(res) {
        app.globalData.spotTypes = res.data
        generateSpotsJson();
      }
    })
  },

  calcDistance: function (latitude, longitude) {
    let spotTypes = app.globalData.spotTypes
    for (let key in spotTypes) {
      let spots = spotTypes[key];
      spots.map(function (spot) {
        let dist = distance(latitude, longitude, spot.geo_lat, spot.geo_lng)
        spot["distance"] = dist
      })
    }
  },

  locating: false,
  spotCount: 0,
  
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
          wx.vibrateShort({
            
          })
          that.calcDistance(res.latitude, res.longitude);
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
            if (that.locationCount < 5) {
              that.locationCount++;
              that._hanldeLocation();
            } else {
              that.locationCount = 0;
              wx.hideLoading();
              that.locating = false;
              wx.showToast({
                title: 'Failed to get location, please try again',
                duration: 2000,
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
            duration: 2000,
            icon: 'none'
          })
        }
      });
    }
  },

  updateUserCurrentLocation: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        that.setData({ userLatitude: res.latitude, userLongitude: res.longitude })
      },
    })
  },

  navigateToUserPage: function(){
    wx.showLoading()
    wx.navigateTo({
      url: '../user/user',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })

  },

  navigateToAddSpotPage: function () {
    wx.showLoading()
    wx.navigateTo({
      url: '../addSpot/addSpot'
    })
    wx.hideLoading()
  },

  uploadPromise: function (tempFilePath) {
    let that = this
    return new Promise((resolve, reject) => {
      new AV.File('file-name', {
        blob: {
          uri: tempFilePath,
        },
      }).save().then(file => resolve(file.url())).catch(e => reject(e));
    })
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  handleTouchEnd: function(){
    this.setData({
      longpress: false
    })
  },
  active: function (e) {
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
  },

  accordion: function(e){    
    this.setData({
      clicked: this.data.clicked ? false : true,
      show: !this.data.clicked
    })
  },
  move: function(e){
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
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: "Spot Map"
    })
    wx.showLoading()
    let page = this
    page._hanldeLocation();
    if (e.lat && e.lng) {
      page.setData({
        lt: e.lat,
        lg: e.lng
      })
    }
    this.mapCtx = wx.createMapContext('map', this)
    this.setData({
      spotTypes: app.globalData.spotTypes,
      mk: generateSpotsJson()
    })
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
      let that = this
      let spot = {
        "user_id": app.globalData.currentUserId
      }
      myRequest.get({
        header: {
          'Content-Type': 'application/json',
          'X-User-Email': wx.getStorageSync('userEmail'),
          'X-User-Token': wx.getStorageSync('token')
        },
        path: 'users/profile',
        data: spot,
        success(res) {
          getApp().globalData.favorites = res.data
        }
      })
    wx.hideLoading()
  },
  firstChoice: function(e){
    this.setData({
      first: !this.data.first
    })
    if (this.data.first) {
      this.slideDownType()
    } else {
      this.slideUpType()
    }
  },
  secondChoice: function () {
    this.setData({
      second: !this.data.second,
    })
    if (this.data.second) {
      this.slideDownDistance()
    } else {
      this.slideUpDistance()
    }
  },
   closefilters: function(){
     if(this.data.first){
       this.slideUpType()
     }
     if(this.data.second){
       this.slideUpDistance()
     }
    this.setData({
      first: false,
      second: false
    })
  },
  slideUpDistance: function () {
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
    this.animation.translateY(-1 * height * .40).step()
    this.setData({ distance: this.animation.export() })
  },
  slideDownDistance: function () {
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
    this.animation.translateY(height * .30).step()
    this.setData({ distance: this.animation.export() })
  },
  slideUpType: function(){
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
    this.animation.translateY(-1 * height * .30).step()
    this.setData({ type: this.animation.export() })
  },
  slideDownType: function(){
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
    this.animation.translateY(height * .30).step()
    this.setData({ type: this.animation.export() })
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
distanceFilter: function(e){
    let filter = e.currentTarget.dataset.id
    let allSpots = getApp().globalData.spotTypes
    let spotCount = 0;
    for (let key in allSpots) {
      spotCount += allSpots[key].length
    }
    let filteredSpots = {
      spotTypes: []
    }
    this.selectItem({
      currentTarget: {
        dataset: {
          type: 'All'
        }
      }
    })
    switch(filter){
      case '1':
        if(this.data.distance1){
          this.setData({
            distance1: !this.data.distance1,
            spotCount: spotCount,
            spotTypes: allSpots
          })
          break;
        }
        for (let key in allSpots) {
          allSpots[key].forEach((x)=>{
            if(x.distance <= 1) filteredSpots.spotTypes.push(x)
          })
        }
        this.setData({
          distance2: false,
          distance3: false,
          distance4: false,
          distance5: false,
          typeFilter: 'All',
          distance1: !this.data.distance1,
          spotCount: filteredSpots.spotTypes.length,
          spotTypes: filteredSpots
        })
        break;
      case '2':
        if (this.data.distance2) {
          this.setData({
            distance2: !this.data.distance2,
            spotCount: spotCount,
            spotTypes: allSpots
          })
          break;
        }
        for (let key in allSpots) {
          allSpots[key].forEach((x) => {
            if(x.distance <= 2) filteredSpots.spotTypes.push(x)
          })
        }
        this.setData({
          distance1: false,
          distance3: false,
          distance4: false,
          distance5: false,
          typeFilter: 'All',
          distance2: !this.data.distance2,
          spotCount: filteredSpots.spotTypes.length,
          spotTypes: filteredSpots
        })
        break;
      case '3':
        if (this.data.distance3) {
          this.setData({
            distance3: !this.data.distance3,
            spotCount: spotCount,
            spotTypes: allSpots
          })
          break;
        }
        for (let key in allSpots) {
          allSpots[key].forEach((x) => {
            if(x.distance <= 3) filteredSpots.spotTypes.push(x)
          })
        }
        this.setData({
          distance1: false,
          distance2: false,
          distance4: false,
          distance5: false,
          typeFilter: 'All',
          distance3: !this.data.distance3,
          spotCount: filteredSpots.spotTypes.length,
          spotTypes: filteredSpots
        })
        break;
      case '4':
        if (this.data.distance4) {
          this.setData({
            distance4: !this.data.distance4,
            spotCount: spotCount,
            spotTypes: allSpots
          })
          break;
        }
        for (let key in allSpots) {
          allSpots[key].forEach((x) => {
            if(x.distance <= 4) filteredSpots.spotTypes.push(x)
          })
        }
        this.setData({
          distance1: false,
          distance2: false,
          distance3: false,
          distance5: false,
          distance4: !this.data.distance4,
          typeFilter: 'All',
          spotCount: filteredSpots.spotTypes.length,
          spotTypes: filteredSpots
        })
        break;
      case '5':
        this.setData({
          distance1: false,
          distance2: false,
          distance3: false,
          distance4: false,
          distance5: !this.data.distance5,
          spotCount: spotCount,
          spotTypes: allSpots
        })
        break;
      default:
        console.log('Not valid')
    }
  },
  selectItem: function (e) {
    const filter = e.currentTarget.dataset.type
    let test = getApp().globalData.spotTypes.hasOwnProperty(filter);
    if(test){
      let object = {
        spotType: app.globalData.spotTypes[filter]
      }
      this.setData({
        typeFilter: filter,
        spotTypes: object
      })
    } else if (filter === 'All'){
      let object = {
        spotType: getApp().globalData.spotTypes
      }
      this.setData({
        typeFilter: 'All',
        spotTypes: app.globalData.spotTypes
      })
    } else {
      let object = {
        spotType: getApp().globalData.spotTypes
      }
      this.setData({
        typeFilter: 'All',
        spotTypes: app.globalData.spotTypes
      })
      wx.showToast({
        title: 'No ' + filter + 's found',
        icon: 'none'
      })
    }
    this.spotCount()
  },
  spotCount: function(){
    let spotCount = 0;
    let total = this.data.spotTypes
    for(let key in total){
      spotCount += total[key].length
    }
    this.setData({
      spotCount: spotCount
    })
  },
  loadType: function(type){

  },
  onReady: function () {
    this.animation = wx.createAnimation()
    let spotCount = 0;
    let object = getApp().globalData.spotTypes
    for (let key in object) {
      spotCount += object[key].length
    }
    this.setData({
      spotCount: spotCount
    })
  },
  onShow: function () {
    // let that = this    
    // wx.onAccelerometerChange(function (e) {
    //   console.log(e.x)
    //   console.log(e.y)
    //   console.log(e.z)
    //   if (e.x > 1 && e.y > 1) {
    //     that._hanldeLocation()
    //   }
    // })
  },
  onHide: function(){
    // wx.stopAccelerometer()
  }
  
})