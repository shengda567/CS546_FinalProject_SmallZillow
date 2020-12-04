const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const comments = data.comments;
const posts = data.posts;
const register = data.register;
const managers = data.managers;
const bcrypt = require("bcrypt");
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

  let register1 = await register.createaccount(
    'Joshs_account',
    {firstName:"Josh", lastName:"Pacino"},
    'josh@gmail.com',
    'male',
    'hoboken',
    '03/25/1997',
    '909-655-7823',
    'password',
  );
  console.log("success!!!!!")

  let register2 = await register.createaccount(
    'Yuns_account',
    {firstName:'Yun', lastName:'Yang'},
    '763831702@gmail.com',
    'male',
    'hoboken',
    '03/25/1995',
    '774-301-0708',
    'helloworld1',
  );
  console.log("success!!!!!")

  let post1 = await posts.addPost(
    register1._id.toString(),
    'Nice Apartment at 716 Madison St',
    '716 Madison St',
    'New Jersey',
    'Hoboken',
     '07030',
     'public/img/post1.jpg',
     'FIRST 2 MONTHS FREE W/ 14TH MONTH LEASE! Security deposit FREE option through Rhino! Broker fee paid by LL! Amazing Very Large apartment for rent. Vaulted ceilings, large bedrooms and living room, plenty of closet space!! Very well laid out. Central AC!! Laundry in building!! Elevator building!!',
     '05/10/2020',
     'Apartment',
     '111-777-4444',
     '$2,314',
     'example@gmail.com');
  let post2 = await posts.addPost(
    register1._id.toString(),
    'A Cozy Apartment in Hoboken!',
    '422 Bloomfield St',
    'New Jersey',
    'Hoboken',
     '07030',
     'public/img/post2.jpg',
     'Fully updated and spacious one bedroom home in ideally location. Home features open renovated kitchen with stainless steel appliance, back-splash, granite counter tops, hardwood flooring throughout and updated bathroom. Large living space and bedroom are offered to accommodate guests. Basement offers storage and laundry.',
     '08/19/2020',
     'Apartment',
     '122-333-6666',
     '$1,975',
     'yunyang@gmail.com');
  let post3 = await posts.addPost(
    register1._id.toString(),
    'A Fancy Apartment Available at 928 Garden St!',
    '928 Garden St',
    'New Jersey',
    'Hoboken',
     '07030',
     'public/img/post3.jpg',
     'NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ',
     '09/10/2020',
     'Apartment',
     '333-442-4444',
     '$2,000',
     'yocheckItOut@gmail.com');


  let comment1 = await comments.addComment(register1._id.toString(), post1._id.toString(), 'this is a commment.', '10/10/2020');
  let comment2 = await comments.addComment(register1._id.toString(), post2._id.toString(), 'this is a commment.', '10/10/2020');
  let comment3 = await comments.addComment(register1._id.toString(), post2._id.toString(), 'this is a commment.', '10/10/2020');

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
