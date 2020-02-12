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
  let { nickName, avatarUrl, province, city, openid } = event
  return await db.collection('Users').add({
    data:
    {
      nickName: nickName,
      avatarUrl: avatarUrl,
      province: province,
      city: city,
      userID: openid,
      //类别：热点快报,装备资讯,骑行游记,单车美女
      isManager:false,
    }

  })

}