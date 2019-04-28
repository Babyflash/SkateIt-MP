App({
  onLaunch: function () {
    // WX code
    let app = this;
    wx.login({
      success: function (res) {
        // console.log("RES from wechat:")
        // console.log(res)
        if (res.code) {
          // console.log("wanna eat salmon")
          app.getUserInfo((userInfoFromCallBackHell) => {
            // console.log("Print userinfo callback hell:")
            // console.log(userInfoFromCallBackHell)
            wx.request({
              success: function (res) {
                try {
                  // console.log("Result from server: ")
                  // console.log(res)

                  wx.setStorageSync('token', res.data.authentication_token)
                  wx.setStorageSync('currentUserId', res.data.id)

                  app.globalData.token = res.data.authentication_token
                  app.globalData.currentUserId = res.data.id
                  app.globalData.email = res.data.email
                  app.globalData.user = res.data
                  // console.log("TEST Res store globalData >>>")
                  // console.log(app.globalData.token)
                  // console.log(app.globalData.currentUserId)
                  // console.log(app.globalData.email)
                  // console.log(app.globalData.user)
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

          //发起网络请求
          // console.log("Yes..We got code from RES")
          // console.log("Global Data before RES")

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
