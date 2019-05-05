// pages/addSpot/addSpot.js
const AV = require('../../utils/av-weapp-min.js')
const app = getApp()
const myRequest = require('../../lib/api/request');

function uploadToLeanCloud(tempFilePath) {
  new AV.File('file-name', { 
      blob: { 
        uri: tempFilePath, 
      },
    }).save().then(file => console.log(file.url())).catch(console.error); 
}

Page({
  data: {
    spotImg: '',
    types: ['Ledge', 'Manual pad', 'Rail', 'Stair set', 'Transition', 'handrail'],
    isVisible: true,
    isClicked: false
  },

  handleClose() {
    this.setData({
      popup1: false,
      popup2: false,
      popup3: false,
      popup4: false,
      popup5: false,
      popup6: false,
    });
  },

  handleClick1(e) {
    this.setData({ popup1: !this.data.popup1 });
    console.log(this.data.popup1)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick2(e) {
    this.setData({ popup2: true });
    console.log(this.data.popup2)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick3(e) {
    this.setData({ popup3: true });
    console.log(this.data.popup3)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick4(e) {
    console.log(this.data.popup4)
    this.setData({ popup4: true });
    console.log(e.currentTarget.dataset.id)
  },
  handleClick5(e) {
    this.setData({ popup5: true });
    console.log(this.data.popup5)
    console.log(e.currentTarget.dataset.id)
  },
  handleClick6(e) {
    this.setData({ popup6: true });
    console.log(this.data.popup6)
    console.log(e.currentTarget.dataset.id)
  },

  onLoad: function (options) {
    let page = this
    wx.chooseImage({
      count: 9, // Default 9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log("CHOOSE IMAGE", res)
        page.setData({
          popup6: true,
          spotImg: tempFilePaths[0]
        })

        // wx.previewImage({
        //   current: tempFilePaths[0], // http link of the image currently displayed
        //   urls: tempFilePaths // List of http links of images to be previewed
        // })
      },
      fail: ex => {
        wx.navigateTo({
          url: '/pages/sevan/sevan'
        });
      }
    })
  },
  
  uploadPromise: function (tempFilePath) {
    let that = this
    return new Promise((resolve, reject) => {
      new AV.File('file-name', {
        blob: {
          uri: tempFilePath,
        },
      }).save().then(file => resolve(file.url())).catch(e => reject(e));
    })
  },

  addSpot: function () {
    let that = this

    wx.showLoading({
      title: 'Uploading...',
      mask: true
    })

    wx.getLocation({
      success: function (res) {
        that.setData({ userLatitude: res.latitude, userLongitude: res.longitude })

        that.uploadPromise(that.data.spotImg).then(res => {
          console.log("LEANCLOUND RESULT: ", res)
          that.setData({
            popup6: true
          })
          
          let spot = {
            "spot_rating": 5,
            "difficulty_rating": 5,
            "spot_type": "Ledge",
            "default_image": res,
            "remote_default_image_url": res,
            "user_id": app.globalData.currentUserId,
            "geo_lat": that.data.userLatitude,
            "geo_lng": that.data.userLongitude,
            "address": "Mongolia"
          }

          myRequest.post({
            header: {
              'Content-Type': 'application/json',
              'X-User-Email': wx.getStorageSync('userEmail'),
              'X-User-Token': wx.getStorageSync('token')
            },
            path: 'spots',
            data: spot,
            success(res) {
              console.log("ADD POST RESULT:", res)
              wx.hideLoading();
              spot = res.data;
              spot.default_image.url = that.data.spotImg
              console.log("ADDED SPOT",spot)
              myRequest.get({
                path: 'spots',
                success(res) {
                  app.globalData.spotTypes = res.data
                  console.log('ALL SPOTS RESPONSE SAVE INTO GLOBALDATA', res.data)
                }
              })
              wx.navigateTo({
                url: '/pages/spot/spot?spot=' + JSON.stringify(spot)
                // url: '/pages/servan/sevan'
              });
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: 'Failed to add spot, check internet connection!',
                duration: 2000,
                icon: 'none'
              })
            }
          })
        })
      },
      fail: e => {
        wx.showToast({
          title: 'Failed to add spot, check internet connection!',
          duration: 2000,
          icon: 'none'
        })
        wx.hideLoading();
      }
    })
  },
 
  onReady: function () {
    this.animation = wx.createAnimation()
  },
 
  onShow: function () {
    let height = 0;
    wx.getSystemInfo({
      success: function (res) {
        height += res.windowHeight
      }
    });
    this.animation.translateY(-1 * height * 0.75).step()
    this.setData({ animation: this.animation.export() })
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