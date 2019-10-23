const crypto = require('crypto');

// 密匙
const SECRET_KEY = 'YHRMj23h_654g#s12';

// md5加密
function md5(content) {
  const md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

// const testRes = genPassword('123');
// console.log(testRes);

module.exports = {
  genPassword,
};
