const postsData = require('./posts');
const commentsData = require('./comments');
const registerData = require('./register');
const managerData = require('./managers');
const VerificationCode = require('./VerificationCode');


module.exports = {
  posts: postsData,
  comments: commentsData,
  register: registerData,
  managers: managerData,
  VerificationCode: VerificationCode
};
