const util = require('../../../../util/util.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setImage:{},
    hideInput:true
  },
  /**
   * 删除帖子
   */
  deleteForum(value,categoryid){
    const that = this
    wx.cloud.callFunction({
      name: 'deleteForum',
      data: ({
        id: value
      }),
      success: res => {
        if (res.result.stats.removed > 0) {
          wx.showToast({
            title: '删除成功',
          })
          wx.redirectTo({
            url: '/pages/Forum/ForumDetails/ForumDetails?id=' + categoryid
          })
        }
      }
    })
  },
  //删除评论
  deleteComment(value,index){
    wx.showLoading({
      title: '删除中',
      mask:true
    })
    const that = this
    wx.cloud.callFunction({
      name: 'deleteComment',
      data: ({
        id: value
      }),
      success: res => {
        if (res.result.stats.removed > 0) {
          wx.hideLoading()
          that.data.commentList.splice(index, 1)
          that.setData({
            commentList: that.data.commentList
          })
          wx.showToast({
            title: '删除成功',
          })
        }
      },
      fail: err =>{
        wx.hideLoading()

      }
    })
  },
  //自适应照片
  imageLoad: function (e) {
    let realwidth = e.detail.width //获取图片真实宽度
    let realheight = e.detail.height //获取图片真实宽度
    let ratio = realwidth / realheight;  //图片的真实宽高比例
    if (realwidth < 670){
      var images = this.data.setImage;
      //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
      images[e.target.dataset.index] = {
        width: realwidth,
        height: realheight
      }
      this.setData({
        setImage: images
      })
    }else{
      const viewWidth = 670 //设置图片显示宽度，左右留有16rpx边距
      let viewHeight = 670 / ratio; //计算的高度值
      let image = this.data.setImage;
      //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
      image[e.target.dataset.index] = {
        width: viewWidth,
        height: viewHeight
      }
      this.setData({
        setImage: image
      })
    }

  },
  //查询id是否存在
  getId(value){
    db.collection('ForumPost').doc(value).get()
    .then( () => {
      this.setData({
        page:true
      })
    })
    .catch( () =>{
      wx.redirectTo({
        url: '/pages/Erreo/nopage/nopage',
      })
    })
  },
  //查询内容
  getContent: function (value){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name:'getForumContent',
      data:({
        id: value
      }),
      success:res => {
        wx.hideLoading()
        res.result.list[0].time = util.formatDate(res.result.list[0].time)
        this.setData({
          ForumContent: res.result.list[0]
        })
      },
      fail: err => {
        wx.hideLoading()
        // wx.navigateTo({
        //   url: '/pages/Erreo/nopage/nopage',
        // })
      }
    })
  },
/**
 * 触摸长按事件
 */
