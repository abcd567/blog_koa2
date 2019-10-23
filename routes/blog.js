const router = require('koa-router')()
const {
  getList, getDetail, newBlog, updateBlog, delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middlewares/loginCheck');

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';

  if (ctx.query.isadmin) {
    console.log('is admin')
    // 管理员界面
    if (ctx.session.username === null) {
      console.error('is admin, but no login')
      // 未登录
      ctx.body = new ErrorModel('未登录')
      return;
    }
    // 强制查询自己的博客
    author = ctx.session.username;
  }

  const listdata = await getList(author, keyword);
  ctx.body = new SuccessModel(listdata)
})

router.get('/detail', async function (ctx, next) {
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username;
  const data = await newBlog(body);
  ctx.body = new SuccessModel(data, '博客新建成功')
})

router.post('/update', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username;
  const val = updateBlog(ctx.query.id, body);
  if (val) {
    ctx.body = new SuccessModel('博客更新成功')
  } else {
    ctx.body = new ErrorModel('博客更新失败')
  }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username;

  const val = delBlog(ctx.query.id, body);
  if (val) {
    ctx.body = new SuccessModel('博客删除成功')
  } else {
    ctx.body = new ErrorModel('博客删除失败')
  }
})

module.exports = router
