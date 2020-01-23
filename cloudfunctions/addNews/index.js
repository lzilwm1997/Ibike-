// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const serverDate = db.serverDate
// 云函数入口函数
exports.main = async (event, context) => {
  let{ title,author,content,image,category } = event
  return await db.collection('News').add({
    data:
    {
      article_title: title,
      author: author,
      publishDate: serverDate(),
      content: content,
      image: image,
      //类别：热点快报,装备资讯,骑行游记,单车美女
      category: category,
      count: 0
    }

  })

}