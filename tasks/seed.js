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

  let post1 = await posts.addPost(
    register1._id.toString(),
    'Nice Apartment at 716 Madison St',
    '716 Madison St',
    'New Jersey',
    'Hoboken',
     '07030',
    [ 'public/img/post1.jpg'],
     'FIRST 2 MONTHS FREE W/ 14TH MONTH LEASE! Security deposit FREE option through Rhino! Broker fee paid by LL! Amazing Very Large apartment for rent. Vaulted ceilings, large bedrooms and living room, plenty of closet space!! Very well laid out. Central AC!! Laundry in building!! Elevator building!!',
     '05/10/2020',
     'Apartment',
     '111-777-4444',
     2314,
     'example@gmail.com');

  let post2 = await posts.addPost(
    register1._id.toString(),
    'A Cozy Apartment in Hoboken!',
    '422 Bloomfield St',
    'New Jersey',
    'Hoboken',
     '07030',
     ['public/img/post2.jpg'],
     'Fully updated and spacious one bedroom home in ideally location. Home features open renovated kitchen with stainless steel appliance, back-splash, granite counter tops, hardwood flooring throughout and updated bathroom. Large living space and bedroom are offered to accommodate guests. Basement offers storage and laundry.',
     '08/19/2020',
     'Apartment',
     '122-333-6666',
      1975,
     'yunyang@gmail.com');

  let post3 = await posts.addPost(
    register1._id.toString(),
    'A Fancy Apartment Available at 805 Bloomfield St #G!',
    '805 Bloomfield St #G',
    'New Jersey',
    'Hoboken',
     '07030',
     ['public/img/post3.jpg'],
     'Rare studio apt in the heart of Hoboken! Steps to everything. PRIVATE entrance and easy access to common backyard. Two rooms. Eat in Kitchen and Living room/Bedroom. Good size bathroom. Built-ins make for great storage. ',
     '09/10/2020',
     'House',
     '333-442-4434',
     1175,
     'yoch@gmail.com');

   let post4 = await posts.addPost(
     register1._id.toString(),
     'A Fancy Apartment Available at 928 Garden St!',
     '928 Garden St',
     'New Jersey',
     'Hoboken',
      '07030',
     ['public/img/post4.jpg'],
      'NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ',
      '09/11/2020',
      'Apartment',
      '333-442-4444',
      2000,
      'yocheckItOut@gmail.com');

  let post5 = await posts.addPost(
    register1._id.toString(),
    '1000 Willow Ave APT 2!',
    '1000 Willow Ave APT 2',
    'New Jersey',
    'Hoboken',
     '07030',
     ['public/img/post5.jpg'],
     'NEW PHOTOS COMING NEXT WEEK! Spacious 2 bed 1 bath apartment located on Willow Ave! Hardwood floors, Lots of light, many windows, newer kitchen, newer bathroom, central air and heat, exposed brick, and washer/dryer in the unit. ',
     '09/14/2020',
     'Apartment',
     '333-442-4444',
     23250,
     'yocheckItOut@gmail.com');

   let post6 = await posts.addPost(
     register1._id.toString(),
     'A Fancy Apartment Available at 9175 Ogold St!',
     '175 Ogold St',
     'New Jersey',
     'North Arlington',
      '07031',
      ['public/img/post6.jpg'],
      'NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ',
      '10/9/2020',
      'Apartment',
      '333-442-4444',
      999,
      'yocheckItOut@gmail.com');

    let post7 = await posts.addPost(
      register1._id.toString(),
      '1000 Jefferson Street Apartments!',
      '1000 Jefferson Street',
      'New Jersey',
      'Hoboken',
       '07030',
       ['public/img/post7.jpg'],
       'We are temporarily ceasing in-person tours with prospective residents. Virtual tours are available. Call us today for more information!  ',
       '11/3/2020',
       'House',
       '333-442-4444',
       4500,
       'yocheckItOut@gmail.com');
       
   let post8 = await posts.addPost(
     register1._id.toString(),
     'Avalon Hoboken!',
     '800 Madison St',
     'New Jersey',
     'Hoboken',
      '07030',
      ['public/img/post8.jpg'],
      'Avalon Hoboken features 1 and 2 bedroom apartments in Hoboken, NJ. Apartments include fully equipped kitchens with stainless steel appliances and granite countertops.',
      '11/19/2020',
      'Villa',
      '333-442-4444',
      5100,
      'yocheckItOut@gmail.com');

    let post9 = await posts.addPost(
      register1._id.toString(),
      'The Lofts at Kearny!',
      '300 Hoyt St',
      'New Jersey',
      'Kearny',
       '07032',
       ['public/img/post9.jpg'],
       'These luxurious, New York style Lofts feature high ceilings and breathtaking bay view windows which surpass your expectations of style and display an air of serenity.',
       '11/20/2020',
       'Villa',
       '333-442-4444',
       4100,
       'yocheckItOut@gmail.com');



  let comment1 = await comments.addComment({userId: register1._id.toString(),username:register1.username}, post1._id.toString(), 'this is a commment.', '10/10/2020');
  let comment2 = await comments.addComment({userId:register1._id.toString(), username:register1.username}, post2._id.toString(), 'this is a commment.', '10/10/2020');
  let comment3 = await comments.addComment({userId:register1._id.toString(), username:register1.username}, post2._id.toString(), 'this is a commment.', '10/10/2020');

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
