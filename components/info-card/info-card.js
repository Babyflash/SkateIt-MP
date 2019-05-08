// components/info-card/info-card.js
Component({
  /**
   * Component properties
   */
  options: {
    multipleSlots: true
  },
  properties: {
    spotObject: {
      type: Object,
      value: ''
    },
      spotImg: {
        type: String,
        value: ''
      },
      id: {
        type: String,
        value: ''
      },
      address: {
        type: String,
        value: ''
      },
      difficulty: {
        type: String,
        value: ''
      },
      type: {
        type: String,
        value: ''
      }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    spot: function () {
      let spot = JSON.stringify(this.properties.spotObject);

      wx.navigateTo({
        url: '/pages/spot/spot?spot=' + spot
      });
    },
    goThere: function(){
      wx.openLocation({
        latitude: 23.362490,
        longitude: 116.715790,
        scale: 18,
        name: '华乾大厦',
        address: '金平区长平路93号'
      })
    },
  }
})
