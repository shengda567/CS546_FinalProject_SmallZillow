const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const comments = data.comments;
const posts = data.posts;
const register = data.register;
const managers = data.managers;
const bcrypt = require("bcrypt");
async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  console.log("  ");
  console.log("  ");
  console.log("  ");
  console.log(
    "please take 2 minutes rest for your health! initial data will take some time, thank you for your patient"
  );
  console.log("we need initial 7 managers, to verify them will take some time");

  let manager1 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "Shawn",
    "Shawn1",
    "swang147@stevens.edu",
    "manager2",
    "damnyoujackdonaghy"
  );

  let manager2 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "Michael",
    "Michael1",
    "michael123@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  let manager3 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "shuoyuwang",
    "shuoyuwang",
    "shuoyuwang@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  let manager4 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "yunyang",
    "yunyang",
    "yunyang@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  let manager5 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "zichongwang",
    "zichongwang",
    "zichongwang@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  let manager6 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "shengda",
    "shengda",
    "shengda@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  let manager7 = await managers.addManager(
    //username, password, email, manager_level, managerCode
    "zhanmingbai",
    "zhanmingbai",
    "zhanmingbai@stevens.edu",
    "manager1",
    "elementarymydearwatson"
  );

  if (
    !manager1 ||
    !manager2 ||
    !manager3 ||
    !manager4 ||
    !manager5 ||
    !manager6 ||
    !manager7
  ) {
    console.log("add managers failed");
  } else {
    console.log("add managers success");
  }

  let register1 = await register.createaccount(
    "shawn_account",
    { firstName: "Josh", lastName: "Pacino" },
    "josh@gmail.com",
    "male",
    "hoboken",
    "1997-03-25",
    "9096557823",
    "password"
  );

  let register2 = await register.createaccount(
    "Yuns_account",
    { firstName: "Yun", lastName: "Yang" },
    "763831702@gmail.com",
    "male",
    "hoboken",
    "1995-03-25",
    "7743010708",
    "helloworld1"
  );

  let register3 = await register.createaccount(
    "mike_account",
    { firstName: "mike", lastName: "Toma" },
    "Toma@gmail.com",
    "male",
    "new york",
    "1977-11-15",
    "9091117823",
    "passpass"
  );

  let register4 = await register.createaccount(
    "mabaoguo",
    { firstName: "Baoguo", lastName: "Ma" },
    "henkuaiao@gmail.com",
    "male",
    "shandong",
    "1967-19-25",
    "6013010788",
    "hunyuantaiji"
  );

  let register5 = await register.createaccount(
    "wdnmdqiezi",
    { firstName: "qiezi", lastName: "baigei" },
    "yiqiangmiaole@gmail.com",
    "male",
    "douyu",
    "1977-11-15",
    "4716557003",
    "fabajuhaome"
  );

  let register6 = await register.createaccount(
    "ohahahaha",
    { firstName: "dagong", lastName: "ren" },
    "ganfan2@gmail.com",
    "female",
    "fortlee",
    "1975-03-25",
    "7143010708",
    "helloworld"
  );

  let register7 = await register.createaccount(
    "dankegongyu",
    { firstName: "danke", lastName: "gongyu" },
    "dankegongyu@gmail.com",
    "female",
    "fortlee",
    "1975-03-11",
    "9090017823",
    "password1"
  );

  let register8 = await register.createaccount(
    "buzhuanye",
    { firstName: "long", lastName: "cheng" },
    "chenglong@gmail.com",
    "male",
    "hoboken",
    "1977-03-25",
    "7743010798",
    "hellowo123"
  );

  let register9 = await register.createaccount(
    "Tom123333",
    { firstName: "Tom", lastName: "Pacion" },
    "Tomas@gmail.com",
    "male",
    "hoboken",
    "1997-03-25",
    "9096551823",
    "password"
  );

  let register10 = await register.createaccount(
    "jammy1232",
    { firstName: "Yjs", lastName: "Yan" },
    "763washuo@gmail.com",
    "female",
    "newyork",
    "1985-03-25",
    "7743010008",
    "hellonicaicai"
  );

  let register11 = await register.createaccount(
    "finalproject",
    { firstName: "nihao", lastName: "helo" },
    "helo123@gmail.com",
    "female",
    "hoboken",
    "1997-03-25",
    "9096667823",
    "pass7897"
  );

  let register12 = await register.createaccount(
    "superman1",
    { firstName: "superman", lastName: "Yang" },
    "superman@gmail.com",
    "male",
    "newyork",
    "1966-03-25",
    "7743019999",
    "helloearth"
  );

  let register13 = await register.createaccount(
    "ironman1",
    { firstName: "James", lastName: "Lus" },
    "jamesh@gmail.com",
    "male",
    "newyork",
    "1972-03-25",
    "9296659823",
    "password12"
  );

  let register14 = await register.createaccount(
    "Lumingfei",
    { firstName: "Yuas", lastName: "Ysag" },
    "7sfhksl2@gmail.com",
    "male",
    "fortlee",
    "1995-03-25",
    "7743010338",
    "helloworld1"
  );

  let register15 = await register.createaccount(
    "LiYunlong",
    { firstName: "Li", lastName: "kim" },
    "likim@gmail.com",
    "female",
    "hoboken",
    "1967-03-25",
    "9096557823",
    "password"
  );

  let register16 = await register.createaccount(
    "heshang",
    { firstName: "Yhe", lastName: "Shang" },
    "sssheshang@gmail.com",
    "male",
    "newport",
    "1980-03-25",
    "7743010223",
    "passnklsaf"
  );

  if (
    !register1 ||
    !register2 ||
    !register3 ||
    !register4 ||
    !register5 ||
    !register6 ||
    !register7 ||
    !register8 ||
    !register9 ||
    !register11 ||
    !register12 ||
    !register13 ||
    !register14 ||
    !register15 ||
    !register16 ||
    !register10
  ) {
    console.log("add registers fail");
  } else {
    console.log("add register success");
  }

  let post1 = await posts.addPost(
    register1._id.toString(),
    "Nice Apartment at 716 Madison St",
    "716 Madison St",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post1.jpg"],
    "FIRST 2 MONTHS FREE W/ 14TH MONTH LEASE! Security deposit FREE option through Rhino! Broker fee paid by LL! Amazing Very Large apartment for rent. Vaulted ceilings, large bedrooms and living room, plenty of closet space!! Very well laid out. Central AC!! Laundry in building!! Elevator building!!",
    "05/10/2020",
    "Apartment",
    "1117774444",
    2314,
    "example@gmail.com"
  );

  let post2 = await posts.addPost(
    register1._id.toString(),
    "A Cozy Apartment in Hoboken!",
    "422 Bloomfield St",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post2.jpg"],
    "Fully updated and spacious one bedroom home in ideally location. Home features open renovated kitchen with stainless steel appliance, back-splash, granite counter tops, hardwood flooring throughout and updated bathroom. Large living space and bedroom are offered to accommodate guests. Basement offers storage and laundry.",
    "08/19/2020",
    "Apartment",
    "1223336666",
    1975,
    "yunyang@gmail.com"
  );

  let post3 = await posts.addPost(
    register1._id.toString(),
    "A Fancy Apartment Available at 805 Bloomfield St #G!",
    "805 Bloomfield St #G",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post3.jpg"],
    "Rare studio apt in the heart of Hoboken! Steps to everything. PRIVATE entrance and easy access to common backyard. Two rooms. Eat in Kitchen and Living room/Bedroom. Good size bathroom. Built-ins make for great storage. ",
    "09/10/2020",
    "House",
    "3334424434",
    1175,
    "yoch@gmail.com"
  );

  let post4 = await posts.addPost(
    register1._id.toString(),
    "A Fancy Apartment Available at 928 Garden St!",
    "928 Garden St",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post4.jpg"],
    "NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ",
    "09/11/2020",
    "Apartment",
    "3334424444",
    2000,
    "yocheckItOut@gmail.com"
  );

  let post5 = await posts.addPost(
    register1._id.toString(),
    "1000 Willow Ave APT 2!",
    "1000 Willow Ave APT 2",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post5.jpg"],
    "NEW PHOTOS COMING NEXT WEEK! Spacious 2 bed 1 bath apartment located on Willow Ave! Hardwood floors, Lots of light, many windows, newer kitchen, newer bathroom, central air and heat, exposed brick, and washer/dryer in the unit. ",
    "09/14/2020",
    "Apartment",
    "3334424444",
    23250,
    "yocheckItOut@gmail.com"
  );

  let post6 = await posts.addPost(
    register1._id.toString(),
    "A Fancy Apartment Available at 9175 Ogold St!",
    "175 Ogold St",
    "New Jersey",
    "North Arlington",
    "07031",
    ["public/img/post6.jpg"],
    "NO BROKER FEE! Wonderful 1 bedroom & den in classic Garden St. rowhouse. Period detail blends with modern convenience perfectly w/ large scaled rooms, dining area, great bedroom & separate den/office. Hardwood flrs. ",
    "10/9/2020",
    "Apartment",
    "3334424444",
    999,
    "yocheckItOut@gmail.com"
  );

  let post7 = await posts.addPost(
    register2._id.toString(),
    "1000 Jefferson Street Apartments!",
    "1000 Jefferson Street",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post7.jpg"],
    "We are temporarily ceasing in-person tours with prospective residents. Virtual tours are available. Call us today for more information!  ",
    "11/3/2020",
    "House",
    "3334424444",
    4500,
    "yocheckItOut@gmail.com"
  );

  let post8 = await posts.addPost(
    register2._id.toString(),
    "Avalon Hoboken!",
    "800 Madison St",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post8.jpg"],
    "Avalon Hoboken features 1 and 2 bedroom apartments in Hoboken, NJ. Apartments include fully equipped kitchens with stainless steel appliances and granite countertops.",
    "11/19/2020",
    "Villa",
    "3334424444",
    5100,
    "yocheckItOut@gmail.com"
  );

  let post9 = await posts.addPost(
    register3._id.toString(),
    "The Lofts at Kearny!",
    "300 Hoyt St",
    "New Jersey",
    "Kearny",
    "07032",
    ["public/img/post9.jpg"],
    "These luxurious, New York style Lofts feature high ceilings and breathtaking bay view windows which surpass your expectations of style and display an air of serenity.",
    "11/20/2020",
    "Villa",
    "3334424444",
    4100,
    "yocheckItOut@gmail.com"
  );

  let post10 = await posts.addPost(
    register3._id.toString(),
    "The willow apartement!",
    "224 Willow Ave",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post10.jpg"],
    `Beautiful 2 bedroom/2 full bath condo apartment on 2nd & Willow Avenue. Unit boasts a brand new designer kitchen with all new stainless steel appliances, hardwood floors, washer & dryer in unit, central A/C & heat and so much more! Very spacious apartment, great for entertaining! 5 minute walk to the Hoboken Path & surrounded by shopping, restaurants, brand new coffee Shop right below, next to Zack's, Chango Kitchen, Onieals, Grand Vin, Antique Bakery, NYC transportation and a block away from one of the most desirable parks in Hoboken. One garage parking space included in the rent, with a 2nd Parking space available for an additional $150 a month. Top floor unit with no apartment above. (Pets considered with damage deposit?) Will Not Last`,
    "11/20/2020",
    "Villa",
    "3334421111",
    3600,
    "youshifio@gmail.com"
  );

  let post11 = await posts.addPost(
    register3._id.toString(),
    "The apt at Grand!",
    "1300 Grand St",
    "New Jersey",
    "Hoboken",
    "07030",
    ["public/img/post11.jpg"],
    `Looking for Outdoor Living Space? This gorgeous apartment features an amazing and large private patio and it comes with a 1055 SF TWO Bed and TWO Bath home with garage parking space #24. Located in the sought after Steel & Concrete Upper Grand Building at 1300 Grand Street, this home also features 9.6" Ceilings, Gleaming Wood Floors, 42" White Kitchen Cabinetry, Granite Countertops, Stainless Steel Appliances and Large Peninsula with breakfast bar seating. This dream home has in-home W/D, Dual Vanity in the Master Bath, Large Soaking Tub in the Guest Bath, Custom Walk in Closets for Maximum Storage, Central AC, Residents Gym, Two Lobbies, Two Elevators, Scenic Landscaped Courtyard view from in your home and private patio. Located in Uptown Hoboken which is packed with an abundance of Restaurants, Trader Joes, Shops, Day Care, Schools, Children's Play Areas, Basketball, Tennis, Movie Theater, and will soon be home to Hoboken's Largest Park! Commuting is a breeze with easy access to the Bus, Uptown Ferry and the Free Green HOP that picks up at the Adams Street Lobby entrance and takes you to and from the PATH. Available for February 1st occupancy.`,
    "11/30/2020",
    "Villa",
    "3334421111",
    2400,
    "youshifio@gmail.com"
  );

  if (
    !post1 ||
    !post2 ||
    !post3 ||
    !post4 ||
    !post5 ||
    !post6 ||
    !post7 ||
    !post8 ||
    !post9 ||
    !post10 ||
    !post11
  ) {
    console.log("add posts failed");
  } else {
    console.log("add posts success");
  }

  let comment1 = await comments.addComment(
    {
      userId: register12._id.toString(),
      username: register12.username,
    },
    post11._id.toString(),
    "do not trust them, they do not have clean service",
    "12/15/2020"
  );

  let comment2 = await comments.addComment(
    {
      userId: register12._id.toString(),
      username: register12.username,
    },
    post10._id.toString(),
    "this is a good room for living.",
    "12/14/2020"
  );

  let comment3 = await comments.addComment(
    {
      userId: register12._id.toString(),
      username: register12.username,
    },
    post9._id.toString(),
    "I will never live here, too expensive!!!!!!!!",
    "10/10/2020"
  );

  let comment4 = await comments.addComment(
    {
      userId: register4._id.toString(),
      username: register4.username,
    },
    post11._id.toString(),
    "gen wo xue hun yuan tai ji",
    "12/15/2020"
  );

  let comment5 = await comments.addComment(
    {
      userId: register4._id.toString(),
      username: register4.username,
    },
    post10._id.toString(),
    "So fast!!!!",
    "12/14/2020"
  );

  let comment6 = await comments.addComment(
    {
      userId: register4._id.toString(),
      username: register4.username,
    },
    post9._id.toString(),
    "bu jiang wu de",
    "10/10/2020"
  );

  let comment7 = await comments.addComment(
    {
      userId: register15._id.toString(),
      username: register15.username,
    },
    post11._id.toString(),
    "The second battalion commander, pull up my Italian cannon",
    "12/15/2020"
  );

  let comment8 = await comments.addComment(
    {
      userId: register15._id.toString(),
      username: register15.username,
    },
    post10._id.toString(),
    "This place is really comfortable",
    "12/15/2020"
  );

  let comment9 = await comments.addComment(
    {
      userId: register15._id.toString(),
      username: register15.username,
    },
    post9._id.toString(),
    "gan ta yi pao",
    "10/12/2020"
  );

  let comment10 = await comments.addComment(
    {
      userId: register3._id.toString(),
      username: register3.username,
    },
    post11._id.toString(),
    "see my post, we changed price, contact us and get prime price!",
    "02/18/2020"
  );

  let comment11 = await comments.addComment(
    {
      userId: register7._id.toString(),
      username: register7.username,
    },
    post10._id.toString(),
    "working overtime here is perfect",
    "11/8/2020"
  );

  let comment12 = await comments.addComment(
    {
      userId: register13._id.toString(),
      username: register13.username,
    },
    post9._id.toString(),
    "young man, bu jiang wu de",
    "7/10/2020"
  );

  let comment13 = await comments.addComment(
    {
      userId: register13._id.toString(),
      username: register13.username,
    },
    post3._id.toString(),
    "I want buy this, it is perfect",
    "11/18/2020"
  );

  let comment14 = await comments.addComment(
    {
      userId: register13._id.toString(),
      username: register13.username,
    },
    post6._id.toString(),
    "Living  here is perfect",
    "11/08/2020"
  );

  let comment15 = await comments.addComment(
    {
      userId: register4._id.toString(),
      username: register4.username,
    },
    post7._id.toString(),
    "ops!!!!",
    "07/10/2020"
  );

  let comment16 = await comments.addComment(
    {
      userId: register10._id.toString(),
      username: register10.username,
    },
    post9._id.toString(),
    "first class, enjoy it",
    "09/18/2020"
  );

  let comment17 = await comments.addComment(
    {
      userId: register12._id.toString(),
      username: register12.username,
    },
    post10._id.toString(),
    "good to living",
    "11/8/2020"
  );

  let comment18 = await comments.addComment(
    {
      userId: register12._id.toString(),
      username: register12.username,
    },
    post6._id.toString(),
    "not that comfortable",
    "7/10/2020"
  );

  if (
    !comment1 ||
    !comment2 ||
    !comment3 ||
    !comment4 ||
    !comment5 ||
    !comment6 ||
    !comment7 ||
    !comment8 ||
    !comment9 ||
    !comment10 ||
    !comment11 ||
    !comment12 ||
    !comment13 ||
    !comment14 ||
    !comment15 ||
    !comment16 ||
    !comment17 ||
    !comment18
  ) {
    console.log("add comments failed");
  } else {
    console.log("add comments success");
  }

  console.log("Done seeding database");
  await db.serverConfig.close();
}

main();
