const app = getApp();
let userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  bindGetUserInfo: function(e) {
    //需要使用openID识别身份
    wx.cloud.callFunction({
      name:"login",
      data:{},
      success: res => {
        //openid识别用户的唯一标识
        e.detail.userInfo.openid= res.result.wxInfo.OPENID
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
          userInfo: e.detail.userInfo
        })
        wx.setStorageSync("userinfo", e.detail.userInfo)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})