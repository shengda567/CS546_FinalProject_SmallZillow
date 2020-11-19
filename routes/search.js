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
      results = await postsData.getAllPosts();
      found = 0;
      error = "Unfortunately, there is no apartment listed in  " + input;
    }

    const newList = [];
    for (let i in results){
      let item = {
        _id: results[i]._id.toString(),
        title: results[i].title
      }
      newList.push(item);
    }
    if(found == 0){
      res.render('pages/posts', { posts: newList, error: error });
    }
    else {
      res.render('pages/posts', { posts: newList});
    }

  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
  }
});

module.exports = router;
