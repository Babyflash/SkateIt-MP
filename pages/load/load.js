// pages/load/load.js
const app = getApp();
const myRequest = require('../../lib/api/request');

function onGetUserInfo () {
  console.log("GET USER INFO")
  wx.getUserInfo({
    success: res => {
      app.globalData.userInfo = res.userInfo
      console.log('global data: ')
      console.log(app)
    }
  })
}

Page({
  onGotUserInfo: function() {
    let app = getApp();
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
                } catch (e) {
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
          //发起网络请求
          console.log("Yes..We got code from RES")
          console.log("Global Data before RES")
        } else {
          console.log('error' + res.errMsg)
        }
      }
    })
  },
  data: {

  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  index: function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },

  onShow: function () {
    myRequest.get({
      path: 'spots',
      success(res) {
        console.log(res)
        app.globalData.spotTypes = res.data
        console.log('GlobalData', app.globalData.spotTypes)
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