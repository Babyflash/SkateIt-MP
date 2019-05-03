// components/post/post.js
Component({
  /**
   * Component properties
   */
  properties: {
    
  },

  /**
   * Component initial data
   */
  data: {
    imgs: [],
    comment: "",
    bClearPhoto: true,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  /**
   * Component methods
   */
  methods: {

    selectImg: function () {
      wx.chooseImage({
        count: 9, // Default 9
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          
          this.setData({
            imgs: res.tempFilePaths
          })
          console.log(tempFilePaths)
          var tempFilePaths = res.tempFilePaths
          // if (res.tempFilePaths.count < 9) {
            
          // // bClearPhoto = true;
          // }
          // else {
          //   wx.showToast({
          //     title: 'You can upload maximium 9 images!',
          //     icon: 'none',
          //     duration: 2000
          //   });
          // }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  created: function () {
    console.log("created");
  },

  attached: function () {

  },

  ready: function () {
    this.setData({
      imgs: []
    })
    console.log("ready");
  }
})
