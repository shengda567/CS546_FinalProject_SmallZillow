const express = require('express');
const router = express.Router();
const data = require('../data');
const postsData = data.posts;


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
  try {

    let input = req.body.search_input;

    let results = [];
    let error = "";
    if(isZipCode(input)){
      results = await postsData.getPostsByZipcode(input);

    }
    else if(input.includes(" ")){
      results = await postsData.getPostsByAddress(input);
    }
    else{
      results = await postsData.getPostsByCity(input);
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
      res.render('pages/posts', { posts: recentList, error: error, number: recentList.length, search: input});

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
      res.render('pages/posts', { posts: newList, search: input});
    }


  } catch (e) {

    res.status(404).json({ error: 'Post not found'  +  e});
  }
});

module.exports = router;
