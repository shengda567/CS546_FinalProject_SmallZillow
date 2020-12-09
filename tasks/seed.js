const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const comments = data.comments;
const posts = data.posts;
const users = data.users;
const managers = data.managers;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  let manager1 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    'Shawn',
    'Shawn1',
    'swang147@stevens.edu',
    'manager2',
    'damnyoujackdonaghy',
    
  );
  console.log('add manager1 success!!');
  console.log(manager1);

  let manager2 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    'Michael',
    'Michael1',
    'michael123@stevens.edu',
    'manager1',
    'elementarymydearwatson'
  );
  console.log('add manager2 success!!');
  console.log(manager2);

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
    'Nice Apartment at 716 Madison St',
    '716 Madison St',
    'NJ',
    'Hoboken',
     '07030',
     '/post1.jpg',
     'FIRST 2 MONTHS FREE W/ 14TH MONTH LEASE! Security deposit FREE option through Rhino! Broker fee paid by LL! Amazing Very Large apartment for rent. Vaulted ceilings, large bedrooms and living room, plenty of closet space!! Very well laid out. Central AC!! Laundry in building!! Elevator building!!',
     '05/10/2020',
     'Apartment',
     '111-777-4444',
     '$2,314',
     'example@gmail.com');
  let post2 = await posts.addPost(
    user1._id,
    'A Cozy Apartment in Hoboken!',
    '422 Bloomfield St',
    'NJ',
    'Hoboken',
     '07030',
     '/post2.img',
     'Fully updated and spacious one bedroom home in ideally location. Home features open renovated kitchen with stainless steel appliance, back-splash, granite counter tops, hardwood flooring throughout and updated bathroom. Large living space and bedroom are offered to accommodate guests. Basement offers storage and laundry.',
     '04/9/2020',
     'Apartment',
     '122-333-6666',
     '$1,975',
     'yunyang@gmail.com');
  let post3 = await posts.addPost(
    user1._id,
    'A Fancy Apartment Available at 928 Garden St!',
    '928 Garden St',
    'NJ',
    'Hoboken',
     '07030',
     '/post3.jpg',
     'NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ',
     '09/10/2020',
     'Apartment',
     '333-442-4444',
     '$2,000',
     'yocheckItOut@gmail.com');


  let comment1 = await comments.addComment(user1._id, post1._id.toString(), 'this is a commment.', '10/10/2020');
  let comment2 = await comments.addComment(user1._id, post2._id.toString(), 'this is a commment.', '10/10/2020');
  let comment3 = await comments.addComment(user1._id, post2._id.toString(), 'this is a commment.', '10/10/2020');

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
