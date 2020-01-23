var WxParse = require('../../../wxParse/wxParse.js');
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    //通过最新资料的id查询点击的详情页面
    this.setData({
      id: options.id
    })
    //更新点击量
    wx.cloud.callFunction({
      name:'updateCount',
      data:{
        id:that.data.id
      }
    })
    // .then(that.setData({}))

    //查询详情页的内容
    db.collection('News').doc(options.id).get({
        success: res => {
          this.setData({
            latestDetail: res.data
          })
          var article = that.data.latestDetail.content
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      })
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