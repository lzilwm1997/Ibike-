const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempImg: [],
    cloudPath:[]
  },
  /**
   *设置标题
   * @param {object} e 
   */
  getTitle:function(e){
    if (e.detail.value) {
      this.setData({
        title: e.detail.value
      })
    } else {
      this.setData({
        title: ""
      })
    }    
  },
  /**
   * 检测输入字数
   * @param {object} e 
   */
  textareaCtrl: function(e) {
    if (e.detail.value) {
      this.setData({
        content: e.detail.value
      })
    } else {
      this.setData({
        content: ""
      })
    }
  },
  /**
   * 选择图片
   */
  choosePhoto() {
    let that = this;
    let tempImg = that.data.tempImg;
    if (tempImg.length > 2) {
      return;
    }
    wx.chooseImage({
      count: 3 - tempImg.length, //选择不超过3张照片,去掉当前已经选择的照片
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        tempImg = tempImg.concat(tempFilePaths);
        console.log(tempImg);
        that.setData({
          tempImg
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 删除图片
   */
  removeImg(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    console.log(e);
    let tempImg = self.data.tempImg;
    tempImg.splice(index, 1);
    self.setData({
      tempImg
    })
  },
  /**
   * 插入数据库
  */
  addPost: function(){
    const that = this
    db.collection('ForumPost').add({
      data:{
        category_id: that.data.categoryId,
        content: that.data.content,
        title: that.data.title,
        image: that.data.cloudPath,
<<<<<<< HEAD
        // poster_id: getApp().globalData.openid,
        time: db.serverDate()
      },
      success:(res) => { 
          wx.hideLoading();
=======
        poster_id: getApp().globalData.openid
      },
      success:res => {
        console.log('插入成功')
        that.clearData()
        if(that.data.add){
          
>>>>>>> eff03f0cd7b89798462764e8cb36b0583d820cee
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            success:() =>{
<<<<<<< HEAD
              wx.redirectTo({
                url: '/pages/Forum/ForumDetails/ForumDetails?id=' + that.data.categoryId,
              })
            }
          })    
=======
              wx.navigateTo({
                url: '/pages/Forum/ForumDetails/ForumDetails?id=' + that.data.categoryId,
              })
            }
          })
        }
       
>>>>>>> eff03f0cd7b89798462764e8cb36b0583d820cee
      },
      fail: err =>{
        console.log(err)
        that.messageModle('上传失败，请确认网络环境并重试')
      }
    })
  },
  /**
   * 清空数据
  */
  clearData:function(){
    this.setData({
      tempImg:[],
      cloudPath: [],
      title:"",
      content:"",
      add:true
    })
  },
  /**
   * 上传图片
   */
  uploadImage:function(){
    const that = this
    if(that.data.tempImg.length > 0){
      that.data.tempImg.forEach((currentValue, index) => {
        const filePath = currentValue
        const cloudPath = 'ForumPostImage/publishimage-' + new Date().getTime() + currentValue.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res => {
            console.log(res.fileID)
            that.setData({
              cloudPath: that.data.cloudPath.concat(res.fileID)
            })
            if (that.data.cloudPath.length == that.data.tempImg.length) {
              //对数据进行插入操作
              that.addPost()
            }
          }),
          fail: (err => {
            console.log(err)
            that.messageModle('上传失败，请确认网络环境并重试')
          })
        })
      })
    }else{
      //对数据进行插入操作
      that.addPost()
    }
  },
    /**
   * 错误提示框
   */
  messageModle:function(msg){
    wx.showModal({
      title: '提交失败',
      content: msg,
    })
  },
  
  /**
   * 提交事件
   */
submitPost(e) {
    const that = this
    console.log(that.data)
    //点击取消或确定
    if (e.target.id == "0") {
      wx.showModal({
        title: '取消编辑',
        content: '是否取消编辑，如点击确定将退出该页面',
        success: res => {
          if (res.cancel) {
            console.log('用户点击取消')
          } else if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Forum/ForumDetails/ForumDetails?id=' + that.data.categoryId,
            })
          }
        }
      })
    }else if (e.target.id == "1"){
      if (!that.data.title || that.data.title == ""){
        that.messageModle('抱歉，您尚未输入标题，请输入标题')
        return false;
      }
      if (!that.data.content || that.data.content == ""){
        that.messageModle('抱歉，您尚未输入正文，请输入正文')
        return false;
      }
      //一切正常上传图片成功后将数据插入到数据库中
      console.log('ok')
      wx.showLoading({
        title: '正在发布',
        mask:true
      })
      that.uploadImage()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      categoryId: options.id
    })
  }

})