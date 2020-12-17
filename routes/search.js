const express = require('express');
const router = express.Router();
const data = require('../data');
const postsData = data.posts;

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
router.post('/', async (req, res) => {
  if(isEmptyOrSpaces(req.body.search_input)){
    try {
      let posts = await postsData.getAllPosts();
      const newList = [];
      for (let i = 0; i < 3; i++) {
        let item = {
          _id: posts[posts.length - i - 1]._id.toString(),
          title: posts[posts.length - i - 1].title,
          image: posts[posts.length - i - 1].img[0],
          price: posts[posts.length - i - 1].price,
          zipcode: posts[posts.length - i - 1].zipcode,
          city: posts[posts.length - i - 1].city,
        };
        newList.push(item);
      }

      res.status(200).render("pages/mainPage", {posts: newList, errors: "You have to provide a valid input" });
    } catch (e) {
      res.render("pages/mainPage", { errors: "No posts in the databse" });
    }
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

        error = "Unfortunately, there is no apartment listed in  " + input;
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

        res.render('pages/posts', { posts: recentList, error: error, number: recentList.length, search: input, address: map_address});

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
          newList.push(item);
        }
        let map_address = {address:results[0].address,
                       city: results[0].city,
                       state: results[0].state};

        res.render('pages/posts', { posts: newList, number:newList.length, search: input, address: map_address});
      }


    } catch (e) {

      res.status(404).json({ error: 'Post not found'  +  e});
    }
  }
});

module.exports = router;
