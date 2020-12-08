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
    let found = 1;
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
      found = 0;
      error = "Unfortunately, there is no apartment listed in  " + input;

    }

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
    if(found == 0){
      let recentPosts = await postsData.getAllPosts();
      const recentList = [];
      for (let i = 0; i < 8; i++) {
        let recentItem = {
          _id: recentPosts[recentPosts.length - i - 1]._id.toString(),
          title: recentPosts[recentPosts.length - i - 1].title,
          image: recentPosts[recentPosts.length - i - 1].img,
          price: recentPosts[recentPosts.length - i - 1].price,
          zipcode: recentPosts[recentPosts.length - i - 1].zipcode,
          city: recentPosts[recentPosts.length - i - 1].city,

        };
        recentList.push(recentItem);
      }
      console.log(error)
      res.render('pages/posts', { posts: recentList, error: error, search: input});
    }
    else {
      res.render('pages/posts', { posts: newList, search: input});
    }

  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
  }
});

module.exports = router;
