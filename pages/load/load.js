// pages/load/load.js
const app = getApp();

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
                  console.log("Result from server: ")
                  console.log(res)
                  wx.setStorageSync('token', res.data.authentication_token)
                  wx.setStorageSync('currentUserId', res.data.id)
                  app.globalData.token = res.data.authentication_token
                  app.globalData.currentUserId = res.data.id
                  app.globalData.email = res.data.email
                  app.globalData.user = res.data
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

        // ## Send request card to avoid asyc
        // wx.request({
        //   success: function (res) {
        //     try {
        //       console.log("MMMINDEX API: ")
        //       // console.log(res)
        //       app.globalData.spots = res.data
        //       console.log(app.globalData.spots)
        //       console.log("INDEX API SUCCESS")
        //     } catch (e) {
        //       console.log(e)
        //     }
        //   },

        //   url: 'http://localhost:3000/api/v1/spots',
        //   method: "get"
        // })
        // ## Send request card to avoid asyc

      }
    })
  },
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  index: function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})