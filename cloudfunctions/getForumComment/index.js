const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const $ = db.command.aggregate
function getContent(id) {
  return new Promise((resolve, reject) => {
    db.collection('ForumComment').aggregate()
      .sort({ comment_time: -1 })
      .lookup({
        from: 'Users',
        localField: '_openid',
        foreignField: 'userID',
        as: 'user',
      })
      .lookup({
        from: 'commentLike',
        localField: '_id',
        foreignField: 'comment_id',
        as: 'commentLike',
      })
      .match({
        ForumPost_id: id
      })
      .end()
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { id } = event
  let data = await getContent(id )
  return data
}