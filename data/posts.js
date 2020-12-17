const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;

const registers = require("./register");
//const uuid = require('uuid/v4');

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

const exportedMethods = {
  //get all posts
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },
  //search post by tag
  async getPostsByTag(tag) {
    if (!tag) throw "No tag provided";

    const postCollection = await posts();
    return await postCollection.find({ tag: tag }).toArray();
  },
  //search post by zipCode
  async getPostsByZipcode(zipcode) {
    if (!zipcode) throw "No zipcode provided";

    const postCollection = await posts();
    return await postCollection.find({ zipcode: zipcode }).toArray();
  },
  //search post by address
  async getPostsByAddress(address) {
    if (!address) throw "No address provided";

    const postCollection = await posts();
    return await postCollection.find({ address: address }).toArray();
  },
  //search post by city
  async getPostsByCity(city) {
    if (!city) throw "No city provided";

    const postCollection = await posts();
    return await postCollection.find({ city: city }).toArray();
  },
  //search post by state
  async getPostsByState(state) {
    if (!state) throw "No state provided";

    const postCollection = await posts();
    return await postCollection.find({ state: state }).toArray();
  },
  //search post by Id
  async getPostById(id) {
    if(typeof id !== 'object') throw "No valid id provided";
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: id });

    if (!post) throw "Post not found";
    return post;
  },

  async addPost(
    posterId,
    title,
    address,
    state,
    city,
    zipcode,
    img,
    description,
    date,
    tag,
    phone,
    price,
    email,
    comments
  ) {
    if (typeof title !== "string" || isEmptyOrSpaces(title))
      throw "Please provide a valid title!";
    if (typeof address !== "string" || isEmptyOrSpaces(address))
      throw "Please provide a valid address!";
    if (typeof city !== "string" || isEmptyOrSpaces(city))
      throw "Please provide a valid city!";
    if (typeof state !== "string" || isEmptyOrSpaces(state))
      throw "Please provide a valid state!";
    if (typeof zipcode !== "string" || isEmptyOrSpaces(zipcode))
      throw "Please provide a valid zipcode!";
    if (!Array.isArray(img)) throw "Please provide a valid image!";
    if (typeof description !== "string" || isEmptyOrSpaces(description))
      throw "Please provide a valid description!";
    if (typeof date !== "string" || isEmptyOrSpaces(date))
      throw "Please provide a valid date!";
    if (typeof tag !== "string" || isEmptyOrSpaces(tag))
      throw "Please provide a valid tag!";
    if (typeof phone !== "string" || isEmptyOrSpaces(phone))
      throw "Please provide a valid phone!";
    if (typeof price !== "number") throw "Please provide a valid price!";
    if (typeof email !== "string" || isEmptyOrSpaces(email))
      throw "Please provide a valid email!";
    if (!Array.isArray(comments)) {
      comments = [];
    }

    const postCollection = await posts();

    const userThatPosted = await registers.getbyone(posterId);

    const newPost = {
      user: {
        id: posterId,
        name: `${userThatPosted.user.firstName} ${userThatPosted.user.lastName}`,
      },
      title: title,
      address: address,
      state: state,
      city: city,
      zipcode: zipcode,
      img: img,
      description: description,
      date: date,
      tag: tag,
      phone: phone,
      price: price,
      email: email,
      comments: comments,
      //_id: uuid()
    };

    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

    await registers.addpostforuser(posterId, newId);

    return await this.getPostById(newId);
  },
  async removePost(id) {
    if(typeof id !== 'object') throw "No valid id provided";
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await postCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    await registers.removepostfromuser(post.user.id, id);
    await registers.removeSavedPost(id);
    return true;
  },



  async addCommentToPost(postId, commentId) {
    let currentPost = await this.getPostById(postId);

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
      { _id: postId },
      { $addToSet: { comments: { id: commentId } } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return await this.getPostById(postId);
  },

  async updatePost(id, updatedPost) {
    const postCollection = await posts();

    if (
      typeof updatedPost.title !== "string" ||
      isEmptyOrSpaces(updatedPost.title)
    ) {
      throw "You must provide a valid address";
    }
    if (
      typeof updatedPost.address !== "string" ||
      isEmptyOrSpaces(updatedPost.address)
    ) {
      throw "You must provide a valid address";
    }
    if (
      typeof updatedPost.state !== "string" ||
      isEmptyOrSpaces(updatedPost.state)
    ) {
      throw "You must provide a valid address";
    }
    if (
      typeof updatedPost.city !== "string" ||
      isEmptyOrSpaces(updatedPost.city)
    ) {
      throw "You must provide a valid address";
    }
    if (
      typeof updatedPost.zipcode !== "string" ||
      isEmptyOrSpaces(updatedPost.zipcode)
    ) {
      throw "You must provide a valid zipcode";
    }
    if (!Array.isArray(updatedPost.img)) {
      throw "You must provide a valid img";
    }
    if (
      typeof updatedPost.description !== "string" ||
      isEmptyOrSpaces(updatedPost.description)
    ) {
      throw "You must provide a valid description";
    }
    if (
      typeof updatedPost.date !== "string" ||
      isEmptyOrSpaces(updatedPost.date)
    ) {
      throw "You must provide a valid date";
    }
    if (
      typeof updatedPost.tag !== "string" ||
      isEmptyOrSpaces(updatedPost.tag)
    ) {
      throw "You must provide a valid tag";
    }
    if (
      typeof updatedPost.phone !== "string" ||
      isEmptyOrSpaces(updatedPost.phone)
    ) {
      throw "You must provide a valid phone";
    }
    if (
      typeof updatedPost.email !== "string" ||
      isEmptyOrSpaces(updatedPost.email)
    ) {
      throw "You must provide a valid email";
    }
    if (typeof updatedPost.price !== "number") {
      throw "You must provide a valid price";
    }

    await postCollection.updateOne({ _id: id }, { $set: updatedPost });
    return await this.getPostById(id);
  },
  async renameTag(oldTag, newTag) {
    if (oldTag === newTag) throw "tags are the same";
    let findDocuments = {
      tags: oldTag,
    };

    let firstUpdate = {
      $addToSet: { tags: newTag },
    };

    let secondUpdate = {
      $pull: { tags: oldTag },
    };

    const postCollection = await posts();
    await postCollection.updateMany(findDocuments, firstUpdate);
    await postCollection.updateMany(findDocuments, secondUpdate);

    return await this.getPostsByTag(newTag);
  },

  async getPostByname(postName) {
    if (!postName) throw "No post name provided";

    const postCollection = await posts();
    const post = await postCollection.findOne({ title: postName });
    if (!post) throw "Post not found";
    return post;
  },
};

module.exports = exportedMethods;
