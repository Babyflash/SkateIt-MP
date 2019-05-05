// pages/load/load.js
const app = getApp();
const myRequest = require('../../lib/api/request');

function onGetUserInfo () {
  wx.getUserInfo({
    success: res => {
      console.log("GET USER INFO", res)
      app.globalData.userInfo = res.userInfo
    }
  })
}

Page({
  data: {
    readyToStart: false
  },

  onGotUserInfo: function() {
    let app = getApp();
    let that = this;

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

              url: 'http://localhost:3000' + '/api/v1/users',
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

          onGetUserInfo();
          
          console.log("Yes..We got code from RES")
        } else {
          console.log('error' + res.errMsg)
        }
      }
    })
  },
 
  onLoad: function (options) {
    let that = this;
    that.onGotUserInfo();
  },

  onReady: function () {

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
        url: '../index/index'
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