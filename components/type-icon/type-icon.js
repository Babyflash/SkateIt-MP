// components/type-icon/type-icon.js
Component({
  /**
   * Component properties
   */
  properties: {
    image: {
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
    isClicked: false

  },

  /**
   * Component methods
   */
  methods: {
    active: function(e) {
      this.setData({
        isClicked: !this.data.isClicked
      })
    }
  }
})
