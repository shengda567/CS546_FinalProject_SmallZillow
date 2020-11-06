const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const comments = data.comments;
const posts = data.posts;
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  let user1 = await users.addUser(
    'Josh',
    'Woodward',
    'josh@gmail.com',
    'password',
    'male',
    'hoboken',
    'NJ',
    '03/25/1997',
    '10/10/2020',
    '909-655-7823',
    [],
    [],
    []
  );
  console.log("success!!!!!")

  let post1 = await posts.addPost(
    user1._id,
    'Hello, This is Post2!',
    'tHIS IS ADDRESS',
    'nj',
    'hoboken',
     '07030',
     '/img.img',
     'this is a house description',
     '05/10/1995',
     'apartment',
     '111-777-4444',
     '$5555',
     'eample@gmail.com');
  let post2 = await posts.addPost(
    user1._id,
    'Hello, This is Post3!',
    'tHIS IS ADDRESS',
    'nj',
    'hoboken',
     '07030',
     '/img.img',
     'this is a house description',
     '05/10/1995',
     'apartment',
     '111-777-4444',
     '$5555',
     'eample@gmail.com');
  let post3 = await posts.addPost(
    user1._id,
    'Hello, This is Post1!',
    'tHIS IS ADDRESS',
    'nj',
    'hoboken',
     '07030',
     '/img.img',
     'this is a house description',
     '05/10/1995',
     'apartment',
     '111-777-4444',
     '$5555',
     'eample@gmail.com');


  let comment1 = await comments.addComment(user1._id, post1._id.toString(), 'this is a commment.', '10/10/2020');
  let comment2 = await comments.addComment(user1._id, post2._id.toString(), 'this is a commment.', '10/10/2020');
  let comment3 = await comments.addComment(user1._id, post2._id.toString(), 'this is a commment.', '10/10/2020');

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
