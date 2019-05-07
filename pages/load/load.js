// pages/load/load.js
const app = getApp();
const myRequest = require('../../lib/api/request');

// function getUser () {
//   wx.getUserInfo({
//     success: res => {
//       console.log("GET USER INFO", res)
//       app.globalData.userInfo = res.userInfo
//     }
//   })
// }

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
    nextMargin: 0
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
    let app = getApp();
    let that = this;
    console.log(1111,e)
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      console.log('failed')
      // this.openSetting();
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          app.getUserInfo((userInfoFromCallBackHell) => {
            wx.request({
              success: function (res) {
                try {
                  wx.setStorageSync('token', res.data.authentication_token)
                  console.log('Token from backend', wx.getStorageSync('token'))
                  wx.setStorageSync('currentUserId', res.data.id)
                  wx.setStorageSync('userEmail', res.data.email)
                  app.globalData.token = res.data.authentication_token
                  app.globalData.currentUserId = res.data.id
                  app.globalData.email = res.data.email
                  app.globalData.user = res.data
                  app.globalData.userAvatarUrl = userInfoFromCallBackHell.avatarUrl
                  that.setData({
                    readyToStart: true
                  })
                  wx.hideLoading();
                } catch (e) {
                  wx.hideLoading();
                  console.log("Didn't set storage")
                }
              },

              url: 'https://skateit.wogengapp.cn/api/v1/users',
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

          // onGetUserInfo();
          
          console.log("Yes..We got code from RES")
          wx.navigateTo({
            url: '../sevan/sevan'
          })
        } else {
          console.log('error' + res.errMsg)
        }
      }
    })
  },
  onLoad: function (options) {
    // let that = this;
    // that.onGotUserInfo();
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

  onShow: function () {
    const that = this

    myRequest.get({
      path: 'spots',
      success(res) {
        app.globalData.spotTypes = res.data
        console.log('GlobalData', res.data)
        that.calcDistance();
      }
    })
  },

  calcDistance: function() {
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
            console.log("spots", spots)
          }
        }
      }
    })
  },

  index: function () {
    let that = this;

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
        console.log('Profile Response: ', res)
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