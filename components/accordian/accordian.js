// components/accordian/accordian.js
Component({
  /**
   * Component properties
   */
  properties: {
      visible: {
        type: Boolean,
        value: getApp().globalData.click
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
  ready: function() {
    console.log('moved')
  },
  methods: {
    
  }
})
