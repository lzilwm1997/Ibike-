const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getForumList:function(){
    wx.showLoading({
      title: '加载中',
    })
    db.collection('ForumList')
    .get({
      success: res => {
        this.setData({
          forumList:res.data
        })
        wx.hideLoading();
      }
    })
  },
  //点击跳转
  forumHandle: function(e) {
    // console.log(e)
    let id = e.currentTarget.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumDetails?id='+ id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getForumList();
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