// 帖子删除举报
forumPress(e){
  const that = this
  let postid = e.currentTarget.id
  let categoryid = that.data.ForumContent.category_id
  let userInfo = getApp().globalData.userInfo[0]
  if (userInfo.isManager) {
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        if (res.tapIndex == 0) {
          that.deleteForum(postid, categoryid)
        }
      }
    })
  } else {
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
// 评论删除举报
commentPress(e) {
  const that = this
  let commentid = e.currentTarget.id
  let index = e.currentTarget.dataset.index
  let userInfo = getApp().globalData.userInfo[0]
  if (userInfo.isManager) {
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        if (res.tapIndex == 0) {
          that.deleteComment(commentid, index)
        }
      }
    })
  } else {
    wx.showActionSheet({
      itemList: ['举报'],
      success: res => {
        if (res.tapIndex == 0) {
          db.collection('reportList').add({
            data: {
              report_id: e.currentTarget.id,
              report_tabler: 'ForumComment'
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
/**
 * 点赞实现 
 */

  //1.查询当前帖子用户是否点赞
  getLike(forumId,collectionName,name){
    db.collection(collectionName).where({
      ForumPost_id: forumId,
      _openid: getApp().globalData.openid
    }).get({
      success: res => {
        if(res.data.length == 0){
          this.setData({
            like:false,
            likeImage: '/images/point.png'
          })
        }else{
          this.setData({
            like: true,
            likeImage: '/images/point-active.png'
          })
        }
      }
    })
  },
  //2.查询点赞数
  likeCount(forumId){
    db.collection('ForumLike').where({
      ForumPost_id: forumId
    })
    .get({
      success: res => {
        let number = res.data.length
        this.setData({
          likeCount: number
        })
      }
    })
  },
  //3.点击点赞按钮事件
  likeHandle: function(e){
    const that = this
    if(this.data.like){
      wx.showToast({
        title: '已点赞',
      })
    }else{
      that.setData({
        like: true,
        likeImage: '/images/point-active.png',
        likeCount:this.data.likeCount + 1
      })
      db.collection('ForumLike').add({
        data:{
          ForumPost_id: this.data.ForumContent._id,
          isLike: true
        },
        success: res =>{
          // console.log(res)
        },
        fail: err => {
          // console.log(err)
        }
      })
    }
  },
  /**
   * 收藏实现
   */
  //1.查询当前用户是否收藏
  collect: function (forumId){
    db.collection('ForumCollect').where({
      ForumPost_id: forumId,
      _openid:getApp().globalData.openid
    }).get({
      success:res => {
        if (res.data.length == 0) {
          this.setData({
            Icollect: false,
            collect: false,
            collectImage: '/images/collect.png'
          })
        } else {
          this.setData({
            Icollect: true,
            collect: res.data[0].isCollect,
            collectImage: res.data[0].isCollect ? '/images/collect-active.png' : '/images/collect.png'
          })
        }

      },
      fail:(err) => {
        // console.log(err)
      }
    })
  },
  //2.查询收藏数
  collectCount(forumId) {
    db.collection('ForumCollect').where({
      ForumPost_id: forumId,
      isCollect: true
    })
      .get({
        success: res => {
          this.setData({
            collectCount: res.data.length
          })
        }
      })
  },
  //点击收藏按钮事件
  collectHandle: function (e){
    const that = this
    if(this.data.collect){
      this.setData({
        collect: !this.data.collect,
        collectCount: this.data.collectCount - 1,
        collectImage: '/images/collect.png'
      })
      wx.showToast({
        title: '取消成功',
        icon: 'none'
      })
    }else{
      this.setData({
        collect: !this.data.collect,
        collectCount: this.data.collectCount + 1,
        collectImage: '/images/collect-active.png'
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'none'
      })
    }
    if(this.data.Icollect){
      db.collection('ForumCollect').where({
        ForumPost_id: this.data.ForumContent._id,
        _openid: getApp().globalData.openid
      }).update({
        data:{
          isCollect: that.data.collect
        }
      }).then(res => {
        // console.log(res)
      })
    }else{
      db.collection('ForumCollect').add({
        data:{
          ForumPost_id: this.data.ForumContent._id,
          isCollect:that.data.collect,
        },
        success: () =>{
          this.setData({
            Icollect:true
          })
        }
      })
    }
    
  },
  /**
   * 评论实现
   */
  //查询评论信息
  getCommentLists(forumId){
    const that = this
    wx.cloud.callFunction({
      name: 'getForumComment',
      data: ({
        id: forumId
      }),
      success: res => { 
          res.result.list.forEach(function (data) {
            return data.comment_time = util.formatDate(data.comment_time) 
          }) 
        this.setData({
          commentList: res.result.list
        }) 
      },
      fail: err => {    
        // console.log(err)
      }
    })
  },

  //点击输入框弹出
  hideHandle(){
    this.setData({
      hideInput:false,
      commentText:''
    })
  },
  //获取绑定评论信息
  getComment(e){
    this.setData({
      commentText: e.detail.value.replace(/\s+/g, '')
    })
  },

  //点击取消
  cancelHandle(){
    this.setData({
      hideInput: true,
      commentText:''
    })
  },
  //点击发送
  sureHandle(){
    const that = this
    let commentLists = this.data.commentList
    if(this.data.commentText.length > 0 ){
      db.collection('ForumComment').add({
        data:{
          ForumPost_id: that.data.ForumContent._id,
          comment_time: db.serverDate(),
          content: this.data.commentText
        },
        success: res => {
          this.getCommentLists(this.data.ForumContent._id)
        }
      }) 
      this.setData({
        hideInput: true,
      })
    }else{
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('ForumPost').doc(options.id).get()
      .then(() => {
        this.setData({
          page: true
        })
        this.getId(options.id)
        this.getContent(options.id)
        // 点赞查询与实现
        this.getLike(options.id, 'ForumLike')
        this.likeCount(options.id)
        //收藏查询与实现
        this.collect(options.id)
        this.collectCount(options.id)
        //评论查询与实现
        this.getCommentLists(options.id)
      })
      .catch(() => {
        wx.redirectTo({
          url: '/pages/Erreo/nopage/nopage',
        })
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    
  }
})