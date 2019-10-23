const xss = require('xss');
const { exec, escape } = require('../db/mysql');

const getList = async (author, keyword) => {
  /* 获取数据库博客列表 */
  // keyword = escape(`%${keyword}%`);

  let sql = 'select * from blogs where 1=1 ';
  if (author) {
    author = escape(author);
    sql += `and author=${author} `;
  }
  if (keyword) {
    keyword = escape(`%${keyword}%`);
    sql += `and title like ${keyword} `;
  }
  sql += 'order by ctime desc;';
  // console.log(sql);
  return await exec(sql);
};


const getDetail = async (articleId) => {
  const id = escape(articleId);
  const sql = `select * from blogs where id=${id};`;
  //return exec(sql).then((rows) => rows[0]);
  const rows = await exec(sql)
  return rows[0]
};


const newBlog = async (blogdata) => {
  /* blogdata 是个博客对象， 包含title， content ctime等属性 */
  let { title, content, author } = blogdata;
  const ctime = Date.now();
  // 预防xss攻击
  title = xss(title);
  content = xss(content);
  author = xss(author);
  // 预防sql注入
  title = escape(title);
  content = escape(content);
  author = escape(author);

  const sql = `
      insert into blogs (title, content, author, ctime)
      values (${title}, ${content}, ${author}, ${ctime});
  `;
  //return exec(sql).then((insertData) => ({
  //  // console.log('insertData is :\n', insertData);
  //  id: insertData.insertId,
  //}));
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
};

const updateBlog = async (articleId, blogdata) => {
  /*
   * id 是更新博客的id
   * blogdata 是个博客对象， 包含title， content ctime等属性 */
  let { title, content, author } = blogdata;
  // 预防xss攻击
  title = xss(title);
  content = xss(content);
  author = xss(author);
  // 预防sql注入
  title = escape(title);
  content = escape(content);
  author = escape(author);
  const id = escape(articleId);

  const sql = `
    update blogs set title=${title}, content=${content} where id=${id} and author=${author};
  `;

  //return exec(sql).then((updateData) => {
  //  // console.log('update data is : \n', updateData);
  //  if (updateData.affectedRows > 0) {
  //    return true;
  //  }
  //  return false;
  //});
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
};

const delBlog = async (articleId, blogdata) => {
  /* id: 要删除的博客的id */
  let { author } = blogdata;
  author = escape(author);
  const id = escape(articleId);

  const sql = `
    delete from blogs where id=${id} and author=${author};
  `;
  //return exec(sql).then((delData) => {
  //  // console.log('delData data is : \n', delData);
  //  if (delData.affectedRows > 0) {
  //    return true;
  //  }
  //  return false;
  //});

  const delData = await exec(sql)
  if (delData.affectedRows > 0) {
    return true;
  }
  return false;
};


module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
