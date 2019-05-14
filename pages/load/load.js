// pages/load/load.js
const app = getApp();
const myRequest = require('../../lib/api/request');
const BASE_URL = 'https://skateit.wogengapp.cn/api/v1/';
// const BASE_URL = 'http://localhost:3000/api/v1/';

const distance = (la1, lo1, la2, lo2) => {
  var R = 6371; // km (change this constant to get miles)
  var dLat = (la2 - la1) * Math.PI / 180;
  var dLon = (lo2 - lo1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
    return d.toFixed(2);
}

Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    showFlag: false,
    userId: -1
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  getUserInfo: function(e) {
    wx.showLoading()
    let app = getApp();
    let that = this;
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      console.log('failed')
      wx.hideLoading()
      wx.showToast({
        title: 'Needs permission!!!',
        icon: 'none'
      })
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          app.getUserInfo((userInfoFromCallBackHell) => {
            wx.request({
              success: function (res) {
                try {
                  wx.setStorageSync('token', res.data.authentication_token)
                  wx.setStorageSync('currentUserId', res.data.id)
                  wx.setStorageSync('userEmail', res.data.email)
                  app.globalData.token = res.data.authentication_token
                  app.globalData.currentUserId = res.data.id
                  app.globalData.email = res.data.email
                  app.globalData.user = res.data
                  app.globalData.userAvatarUrl = userInfoFromCallBackHell.avatarUrl
                  console.log("1111", app.globalData.currentUserId)
                  that.setData({
                    readyToStart: true
                  })

                  let spot = {
                    "user_id": wx.getStorageSync('currentUserId')
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
                      console.log(res.data)
                      console.log('to map')
                      wx.redirectTo({
                        url: '../sevan/sevan'
                      })
                    }
                  })

                  wx.hideLoading();
                } catch (e) {
                  wx.hideLoading();
                  console.log("Didn't set storage")
                }
              },
              url: BASE_URL + 'users',
              method: "post",
              header: {
                'content-type': 'application/json'
              },
              data: {
                code: res.code,
                user: {
                  name: userInfoFromCallBackHell.nickName,
                  avatar_url: userInfoFromCallBackHell.avatarUrl,
                  gender: userInfoFromCallBackHell.gender,
                  province: userInfoFromCallBackHell.province,
                  city: userInfoFromCallBackHell.city
                }
              }
            })
          }
            , app)
        } else {
          console.log('error' + res.errMsg)
        }
      },
    })
  },
  //用户不允许时的提示,点击时去设置
  handler: function (e) {
    if (e.detail.authSetting["scope.userLocation"]) {
      this.setData({
        showFlag: false
      })
      //返回时重新刷新首页页面
      wx.redirectTo({
        url: '../load/load'
      })
    }
  },

  onLoad: function (options) {
   
  },

  onReady: function () {
    var animation = wx.createAnimation({
      duration: 30000,
      timingFunction: "linear",
    });
    this.animation = animation;
    animation.rotate(45).step();
    this.setData({
      animationData: animation.export()
    })
  
  },
  onUpdate: function(){

  },

  onShow: function (options) {
    const that = this

    myRequest.get({
      path: 'spots',
      success(res) {
        app.globalData.spotTypes = res.data
        that.calcDistance(options);
      }
    })
  },

  calcDistance: function(options) {
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        if (res.latitude && res.longitude) {
          let spotTypes = app.globalData.spotTypes
          for (let key in spotTypes) {
            let spots = spotTypes[key];
            spots.map(function (spot) {
              let dist = distance(res.latitude, res.longitude, spot.geo_lat, spot.geo_lng)
              spot["distance"] = dist
            })
          }
        }
      },
      fail: function () {
        console.log('failed auth')
        wx.hideToast();
        _this.setData({
          showFlag: true
        })
      }
    })
  },

  index: function () {
    let that = this;
    if(getApp().globalData.userInfo)
    if (that.data.readyToStart === true) {

      wx.navigateTo({
        url: '../sevan/sevan'
      })
    }
    else {
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
    }

  },

  doFavourite: function () {
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
        getApp().globalData.favorites(res.data)
      }
    })
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