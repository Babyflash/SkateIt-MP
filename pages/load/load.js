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
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  // console.log("计算结果",s)
  return s
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
    myRequest.get({
      path: 'spots',
      success(res) {
        app.globalData.spotTypes = res.data
        console.log('GlobalData', res.data)
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