const db = wx.cloud.database()
const util = require('../../../util/util.js')
const page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
/*    根据点击的模块进入不同的社区模块  */
  getForum: function(value) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    db.collection('ForumList')
      .doc(value)
      .get({
        success: res => {
          this.setData({
            forum: res.data
          })
          wx.hideLoading();
        }
      })
  },
  /*  点击按钮跳转到发布页面 */
  toPublishHandle: function() {
    let id = this.data.forum._id
    wx.redirectTo({
      url: '/pages/Forum/ForumDetails/publishForum/publishForum?id=' + id,
    })
  },
    /*  点击列表跳转到详情页面 */
  toContentHandle: function(e){
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumContent/ForumContent?id=' + id
    })
  },
  /* 查询帖子 */
  getPosts: function (page,isInit, category){
    if (isInit){
      this.page = 0
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getForum',
      data: ({
        page: page,
        lists: 4,
        category: category
      }),
      success: res => {
        wx.hideLoading()
        console.log(res)
        res.result.list.forEach(function (data, index) {
          return data.time = util.formatDate(data.time)
        })
        if (isInit) {
          this.setData({
            forumpost: res.result.list
          })
        } else { 
          this.setData({
            forumpost: this.data.forumpost.concat(res.result.list)
          })}
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getForum(options.id)
    this.getPosts(page,true, options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.page += 1,
    this.getPosts(this.page,false)
  }
})