const app = getApp()
const myRequest = require('../../lib/api/request');

function chooseImg() {
  new Promise(function (resolve, reject) {
    
  });

  wx.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      return res.tempFilePaths
    }
  })

  // return tempFilePaths
}

function uploadImgPromise(tempFilePath) {
  return new Promise((resolve, reject) => {
    new AV.File('file-name', {
      blob: {
        uri: tempFilePath,
      },
    }).save().then(file => resolve(file.url())).catch(e => reject(e));
  }) 
}

function uploadPictures() {
  wx.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      var tempFilePaths = res.tempFilePaths

      uploadImgPromise(tempFilePaths[0]).then(res => {
        that.setData({
          popup6: true
        })
        console.log("Result: ", res)
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
          }
        })

      })
    }
  })
}

module.exports = chooseImg;