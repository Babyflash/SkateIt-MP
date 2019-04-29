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
    nextMargin: 0

  },

  /**
   * Component methods
   */
  created: function () {
    console.log('Logic Component')
  },
  methods: {
    

  }
})
