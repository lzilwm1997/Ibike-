const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getUser:function(){
    const that = this
   db.collection('Users').where({
     userID: app.globalData.openid
   })
   .get({
     success: res => {
       that.setData({
         userInfo:res.data[0]
       })
     }
   })
  },
  onLoad: function (options) {
    this.getUser();
  }
})