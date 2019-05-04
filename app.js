const AV = require('./utils/av-weapp-min.js') 
const config = require('./key')   
AV.init({ appId: config.appId, appKey: config.appSecret, });

App({
  onLaunch: function () {
    // WX code
  },
  getUserInfo: (func, app) => {
    let that = app
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo
        console.log("User info")
        console.log(that.globalData.userInfo)
        func(res.userInfo)
      }
    })
  },
  globalData: {
    userInfo: null
  }
  // globalData: {
  //   userInfo: {
  //     nickName: "",
  //     avatarUrl: "",
  //     gender: "none",
  //     province: "",
  //     city: ""
  //   },
  //   salmon: "",
  //   token: "",
  //   currentUserId: "",
  //   email: "",
  //   user: {},
  //   items: {},
  //   item: {},
  //   profileItem: {}

  // }
})
