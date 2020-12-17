const express = require("express");
const router = express.Router();
const data = require("../data");
const postsData = data.posts;
const xss = require('xss');
const usersData = data.register;

function capitalizeTheFirstLetterOfEachWord(words) {
   var separateWord = words.toLowerCase().split(' ');
   for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
   }
   return separateWord.join(' ');
}

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function isZipCode(str) {
  if (typeof str != "string") return false // we only process strings!
  if(!isNaN(str) && !isNaN(parseFloat(str))){
    let num = parseInt(str);
    if(num%10000 < 10000) return true;
    else return false;
  }
  else return false;
}


function checkPrice(num, range){
  if(range == 0){
      if(num > 0 && num < 1000) return true;
      else return false;
  }
  else if(range == 1000){
      if(num > 1000 && num < 2000) return true;
      else return false;
  }
  else if(range == 2000){
      if(num > 2000 && num < 3000) return true;
      else return false;
  }
  else if(range == 3000){
      if(num > 3000 && num < 4000) return true;
      else return false;
  }
  else if(range == 4000){
      if(num > 4000) return true;
      else return false;
  }

}
router.get("/checkSaved/:id", async (req, res) => {
  if (!req.session.user)
    res.json({data: false})
  else{
    try {
      let user = await usersData.getbyone(req.session.user.userId);
      let found = 0;
      for(let i in user.save){
        if(user.save[i].toString() == req.params.id){
          found = 1;
        }
      }
      if(found == 1){
        res.json({data : true})
      }
      else{
        res.json({data : false})
      }

    } catch (e) {
      res.status(404).json({ message: "Check saved post Error " + e });
    }
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);
    post._id = post._id.toString();
    res.json(post);
    return;
  } catch (e) {
    res.status(404).json({ message: "Post not found " + e });
  }
});
router.post('/search', async function (req, res) {
  // response.json({ success: true, message: request.body.description });
  if(!req.body.search_input || isEmptyOrSpaces(req.body.search_input)){
    res.render('partials/search_posts', { layout: null, error: "Please enter a valid input"});
  }
  else{
    try {
      let input = req.body.search_input;
      let results = [];
      let error = "";

      if(isZipCode(input)){
        results = await postsData.getPostsByZipcode(input);
      }
      else{
        results = await postsData.getPostsByAddress(capitalizeTheFirstLetterOfEachWord(input));
        if(results.length == 0){
          results = await postsData.getPostsByCity(capitalizeTheFirstLetterOfEachWord(input));
        }
      }

      if(results.length == 0){
        error = "Unfortunately, there is no result listed in  " + input;
        let recentPosts = await postsData.getAllPosts();
        const recentList = [];
        for (let i in recentPosts) {
          let recentItem = {
            _id: recentPosts[i]._id.toString(),
            title: recentPosts[i].title,
            image: recentPosts[i].img[0],
            price: recentPosts[i].price,
            zipcode: recentPosts[i].zipcode,
            city: recentPosts[i].city,

          };
          recentList.push(recentItem);
        }
        let map_address = {address:recentPosts[0].address,
                           city: recentPosts[0].city,
                          state: recentPosts[0].state};
        res.render('partials/search_posts', { layout: null, number: recentList.length, posts: recentList, error: error, address: map_address});
      }
      else{
        const newList = [];
        for (let i in results){
          let item = {
             _id: results[i]._id.toString(),
             title: results[i].title,
             image: results[i].img[0],
             price: results[i].price,
             zipcode: results[i].zipcode,
             city: results[i].city,
            }
          //check if the price and tag match the criteria

          if((!req.body.tag || results[i].tag == req.body.tag) && (!req.body.price || checkPrice(results[i].price, parseInt(req.body.price))))
            newList.push(item);
        }
        let map_address = {address:results[0].address,
                       city: results[0].city,
                       state: results[0].state};

        res.render('partials/search_posts', { layout: null, number: newList.length, posts: newList, address: map_address});
      }

    } catch (e) {
      res.status(404).json({ error: 'Post not found' });
    }
  }
});

router.post('/similarPosts', async function (req, res) {
  // response.json({ success: true, message: request.body.description });
  if(!req.body.zipcode || isEmptyOrSpaces(req.body.zipcode)){
    res.status(404).json({error: 'Invalid zipzode'});
  }
  if(!req.body.city || isEmptyOrSpaces(req.body.city)){
    res.status(404).json({error: 'Invalid city'});
  }
  if(!req.body.state || isEmptyOrSpaces(req.body.state)){
    res.status(404).json({error: 'Invalid state'});
  }
  if(!req.body.address || isEmptyOrSpaces(req.body.address)){
    res.status(404).json({error: 'Invalid address'});
  }
  try {
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zipcode = req.body.zipcode;
    let results = [];
    results = await postsData.getPostsByZipcode(zipcode);
    if(results.length == 0)
      results = await postsData.getPostsByAddress(capitalizeTheFirstLetterOfEachWord(address));
    if(results.length == 0)
      results = await postsData.getPostsByCity(capitalizeTheFirstLetterOfEachWord(city));
    if(results.length == 0)
      results = await postsData.getPostsByState(capitalizeTheFirstLetterOfEachWord(state));

    if(results.length == 1){
      error = "Unfortunately, there is no similar results";
      let recentPosts = await postsData.getAllPosts();
      const recentList = [];
      for (let i = 0; i < 2; i++) {
        let recentItem = {
          _id: recentPosts[recentPosts.length - i - 1]._id.toString(),
          title: recentPosts[recentPosts.length - i - 1].title,
          image: recentPosts[recentPosts.length - i - 1].img[0],
          price: recentPosts[recentPosts.length - i - 1].price,
          zipcode: recentPosts[recentPosts.length - i - 1].zipcode,
          city: recentPosts[recentPosts.length - i - 1].city,

        };
        recentList.push(recentItem);
      }
      res.render('partials/search_posts', { layout: null, posts: recentList, error: error});
    }
    else{

      const newList = [];
      // send two similar results;
      for (let i  = results.length - 1; i > results.length - 3; i--){
        let item = {
           _id: results[i]._id.toString(),
           title: results[i].title,
           image: results[i].img[0],
           price: results[i].price,
           zipcode: results[i].zipcode,
           city: results[i].city,
         };
        newList.push(item);
        //check if the price and tag match the criteria
      }

      res.render('partials/search_posts', { layout: null, posts: newList });
    }

  } catch (e) {
    res.status(404).json({ error: 'Something went wrong while searching similar Posts' });
  }
});
module.exports = router;
