const express = require('express');
const router = express.Router();
const data = require('../data');
const commentsData = data.comments;
const postsData = data.posts;

router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide ID' });
    return;
  }

  try {
    let { ObjectId } = require('mongodb');
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);
    commentList = [];
    for (let i in post.comments){
      try {
        let commentID = post.comments[i];
        const comment = await commentData.getCommentById(commentID);
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
    res.status(400).json({ error: 'You must provide ID' });
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
  if (!req.params.id) {
    res.status(400).json({ error: 'You must provide a ID to post' });
    return;
  }
  const CommentData = req.body;
  if (!CommentData.title) {
    res.status(400).json({ error: 'You must provide a comment title' });
    return;
  }
  if (!CommentData.commenter) {
    res.status(400).json({ error: 'You must provide a reviwer' });
    return;
  }
  if (!CommentData.rating) {
    res.status(400).json({ error: 'You must provide a rating' });
    return;
  }
  if (!CommentData.dateOfComment) {
    res.status(400).json({ error: 'You must provide a date' });
    return;
  }
  if (!CommentData.comment) {
    res.status(400).json({ error: 'You must provide a comment' });
    return;
  }
  let { ObjectId } = require('mongodb');
  let objectID = ObjectId(req.params.id);
  try{
    let post = await postsData.getPostById(objectID);
  } catch(e){
    res.status(400).json({ error: "Post not found"})
  }
  try {
    const newComment = await commentData.addComment(
      CommentData.title,
      CommentData.commenter,
      req.params.id,
      CommentData.rating,
      CommentData.dateOfComment,
      CommentData.comment
    );
    res.json(newComment);
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
    theComment = await commentData.getCommentById(commentID);
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
    await commentData.removeComment(commentID);
    res.json(theComment);
  } catch (e) {
    res.status(500).json({ error: e });
  }


});

module.exports = router;
