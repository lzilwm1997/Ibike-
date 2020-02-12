const util = require('../../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setImage:{}
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
  //查询内容
  getContent: function(value){
    wx.cloud.callFunction({
      name:'getForumContent',
      data:({
        id: value
      }),
      success:res => {
        res.result.list[0].time = util.formatDate(res.result.list[0].time)
        this.setData({
          ForumContent: res.result.list[0],
          identity:'楼主：'
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContent(options.id)
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