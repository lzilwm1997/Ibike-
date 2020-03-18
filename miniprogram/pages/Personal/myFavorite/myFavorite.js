const db = wx.cloud.database()
const util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: ["/images/icon-1.png", "/images/icon-2.png"],
    user:[],
    favoriteList:[]
  },

  getForum(){
    const that = this
    wx.cloud.callFunction({
      name:'getMyfavorite',
      data:{
        postid: getApp().globalData.openid
      }
    })
    .then(res => {
      console.log(res)
      res.result.list.forEach((data,index) =>  {
        if (data.forum.length > 0){
          return data.forum[0].time = util.formatDate(data.forum[0].time)
        }
      })
      that.setData({
        favoriteList: res.result.list,
        end: "已无更多收藏"
      })
    })
  },
  
  /**
   * 点击跳转详情
   */
  listHandle(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/Forum/ForumDetails/ForumContent/ForumContent?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getForum()
  }
})