// components/post/post.js
const app = getApp()
const AV = require('../../utils/av-weapp-min.js')
const myRequest = require('../../lib/api/request');

Component({
  properties: {
    spot: {
      type: Object,
      value: ''
    },
  },

  data: {
    imgs: [],
    comment: "",
    bHiddenClearPhoto: true,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    spotId: 1,
    userAvatarUrl: app.globalData.userAvatarUrl,
    postInput: "",
    userName: app.globalData.nickName,
    focus: false
  },

  

  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * Component methods
   */
  methods: {
    handleFocus() {
      this.setData({
        focus: !this.data.focus,
      });
    },
    iChange(e) {
      console.log('BICHEED L BN', e.detail.value);
      var that = this;
      that.setData({ postInput: e.detail.value })
    },
    
    cancelBut: function (e) {
      var that = this;
      var myEventDetail = { pickerShow: false, type: 'cancel' } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
      that.setData({
        yes: "true"
      })
    },
    cancelWindow: function () {
      var that = this;
      that.clearPhotos();
      that.cancelBut();
    },

    uploadPhotos: function () {
      var that = this;

      wx.showLoading({
        title: 'Uploading...',
        mask: true
      })

      const checkImage = (path) =>{
        console.log(333, path)
        return new Promise((resolve, reject) => {
          new AV.File('file-name', {
            blob: {
              uri: path,
            },
          }).save()
          .then((file) => {
            console.log(444,file.url())
            return resolve(file.url())
          })
          .catch((e) => {
            console.log(666, e) 
            reject(e)
          });
        });}

      const loadImg = (paths) => {
        console.log(paths)
        return Promise.all(paths.map(checkImage))
      }

      let res = loadImg(that.data.imgs).then(result => {
        console.log("IMAGE ALL PROMISES RESULT=", result)

        let post = {
          "description": that.data.postInput,
          "user_id": app.globalData.currentUserId,
          "spot_id": that.data.spotId,
          "content": result
        }

        myRequest.post({
          header: {
            'Content-Type': 'application/json',
            'X-User-Email': wx.getStorageSync('userEmail'),
            'X-User-Token': wx.getStorageSync('token')
          },
          path: `spots/${that.data.spotId}/posts`,
          data: post,
          success(res) {
            wx.hideLoading();
            that.data.imgs = []
            that.clearPhotos();
            console.log("CREATE POST RESULT:", res)
            that.cancelBut();
          },
          fail: function (res) {
            wx.hideLoading();
            that.data.imgs = []
            console.log(res.data);
            console.log('failed!' + res.statusCode);
          }
        })
      })
      .catch((err) => {
        console.log("RESULT ERROR =", err)
        wx.hideLoading();
        that.data.imgs = []
        console.log(res.data);
        console.log('failed!' + res.statusCode);
      })

      setTimeout(function () {
        console.log("Promise log: ", res)
      }, 1000 * 60);
      
    },

    clearPhotos: function () {
      var that = this;
      that.setData({
        imgs: [],
        bHiddenClearPhoto: true
      })
    },

    selectImg: function () {
      var that = this;
      wx.chooseImage({
        count: 9, // Default 9
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          
          if (tempFilePaths.length < 9) {
            that.setData({
              imgs: tempFilePaths,
              bHiddenClearPhoto: false
            })
          }
          else {
            wx.showToast({
              title: 'You can upload maximium 9 images!',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  created: function () {
    
  },

  attached: function () {

  },

 
  ready: function () {
    console.log("USER AVATAR: ", app.globalData.user.name)
    const spot = this.properties.spot
    console.log("---created---", this.properties.spot.id);
    this.setData({
      imgs: [],
      spotId: spot.id,
      userAvatarUrl: app.globalData.userAvatarUrl,
      userName: app.globalData.user.name
    })
    
    console.log("ready");
  }
})
