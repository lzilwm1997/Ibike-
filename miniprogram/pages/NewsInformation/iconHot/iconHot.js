var util = require('../../../util/util.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInit:true
  },
  getIconList: function (title,isInit) {
    const that = this
    const pages = 7
    if (isInit) {
      this.page = 0
    }
    wx.showLoading({
      title: '加载中',
    })
    const iconTitle = title
    db.collection('News').where({
      category: title
    })
    .orderBy('publishDate', 'desc')
    .skip(this.page * pages)
    .limit(6)
    .get({
      success: res => {
        wx.hideLoading();
        if (res.data.length <= 0) {
          wx.showToast({
            title: '全部加载完毕',
            icon: 'success'
          })
          return false
        }
        console.log(res)
        res.data.forEach(function (data, index) {
          // console.log(util.formatDate(data.publishDate, 'MM-DD'))
          return data.publishDate = util.formatDate(data.publishDate, 'MM-DD')
        })
        // console.log(res.data)
        // this.setData({
        //   list: res.data,
        //   icon_title: iconTitle
        // })
        if (isInit) {
          this.setData({
            list: res.data,
            icon_title: iconTitle
          })
        } else {
          this.setData({
            latestNews: this.data.list.concat(res.data),
            // icon_title: iconTitle
          })
        }
        wx.stopPullDownRefresh()
      }
    })},

  listNavHandle: function(e) {
   
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/NewsInformation/detail/detail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIconList(options.category,true)
    // console.log(options.category)
    
    // const that = this
    // wx.showLoading({
    //   title: '加载中',
    // })
    // const iconTitle = options.category
    // db.collection('News').where({
    //   category: options.category
    // }).get({
    //   success: res => {
    //     res.data.forEach(function(data,index){
    //       // console.log(util.formatDate(data.publishDate, 'MM-DD'))
    //      return data.publishDate = util.formatDate(data.publishDate, 'MM-DD')
    //     })
    //     console.log(res.data)
    //     this.setData({
    //       list: res.data,
    //       icon_title: iconTitle 
    //     })
        
    //     wx.hideLoading();
    //   }
    // })
   
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
    console.log('123')
    this.getIconList(this.data.icon_title,true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.page += 1,
  
    this.getIconList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})