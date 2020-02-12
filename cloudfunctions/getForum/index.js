// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const $ = db.command.aggregate
function getList(lists, page, category) {
  return new Promise((resolve, reject) => {
    db.collection('ForumPost').aggregate()
      .lookup({
        from: 'Users',
        localField: '_openid',
        foreignField: 'userID',
        as: 'user',
      })
      .match({
        category_id: category
      })
      .sort({time:-1})
      .skip(page * lists)
      .limit(lists)
      .end()
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { lists, page, category} = event
  let data = await getList(lists, page, category)
  return data
}