// components/accordian/accordian.js
Component({
  /**
   * Component properties
   */
  options: {
    multipleSlots: true
  },
  properties: {
      visible: {
        type: Boolean,
        value: getApp().globalData.click
      },
      show: Boolean
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
