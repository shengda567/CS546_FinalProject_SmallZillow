const express = require('express');
const router = express.Router();
const data = require('../data');
const commentsData = data.comments;
const postsData = data.posts;
const xss = require("xss");
router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide ID' });
    return;
  }

  try {
    let { ObjectId } = require('mongodb');
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);
    let commentList = [];
    for (let i in post.comments){
      try {
        let commentID = post.comments[i];
        const comment = await commentsData.getCommentById(commentID);
        commentlist.push(comment);
      } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
      }
    }
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
  }
  res.json(commentList);

});

router.get('/:id/:comment', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide ID' });
    return;
  }
  if (!req.params.comment) {
    res.status(400).json({ error: 'You must provide comment' });
    return;
  }
  let { ObjectId } = require('mongodb');
  try {
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);

  } catch (e) {
    res.status(404).json({ error: e });
  }
  try{
    let commentID = ObjectId(req.params.comment);
    const comment = await commentData.getCommentById(commentID);
    res.json(comment);
  } catch(e) {
    res.status(404).json({ error: e });
  }
});

router.post('/:id', async (req, res) => {
  console.log(req.session.user)
  if(!req.session.user){
    res.json({ error: 'You have to login first!!!!' });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide a ID to post!' });
    return;
  }
  if (!req.body.comment_input) {
    res.status(400).json({ error: 'You must provide a comment' });
    return;
  }

  let userId = req.session.user.userId;
  let username = req.session.user.username;

  let today = new Date().toLocaleDateString();

  try {
    console.log(typeof userId + typeof username + typeof req.params.id + typeof req.body.comment_input)
    const newComment = await commentsData.addComment(
      {userId: userId,
      username: username},
      req.params.id,
      xss(req.body.comment_input),
      today,
    );

    let { ObjectId } = require('mongodb');
    let post_id = ObjectId(req.params.id);

    const commentList = await commentsData.getCommentByPostId(post_id);

    res.render('partials/comments', { layout: null, commentList: commentList });

  } catch (e) {
    res.status(500).json({ error: e });
  }
});



router.delete('/:id/:comment', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide ID to delete' });
    return;
  }
  if (!req.params.comment) {
    res.status(400).json({ error: 'You must provide ID to delete' });
    return;
  }
  let { ObjectId } = require('mongodb');
  let post = {};
  let objectID = {};
  let commentID = {};
  let theComment = {};
  try {
     objectID = ObjectId(req.params.id);
     post = await postsData.getPostById(objectID);
  } catch (e) {
    res.status(404).json({ error: e });
  }
  try {
    commentID = ObjectId(req.params.comment)
    theComment = await commentsData.getCommentById(commentID);
  } catch (e) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  try {
    let array = [];

    for (let i in post.comments){
      if(post.comments[i].toString() != req.params.comment)
          array.push(post.comments[i])
    }
    post.comments = array;
    await postsData.updatePost(objectID, post);
    await commentsData.removeComment(commentID);
    res.json(theComment);
  } catch (e) {
    res.status(500).json({ error: e });
  }


});

module.exports = router;
