const BASE_URL = 'https://skateit.wogengapp.cn/api/v1/';
// const BASE_URL = 'http://localhost:3000/api/v1/';

const myRequest = {
  request(options, httpMethod) {
    wx.request({
      url: BASE_URL + options.path,
      header: {
        'Content-Type': 'application/json',
        'X-User-Email': wx.getStorageSync('userEmail'),
        'X-User-Token': wx.getStorageSync('token')
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