import WxValidate from '../../../util/WxValidate.js';
const db = wx.cloud.database()
const serverDate = db.serverDate
Page({
  data: {
    bottom: 0,
    _focus: false, 
    // 热点快报, 装备资讯, 骑行游记, 单车美女
    categoryList: [
      { value: '热点快报' },
      { value: '装备资讯' },
      { value: '骑行游记' },
      { value: '单车美女' },
     ]
  },
  addNews(){
    const that = this
    wx.showLoading({
      title: '发布中',
    })
    wx.cloud.callFunction({
      name: 'addNews',
      data: {
        title: that.data.title,
        author: that.data.author,
        category: that.data.category,
        content: that.data.content,
        image: that.data.image
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 200
        })
        that.setData({
          title: null,
          author: null,
          category: null,
          content: null,
          image: null,
          coverImg: null,
        })
        that.clear()
      }
    })
  },
 /**
   * 表单验证规则
   */
  initValidate(){
    let rules = {
      title:{
        required: true,
        maxlength: 50
      },
      author:{
        required: true,
        maxlength: 10
      },
      category:{
        required: true,
        categoryList:true
      }
    }
      let messages = {
      title: {
        required: '文章标题不能为空，请输入文章标题',
        maxlength: '输入的标题不能超过50字，请重新输入文章标题'
      },
      author: {
        required: '文章作者不能为空，请输入文章作者',
        maxlength: '输入的作者不能超过10个字符，请重新输入文章作者'
      },
        category: {
          required: '必须勾选文章分类，确认是否勾选',
        }
    }
    this.WxValidate = new WxValidate(rules, messages);
    // 自定义验证规则
    this.WxValidate.addMethod('category', (value, param) => {
    return this.WxValidate.optional(value) || (value.length >=1)
    }, '请勾选页面分类')
    this.WxValidate.addMethod('content', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 1)
    }, '请输入文章内容')
  },
   /**
   * 插入清除封面
   */
  choseCoverimgHandle(e){
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'NewsImages/newsCover-' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        that.setData({
          coverImg: { "coverimgSrc": filePath, "coverCloudSrc": cloudPath }
        })
        console.log(that.data)
      },
      fail: function(res) {
       console.log(res)
      },
      complete: function(res) {},
    })
  },
  clearImgHandle(){
    this.setData({
      coverImg:null
    })
  },
   /**
   * 提交表单
   */
  //失败提示框
  showModal(error) {
    wx.showModal({
      title: '发布失败',
      content:error.msg
    })
  },
  //点击提交事件
  formSubmit(e) {
   const that = this
    const params = e.detail.value
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
        //表单元素验证不通过，此处给出相应提示
        const error = this.WxValidate.errorList[0];
        this.showModal(error)
      return false
    }
    if (this.data.coverImg == null){
      wx.showModal({
        title: '发布失败',
        content:'请插入文章封面'
      })
      return false
    }
    this.editorCtx.getContents({
      success(res) {
        if(res.text.length<3){
          wx.showModal({
            title: '发布失败',
            content: '请输入大于3个字符的文章内容'
          })
          return false
        }
        console.log(res)
        wx.showLoading({
          title: '处理中',
          mask:true
        })
        that.setData({
          content:res.html
        })
      }
    })
    console.log('ok')
    wx.hideLoading();
    //验证成功，上传封面
    const cloudPath = this.data.coverImg.coverCloudSrc
    const filePath = this.data.coverImg.coverimgSrc
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('上传成功')
        that.setData({
          image: res.fileID,
          title: params.title,
          author: params.author,
          category: params.category,
        })
        that.addNews();
      },
      fail: res => {
        console.log(res)
      }
    })
  },
 
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    this.initValidate();
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    console.log(e.target.dataset);
    if (!name) return
    console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '插入中',
        })
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'uploadNews/news-' + new Date().getTime()+filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success:res => {
            console.log(res.fileID)
            that.editorCtx.insertImage({
              src: res.fileID,
              data: {
              },
              width: '100%',
              success: function (res) {
               console.log(res)
                wx.hideLoading();
              },
              fail: function (res) {
                console.log(res)
                console.log('insert image fail')
              }
            })
          }
           
        })

        console.log(res)
      }
    })

  }
})
