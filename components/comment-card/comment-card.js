// components/comment-card/comment-card.js
Component({
  /**
   * Component properties
   */
  options: {
    multipleSlots: true
  },
  properties: {
    avatar: {
      type: String,
      value: ''
    },
    time: {
      type: String,
      value: ''
    },
    newTime: {
      type: String,
      value: ''
    },
     test: {
      type: String,
      value: 'test paul'
    }


  },
  onShow: function(){

  },
  /**
   * Component initial data
   */
  data: {
    timeAgo: 'this is data'
  },

  /**
   * Component methods
   */
  // created: function () {
  //   const newtime = new Date(this.properties.time)
  //   console.log('time------------- --------', newtime)
  //   // console.log(this.time(newtime))
  //   console.log(this.time(newtime))
  //   console.log(this.data.timeAgo)
  //   // console.log(this.properties.newtime)
  // },
  methods: {
    test: function(){
      console.log('test works')
    },
    time: function (date) {
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.abs(Math.floor(seconds)) + " seconds";
    }
  }
})
