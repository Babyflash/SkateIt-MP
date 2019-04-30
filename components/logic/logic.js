// components/logic/logic.js
Component({
  /**
   * Component properties
   */
  properties: {
    spotTypes: {
      type: Object,
      value: ''
    },
    spotImg: {
      type: String,
      value: ''
    }
  },
  /**
   * Component initial data
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    scrollTop: 100

  },

  /**
   * Component methods
   */
  created: function () {
    console.log('Logic Component')
  },
  methods: {
    spot: function (object) {
      const data = object.currentTarget.dataset;
      console.log(data.id)
      const id = data.id.id
      console.log(id)
      console.log(data.id.spot_type)
      const type = data.id.spot_type
      const url = data.id.default_image.url
      const address = data.id.address
      console.log(address)
      wx.navigateTo({
        url: '/pages/spot/spot?id=' + id + '&type=' + type + '&url=' + url + '&address=' + address
      });
    }
  }
})
