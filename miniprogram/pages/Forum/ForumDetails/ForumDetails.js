const db = wx.cloud.database()
const util = require('../../../util/util.js')
const page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
/**
 * 删除帖子
 */
  deletePost(postid,index){
  const that = this
  wx.cloud.callFunction({
    name:'deleteForum',
    data: ({
      id: postid
    }),
    success:res => {
      if (res.result.stats.removed > 0){
        that.data.forumpost.splice(index,1)
        that.setData({
          forumpost: that.data.forumpost
        })
        wx.showToast({
          title: '删除成功',
        })
      }
    }
  })
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
          wx.hideLoading();
          this.setData({
            forum: res.data
          }) 
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
    // console.log(e)
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumContent/ForumContent?id=' + id
    })
  },
  /**
   * 触摸事件
   */
  pressHandle(e){
    const that = this
    let postid = e.currentTarget.id
    let index = e.currentTarget.dataset.index
    let userInfo = getApp().globalData.userInfo[0]
    if (userInfo.isManager){
      wx.showActionSheet({
        itemList: ['删除'],
        success: res => {
          if (res.tapIndex == 0){
            that.deletePost(postid, index)
          }
        }
      })
    }else{
      wx.showActionSheet({
        itemList: ['举报'],
        success: res => {
          if (res.tapIndex == 0) {
            db.collection('reportList').add({
              data: {
                report_id: e.currentTarget.id,
                report_tabler: 'ForumPost'
              }
            })
              .then(res => {
                wx.showToast({
                  title: '举报成功',
                })
              })
          }
        }
      })
    }
   
  },
  /* 查询帖子 */
  getPosts: function (page,isInit, value){
    if (isInit){
      this.page = 0
    }
    wx.cloud.callFunction({
      name: 'getForum',
      data: ({
        page: page,
        lists: 4,
        category: value
      }),
      success: res => {
        if (res.result.list.length == 0){
          wx.showToast({
            title: '全部加载完成',
            icon:'success'
          })
        }else{
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
            })
          }
        }
      },
      fail: err => {
        // console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getForum(options.id)
    let category_id = options.id
    this.getPosts(page, true, category_id)
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
    this.getPosts(page, true, this.data.forum._id)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.page += 1,
    this.getPosts(this.page, false, this.data.forum._id)
  }
})