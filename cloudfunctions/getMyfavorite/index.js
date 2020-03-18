// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const $ = db.command.aggregate
function getList(postid) {
  return new Promise((resolve, reject) => {
    db.collection('ForumCollect').aggregate()
      .match({
        isCollect: true,
        _openid: postid
      })
      .lookup({
        from: 'ForumPost',
        localField: 'ForumPost_id',
        foreignField: '_id',
        as: 'forum',
      })
      .sort({time:-1})
      .end()
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { postid } = event
  let data = await getList(postid)
  return data
}