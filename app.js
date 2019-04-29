App({
  onLaunch: function () {
    // WX code
  },
  getUserInfo: (func, app) => {
    // console.log("Salmonnnnnnnnnn")
    let that = app
    wx.getUserInfo({
      success: res => {

        that.globalData.userInfo = res.userInfo
        // console.log("Success get UserInfo")
        // console.log(that.globalData.userInfo)
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
