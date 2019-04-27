const BASE_URL = 'http://localhost:3000/api/v1/';

const myRequest = {
  request(options, httpMethod) {
    //get token from storage
    // let user = wx.getStorageSync('userInfo')

    wx.request({
      url: BASE_URL + options.path,
      header: {
        'Content-Type': 'application/json'
        // 'X-YOURAPP-Token': user
      },
      data: options.data,
      method: httpMethod,
      success: options.success
    })
  },
  post(options) {
    this.request(options, 'POST')
  },
  get(options) {
    this.request(options, 'GET')
  },
  put(options) {
    this.request(options, 'PUT')
  },
  delete(options) {
    this.request(options, 'DELETE')
  }
}
module.exports = myRequest;