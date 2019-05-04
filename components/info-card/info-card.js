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

      // console.log(spot)
      // const id = spot.id
      // const type = spot.spot_type
      // const difficulty = spot.difficulty_rating
      // const img = spot.default_image.url

      // const address = this.properties.address
      wx.navigateTo({
        url: '/pages/spot/spot?spot=' + spot
      });
    }
  }
})
