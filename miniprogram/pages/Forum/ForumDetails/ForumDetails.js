const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //根据点击的模块进入不同的社区模块
  getForum:function(value){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    db.collection('ForumList')
      .doc(value)
    .get({
      success:res => {
        this.setData({
          forum: res.data
        })
        wx.hideLoading();
      }
    })
  },
  //点击按钮跳转到发布页面
  toPublishHandle:function(){
    let id = this.data.forum._id
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/publishForum/publishForum?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getForum(options.id)

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