// pages/addSpot/addSpot.js
let keys = "IFXBZ-M4YWI-DUDG7-5UUEX-Q3J4K-X5FZG"
let address = ''
const AV = require('../../utils/av-weapp-min.js')
const app = getApp()
const myRequest = require('../../lib/api/request');

const distance = (la1, lo1, la2, lo2) => {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  // console.log("计算结果",s)
  return parseInt(s)
}

function uploadToLeanCloud(tempFilePath) {
  new AV.File('file-name', { 
      blob: { 
        uri: tempFilePath, 
      },
    }).save().then(file => console.log(file.url())).catch(console.error); 
}

Page({
  data: {
    customItem: '全部',
    spotImg: '',
    types: ['Ledge', 'Manual pad', 'Rail', 'Stair set', 'Transition', 'handrail'],
    isVisible: true,
    type: '',
    difficulty_rating: '1',
    address: '',
    spotUrl:['https://res.cloudinary.com/doe2rb42f/image/upload/v1557313230/Ledge_yew9or.png', 'https://res.cloudinary.com/doe2rb42f/image/upload/v1557313230/Manual_pad_w4e66v.png', 'https://res.cloudinary.com/doe2rb42f/image/upload/v1557313231/Rail_cxftov.png', 'https://res.cloudinary.com/doe2rb42f/image/upload/v1557313232/Stair_set_yhgqpa.png',
'https://res.cloudinary.com/doe2rb42f/image/upload/v1557313231/Transition_mk55tv.png',
'https://res.cloudinary.com/doe2rb42f/image/upload/v1557313230/handrail_xrgu3e.png' ]
  },

  // handleClose() {
  //   this.setData({
  //     popup1: false,
  //     popup2: false,
  //     popup3: false,
  //     popup4: false,
  //     popup5: false,
  //     popup6: false,
  //   });
  // },
  setDifficulty: function(e){
    this.setData({
      difficulty_rating: e.detail.value
    })
  },
  handleClick1(e) {
    console.log('click event one', e.currentTarget.dataset.id)
    console.log(2134536576879, e.currentTarget.id)
    this.setData({
      type: e.currentTarget.dataset.id,
      spot0: e.currentTarget.id
      });
      console.log(this.data.type)
  },
  onLoad: function (options) {
    let page = this
    wx.chooseImage({
      count: 1, // Default 9
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
        // wx.navigateTo({
        //   url: '/pages/sevan/sevan'
        // });
        wx.redirectTo({
          url: '/pages/sevan/sevan'
        })
      }
    })
  },

  getDistrict(lat, lon){
  const that = this
  
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lon}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.result.address_component.district, res.data.result.address)
        that.setData({
          address: res.data.address
        })
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
    if(that.data.type === ''){
      wx.showToast({
        title: 'Please choose one type',
        icon: 'none',
        image: '',
        duration: 3000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showLoading({
        title: 'Uploading...',
        mask: true
      })

      wx.getLocation({
        success: function (res) {
          that.setData({ userLatitude: res.latitude, userLongitude: res.longitude })
          // that.getDistrict(res.latitude, res.longitude)
          wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${keys}`,
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(6666, res)
              console.log(res.data.result.address_component.district, res.data.result.address)
              that.setData({
                address: res.data.result.address
              })

              that.uploadPromise(that.data.spotImg).then(res => {
                console.log("LEANCLOUND RESULT: ", res)
                that.setData({
                  popup6: true
                })

                let spot = {
                  "spot_rating": 5,
                  "difficulty_rating": that.data.difficulty_rating,
                  "spot_type": that.data.type,
                  "default_image": res,
                  "remote_default_image_url": res,
                  "user_id": app.globalData.currentUserId,
                  "geo_lat": that.data.userLatitude,
                  "geo_lng": that.data.userLongitude,
                  "address": that.data.address
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
                    spot["createdUserUrl"] = getApp().globalData.userInfo.avatarUrl
                    let dist = distance(that.data.userLatitude, that.data.userLongitude, spot.geo_lat, spot.geo_lng)
                    spot["distance"] = dist

                    console.log("ADDED SPOT", spot)
                    myRequest.get({
                      path: 'spots',
                      success(res) {
                        app.globalData.spotTypes = res.data
                        console.log('ALL SPOTS RESPONSE SAVE INTO GLOBALDATA', res.data)
                      }
                    })
                    // getApp().globalData.spotTypes[spot.spot_type].push(spot)
                    // wx.navigateTo({
                    //   url: '/pages/spot/spot?spot=' + JSON.stringify(spot)
                    //   // url: '/pages/servan/sevan'
                    // });
                    wx.redirectTo({
                      url: '/pages/spot/spot?spot=' + JSON.stringify(spot)
                    })

                  },
                  fail: err => {
                    wx.hideLoading();
                    wx.showToast({
                      title: 'Failed, check internet connection!',
                      duration: 3000,
                      icon: 'none'
                    })
                  }
                })
              }).catch(e => {
                wx.hideLoading();
                wx.showToast({
                  title: 'Failed, check internet connection!',
                  duration: 3000,
                  icon: 'none'
                })
              })
            }
          })
        },

      })
    }
  
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