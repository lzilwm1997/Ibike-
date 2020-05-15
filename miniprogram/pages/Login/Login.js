const db = wx.cloud.database()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },
  getOpenId: function() {
    const that = this
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        // console.log(res.result.wxInfo.OPENID)
        getApp().globalData.openid = res.result.wxInfo.OPENID
        console.log(res)
        // console.log(getApp().globalData.openid)
        that.queryUsreInfo()
      }

    })
  },
  onLoad: function() {
    //将openid设置到全局变量
    this.getOpenId();
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权过
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                isHide: false
              })
              wx.switchTab({
                url: '/pages/NewsInformation/news'
              })
            }
          });
        } else {
          that.setData({
            isHide: true
          })
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      // console.log(getApp().globalData.openid)
      // console.log(e.detail.userInfo)
      //用户按了允许授权按钮
      var that = this;
      //用户第一次授权需要将数据插入数据库
      if (that.data.length < 1) {
        wx.cloud.callFunction({
          name: 'addUser',
          data: {
            openid: getApp().globalData.openid,
            nickName: e.detail.userInfo.nickName,
            avatarUrl: e.detail.userInfo.avatarUrl,
            province: e.detail.userInfo.province,
            city: e.detail.userInfo.city
          },
          success: function(res) {
            //从数据库获取用户信息
            // console.log("插入小程序登录用户信息成功！");
            that.setData({
              isHide: false
            })
            wx.switchTab({
              url: '/pages/NewsInformation/news'
            })
          }
        })
      } else {
        that.setData({
          isHide: false
        })
        wx.switchTab({
          url: '/pages/NewsInformation/news'
        })
      }
      //授权成功后，跳转进入小程序首页

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  // 查询用户信息，查看数据库中是否存在此用户
  queryUsreInfo: function() {
    db.collection('Users')
      .where({
        userID: getApp().globalData.openid
      })
      .get({
        success: res => {
          this.setData({
            length: res.data.length
          })
          // console.log(this.data.length)
          getApp().globalData.userInfo = res.data
        }
      })
  },

})