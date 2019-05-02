//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  handleTouchEnd: function(){
    console.log('end')
    this.setData({
      longpress: false
    })
  },
  long: function (e) {
    let that = this;

    that.setData({
      touch_start: e.timeStamp,
      longpress: true
    })
    console.log(e.timeStamp + '- touch-start')
  }, 
  accordion: function(e){
    console.log('grow and shrink')
    // console.log(e.timeStamp)
    
    this.setData({
      clicked: this.data.clicked ? false : true,
      show: !this.data.clicked
    })
    console.log(this.data.show)
   
  },
  bindHomeTap: function () {
    wx.navigateTo({
      url: '../home/home'
    })
  },

  onLoad: function () {
    this.setData({
      spotTypes: app.globalData.spotTypes
    })
    let page = this
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
  },
  firstChoice: function(e){
    console.log('first')
    console.log(e.currentTarget)
    this.setData({
      first: !this.data.first,
      second: false,
    })
  },
  secondChoice: function () {
    console.log('second')
    this.setData({
      first: false,
      second: !this.data.second,
    })
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
