const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const posts = require('./posts');
const registers = require('./register');


function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

const exportedMethods = {
  async getAllComments() {
    const commentCollection = await comments();
    return await commentCollection.find({}).toArray();
  },

  async getCommentById(id) {
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: id });

    if (!comment) throw 'Comment not found';
    return comment;
  },
  async getCommentByPostId(id) {

    const commentCollection = await comments();
    const comment = await commentCollection.find({ postId: id }).toArray();

    if (!comment) throw 'Comment not found';
    return comment;
  },

  async addComment(user, postId, content, date) {

    if (typeof user !=='object') throw 'Please provide a valid user Id and username';
    if (typeof postId !== 'string' || isEmptyOrSpaces(postId)) throw 'Please provide a valid post Id';
    if (typeof content !== 'string' || isEmptyOrSpaces(content)) throw 'Please provide a valid content';
    if (typeof date !== 'string' || isEmptyOrSpaces(content)) throw 'Please provide a valid date';

    const commentCollection = await comments();

    let { ObjectId } = require('mongodb');
    let post_id = ObjectId(postId);

    //check if the user and post exist
    const post = await posts.getPostById(post_id);

    const newComment = {
      user: user,
      postId: post_id,
      content: content,
      date: date
    };

    const newInsertInformation = await commentCollection.insertOne(newComment);
    const newId = newInsertInformation.insertedId;

    await registers.addcommentforuser(user.userId, newId);

    await posts.addCommentToPost(post_id, newId);

    return await this.getCommentById(newId);
  },
  async removeComment(id) {
    const commentCollection = await comments();
    let comment = await this.getCommentById(id);;

    const deletionInfo = await commentCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${id}`;
    }
    return true;
  }
};

module.exports = exportedMethods;
