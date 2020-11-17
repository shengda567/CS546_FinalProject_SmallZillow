const postsData = require('./posts');
const usersData = require('./users');
const commentsData = require('./comments');
const registerData = require('./register');

module.exports = {
  users: usersData,
  posts: postsData,
  comments: commentsData,
  register: registerData
};
