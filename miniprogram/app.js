
//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        env: 'i-bike-n0wy9',
        traceUser: true,
      })
    }
    const userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }

    this.globalData = {}
  }
})
