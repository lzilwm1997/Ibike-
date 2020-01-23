const util = require('../../util/util.js')
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [
      '/images/news.png',
      '/images/dynamic.png',
      '/images/news.png',
      '/images/news.png',
    ],
    swiperCurrent: 0,
    navList: [
      { icon: '/images/icon-1.png', events: 'icoRotHandle', text: '热点快报' },
      { icon: '/images/icon-2.png', events: 'icoRotHandle', text: '装备资讯' },
      { icon: '/images/icon-3.png', events: 'icoRotHandle', text: '骑行游记' },
      { icon: '/images/icon-4.png', events: 'icoRotHandle', text: '单车美女' },

    ]
  },

  //轮播图设置
  swiperChange: function (e) {
    //console.log(e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //icon导航事件
  icoRotHandle: function (e) {
    let num = e.currentTarget.dataset.index
    var cate = this.data.navList[num].text
    wx.navigateTo({
      url: "/pages/NewsInformation/iconHot/iconHot?category="+ cate
    })
  },

  //轮播图跳转详情页面
  swiperdetailHandle: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/NewsInformation/detail/detail?id=' + id,
    })
  },
  getswiperList: function(){
    db.collection('News')
      .orderBy('count', 'desc')
      .limit(4)
      .get({
        success: res => {
          this.setData({
            swiperList: res.data
          })
        }

      })
  },
  //最新资讯跳转详情页面
  latestNewsHandle: function (e){
    // console.log(e)
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/NewsInformation/detail/detail?id='+id,
    })
  },
  //查询最新列表
  getlatestNews: function (isInit) {
    const pages = 4
    if(isInit){
      this.page = 0
    }
    wx.showLoading({
      title: '加载中',
    })
    // console.log(this.page)
    db.collection('News')
      .orderBy('publishDate', 'desc')
      .skip(this.page * pages)
      .limit(pages)
      .get({
        success: res => {
          res.data.forEach(function (data, index) {
            return data.publishDate = util.formatDate(data.publishDate, 'MM-DD')        
          })
          if (isInit){
            this.setData({
              latestNews: res.data
            })
          }else{
            this.setData({
              latestNews: this.data.latestNews.concat(res.data)
            })
          }
          wx.stopPullDownRefresh()
          wx.hideLoading()
        }
        
      }
      )
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // this.page = 0
      //轮播图显示
    this.getswiperList();
     //最新资讯查询
    this.getlatestNews(true);

    
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
    // this.data = 0
    // console.log(this.data)
    this.getlatestNews(true);
    this.getswiperList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.page += 1,
    // console.log(this.page)
    this.getlatestNews(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})