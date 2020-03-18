const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  submitHandle: function() {
    if (!this.data.content || this.data.content.length < 1) {
      console.log('ok')
      wx.showToast({
        title: '请输入反馈信息',
        icon: 'none'
      })
      return false
    }
    db.collection('FeedbackInformation').add({
      data: {
        feedbackContent: this.data.content
      },
      success: () => {
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          success: () => {
            wx.switchTab({
              url: '/pages/Personal/personal',
              fail: err => {
                console.log(err)
              }
            })
          }
        })


      }
    })
  },
  bindContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  }
})