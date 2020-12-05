const express = require("express");
const router = express.Router();
const data = require("../data");
const postsData = data.posts;
const xss = require('xss');

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
router.post('/search', async function (req, res) {


  // response.json({ success: true, message: request.body.description });
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
      error = "Unfortunately, there is no result listed in  " + input;
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
      res.render('partials/search_posts', { layout: null, posts: recentList, error: error});
    }
    else{
      const newList = [];
      for (let i in results){
        let item = {
           _id: results[i]._id.toString(),
           title: results[i].title,
           image: results[i].img,
           price: results[i].price,
           zipcode: results[i].zipcode,
           city: results[i].city,
          }
        //check if the price and tag match the criteria

        if((!req.body.tag || results[i].tag == req.body.tag) && (!req.body.price || checkPrice(results[i].price, parseInt(req.body.price))))
          newList.push(item);
      }
      res.render('partials/search_posts', { layout: null, posts: newList });
    }

  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
  }
});
module.exports = router;
