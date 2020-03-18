const util = require('../../../util/util.js')
const db = wx.cloud.database()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },
  getUser() {
    const that = this
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  getForum() {
    db.collection('ForumPost')
      .where({
        _openid: getApp().globalData.openid
      })
      .get()
      .then(res => {
        res.data.forEach(data => {
          return data.time = util.formatDate(data.time)
        })
        this.setData({
          forumList: res.data
        })
      })
  },
  getComment() {
    const that = this
    let commentLists = []
    db.collection('ForumComment')
      .where({
        _openid: getApp().globalData.openid
      })
      .orderBy('comment_time', 'desc')
      .get()
      .then(res => {
        res.data.forEach((data, index) => {
          data.comment_time = util.formatDate(data.comment_time)
          let id = data.ForumPost_id
          db.collection('ForumPost').where({
              _id: id
            })
            .get({
              success: res => {
               
                if(res.data.length > 0){
                  var title = res.data[0].title
                }else{
                  var title = ""
                }
                data.forumTitle = title
                commentLists[index] = data
                
                that.setData({
                  commentList: commentLists,
                  commentName: '评论: ',
                  forumName: '原帖: '
                })
              }
            })
        })
      })
  },
  //点击帖子跳转到帖子详情
  fourmListHandle(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumContent/ForumContent?id=' + e.currentTarget.id
    })
  },
  //点击评论列表跳转到帖子详情
  commentHandle(e) {
    let index = e.currentTarget.dataset.index    
    console.log(this.data.commentList[index])
    let id = this.data.commentList[index].ForumPost_id
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumContent/ForumContent?id=' + id
    })
  },
  //删除按钮
  //对帖子数据库进行删除操作
  delForumHandle(e) {
    console.log(e)
    let index = e.target.dataset.index
    let forumId = e.target.id
    const that = this
    wx.showModal({
      title: '确认删除整个帖子？',
      success: (res => {
        if (res.confirm) {
          console.log('用户点击确定')
          that.data.forumList.splice(index, 1)
          wx.showLoading({
            title: '删除中',
          })
          db.collection('ForumPost').doc(forumId).remove()
            .then(() => {
              wx.hideLoading()
              that.setData({
                forumList: that.data.forumList
              })
              wx.showToast({
                title: '删除成功',
              })
            })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
    })
  },
  //对评论数据库进行删除
  deletecomHandle(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let commentid = this.data.commentList[index]._id
    console.log(commentid)
    const that = this
    wx.showModal({
      title: '确认删除整个帖子？',
      success: (res => {
        if (res.confirm) {
          console.log('用户点击确定')
          that.data.commentList.splice(index, 1)
          wx.showLoading({
            title: '删除中',
          })
          db.collection('ForumComment').doc(commentid).remove()
            .then(() => {
              wx.hideLoading()
              that.setData({
                commentList: that.data.commentList
              })
              wx.showToast({
                title: '删除成功',
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
    })
  },
  onLoad: function() {
    var that = this;
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.screenHeight
        });
      }
    })
    this.getForum()
    this.getComment()
    this.getUser()
  },
  //  tab切换逻辑
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
})