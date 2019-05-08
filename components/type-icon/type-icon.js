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
    },
    info: {
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
  // active: function (e) {
  //   var that = this;
  //   this.triggerEvent('myevent') //myevent自定义名称事件，父组件中使用
  //   that.setData({
  //     isClicked: !this.data.isClicked
  //   })
  // },
  /**
   * Component methods
   */
  methods: {
    active: function (e) {
      let that = this;
      console.log('from child', this.properties.info)
      this.triggerEvent('icon{{this.properties.info}}') //myevent自定义名称事件，父组件中使用
      that.setData({
        isClicked: !this.data.isClicked
      })
    },
  }
})
