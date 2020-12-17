//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const collection = require("../config/mongoCollections");
const register = collection.register;
const posts = collection.posts;
const { v4: uuidV4 } = require("uuid");
const bcrypt = require("bcrypt");

async function createaccount(
  username,
  user,
  email,
  gender,
  address,
  BOD,
  phone,
  password
) {
  if (typeof username !== "string") {

    throw "No username provided";
  }
  if (username.length == 0) {
    throw "the username can not be empty";
  }
  if (typeof user !== "object") {
    throw "the author type must be object";
  }
  if (Object.keys(user).length < 2) {
    throw "must input firstname and lastname";
  }
  for (var key in user) {
    if (typeof user[key] == "undefined") {
      throw "the object is empty";
    }
  }
  if (Object.prototype.toString.call(gender) != "[object String]") {
    throw "error, the genre not array";
  }
  if (gender.length == 0) {
    throw "genre can't be empty";
  }
  if (typeof BOD != "string") {
    throw "date type is error, should be mm/dd/yyyy";
  }
  if (typeof phone != "string") {
    throw "phone type is error.";
  }
  if (typeof password != "string") {
    throw "password type is error";
  }
  var post = new Array();
  var save = new Array();
  var comment = new Array();
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  var hashpassword = bcrypt.hashSync(password, salt);

  const registerCollection = await register();

  let newaccount = {
    username: username,
    user: user,
    email: email,
    gender: gender,
    address: address,
    BOD: BOD,
    phone: phone,
    password: password,
    hashpassword: hashpassword,
    post: post,
    save: save,
    comment: comment,
  };
  const insertInfo = await registerCollection.insertOne(newaccount);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create account";
  }
  const newId = insertInfo.insertedId;
  var str = newId.toString();
  const info = await this.getbyone(str);
  return info;
}

async function getAllUsers() {
  const userCollection = await register();
  return await userCollection.find({}).toArray();
}

async function getbyone(id) {
  if (typeof id != "string") {
    throw "the id typy is error.";
  }
  const registerCollection = await register();
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  const user = await registerCollection.findOne({ _id: userId });
  if (user === null) {
    throw "The user is not exist.";
  }
  return user;
}

async function checkusername(username) {
  if (typeof username != "string") {
    throw "the id typy is error.";
  }
  const registerCollection = await register();
  var { ObjectId } = require("mongodb");
  var uname = ObjectId(username);
  const user = await registerCollection.findOne({ username: uname });
  if (user != null) {
    throw "The user is already exist.";
  }
  return true;
}

async function getByUserName(username) {
  if (typeof username != "string") {
    throw "the id typy is error.";
  }
  const registerCollection = await register();
  var { ObjectId } = require("mongodb");
  const user = await registerCollection.findOne({ username: username });
  if (user == null) {
    throw "The user is not exist.";
  }
  user._id = user._id.toString();
  return user;
}

async function remove(id) {
  if (typeof id != "string") {
    throw "the id typy is error";
  }
  const registerCollection = await register();
  const postCollection = await posts();
  const saveCollection = await saves();
  const commentCollection = await comments();
  const userInfo = await this.getbyone(id.toString());
  if (userInfo.deletedCount === 0) {
    throw "Could not find book with this id";
  }
  for (var i in userInfo) {
    await postCollection.deleteOne({ _id: userInfo.posts[i] });
    await saveCollection.deleteOne({ _id: userInfo.saves[i] });
    await commentCollection.deleteOne({ _id: userInfo.comments[i] });
  }
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  const deletionInfo = await registerCollection.deleteOne({ _id: userId });
  if (deletionInfo.deletedCount === 0) {
    throw "Could not delete user with userId of ${id}";
  }
  var obj = new Object();
  obj.userID = id;
  obj.deleted = true;
  return obj;
}

async function update(id, updatedPost) {
  const registerCollection = await register();
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);

  const updatedPostData = {};

  if (updatedPost.user) {
    updatedPostData.user = updatedPost.user;
  }

  if (updatedPost.email) {
    updatedPostData.email = updatedPost.email;
  }

  if (updatedPost.gender) {
    updatedPostData.gender = updatedPost.gender;
  }

  if (updatedPost.address) {
    updatedPostData.address = updatedPost.address;
  }

  if (updatedPost.BOD) {
    updatedPostData.BOD = updatedPost.BOD;
  }

  if (updatedPost.phone) {
    updatedPostData.phone = updatedPost.phone;
  }

  if (updatedPost.password) {
    updatedPostData.password = updatedPost.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    var hashpassword = bcrypt.hashSync(updatedPost.password, salt);
    updatedPostData.hashpassword = hashpassword;
  }

  const updatedInfo = await registerCollection.updateOne(
    { _id: userId },
    { $set: updatedPostData }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update user information successfully";
  }

  return await this.getbyone(id);
}

async function addpostforuser(id, postID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentreview = await this.getbyone(id);
  const registerCollection = await register();
  const updateInfo = await registerCollection.updateOne(
    { _id: userId },
    { $addToSet: { post: postID } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id);
}

async function addsaveforuser(id, saveID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentreview = await this.getbyone(id);
  const registerCollection = await register();
  const updateInfo = await registerCollection.updateOne(
    { _id: userId },
    { $addToSet: { save: saveID } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id);
}

async function addcommentforuser(id, commentID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentUser= await this.getbyone(id);
  const registerCollection = await register();
  const updateInfo = await registerCollection.updateOne(
    { _id: userId },
    { $addToSet: { comment: commentID } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id);
}

async function removepostfromuser(id, postID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentreview = await this.getbyone(id);
  const registerCollection = await register();

  const updateInfo = await registerCollection.updateOne(
    { _id: userId},
    { $pull: { post: postID } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id.toString());
}

async function removesavefromuser(id, saveID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentUser = await this.getbyone(id);
  const registerCollection = await register();
  const updateInfo = await registerCollection.updateOne(
    { _id: userId },
    { $pull: { save: saveID } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id.toString());
}

async function removeSavedPost(id) {
  if(typeof id !== 'object') throw "No valid id provided";
  let findDocuments = {
    save: id,
  };
  let firstUpdate = {
    $pull: { save: id },
  };
  const registerCollection = await register();
  let updatedUsers = await registerCollection.updateMany(findDocuments, firstUpdate);
  return updatedUsers;
}

async function removecommentfromuser(id, commentID) {
  var { ObjectId } = require("mongodb");
  var userId = ObjectId(id);
  let currentreview = await this.getbyone(id.toString());
  const registerCollection = await register();
  var commentid = ObjectId(commentID);
  const updateInfo = await registerCollection.updateOne(
    { _id: userId },
    { $pull: { comment: commentid } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Update failed";

  return await this.getbyone(id.toString());
}

module.exports = {
  getAllUsers,
  createaccount,
  getbyone,
  remove,
  update,
  addpostforuser,
  addsaveforuser,
  removeSavedPost,
  addcommentforuser,
  removepostfromuser,
  removesavefromuser,
  removecommentfromuser,
  checkusername,
  getByUserName,
};
