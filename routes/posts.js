const express = require("express");
const router = express.Router();
const data = require("../data");
const xss = require("xss");
const postsData = data.posts;
const commentsData = data.comments;

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function capitalizeTheFirstLetterOfEachWord(words) {
   var separateWord = words.toLowerCase().split(' ');
   for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
   }
   return separateWord.join(' ');
}

router.get("/:id", async (req, res) => {
  try {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);
    post._id = post._id.toString();
    // main Image and side Images
    let main = post.img[0],
      sides = post.img.slice(1);
    let comments = [];

    // if there are comments
    if (post.comments.length != 0) {
      for (let i in post.comments) {
        let comment = await commentsData.getCommentById(post.comments[i].id);
        comments.push(comment);
      }
      res.render("pages/singlePost", {
        post: post,
        main: main,
        sides: sides,
        comments: comments,
      });
    }
    // else no comments
    else {
      res.render("pages/singlePost", { post: post, main: main, sides: sides });
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    let posts = await postsData.getAllPosts();
    const newList = [];
    for (let i in posts) {
      let item = {
        _id: posts[i]._id.toString(),
        title: posts[i].title,
        image: posts[i].img,
        price: posts[i].price,
        address: posts[i].address,
      };
      newList.push(item);
    }

    res.render("pages/posts", { posts: newList });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  let userId = req.session.user.userId;
  let postInfo = JSON.parse(JSON.stringify(req.body));

  if (!postInfo) {
    res.status(400).json({ error: "You must provide data to create a post" });
    return;
  }
  if (!postInfo.title || isEmptyOrSpaces(postInfo.title)) {
    res.status(400).json({ error: "You must provide a title" });
    return;
  }
  if (!postInfo.address || isEmptyOrSpaces(postInfo.address)) {
    res.status(400).json({ error: "You must provide a address" });
    return;
  }
  if (!postInfo.state || isEmptyOrSpaces(postInfo.state)) {
    res.status(400).json({ error: "You must provide a state" });
    return;
  }
  if (!postInfo.city || isEmptyOrSpaces(postInfo.city)) {
    res.status(400).json({ error: "You must provide a city" });
    return;
  }
  if (!postInfo.zipcode || isEmptyOrSpaces(postInfo.zipcode)) {
    res.status(400).json({ error: "You must provide a zipcode" });
    return;
  }
  if (!postInfo.img) {
    res.status(400).json({ error: "You must provide a image" });
    return;
  }
  if (!postInfo.description || isEmptyOrSpaces(postInfo.description)) {
    res.status(400).json({ error: "You must provide a description" });
    return;
  }
  if (!postInfo.Time || isEmptyOrSpaces(postInfo.Time)) {
    res.status(400).json({ error: "You must provide a date" });
    return;
  }
  if (!postInfo.tag || isEmptyOrSpaces(postInfo.tag)) {
    res.status(400).json({ error: "You must provide a tag" });
    return;
  }
  if (!postInfo.phone || isEmptyOrSpaces(postInfo.phone)) {
    res.status(400).json({ error: "You must provide a phone" });
    return;
  }
  if (!postInfo.prices || isEmptyOrSpaces(postInfo.prices)) {
    res.status(400).json({ error: "You must provide a price" });
    return;
  }
  if (!postInfo.email || isEmptyOrSpaces(postInfo.email)) {
    res.status(400).json({ error: "You must provide a email" });
    return;
  }
  let dir = []; //  an array of image directories
  for (let image in postInfo.img) {
    let img_data = postInfo.img[image];
    // save the image to /public/img
    var fs = require("fs");
    var base64Data = img_data.base64;
    var base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(base64, "base64");
    dir.push("public/img/" + img_data.name);
    fs.writeFile(dir[image], buf, function (err) {});
  }

  try {
    let newPost = await postsData.addPost(
      userId,
      xss(postInfo.title),
      capitalizeTheFirstLetterOfEachWord(xss(postInfo.address)),
      xss(postInfo.state),
      capitalizeTheFirstLetterOfEachWord(xss(postInfo.city)),
      xss(postInfo.zipcode),
      dir,
      xss(postInfo.description),
      xss(postInfo.Time),
      xss(postInfo.tag),
      xss(postInfo.phone),
      parseInt(xss(postInfo.prices)),
      xss(postInfo.email),
      []
    );
    let newId = newPost._id.toString();

    res.redirect("/");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// router.put('/:id', async (req, res) => {
//   let postsInfo = req.body;
//
//   if (!postsInfo) {
//     res.status(400).json({ error: 'You must provide data to create a posts' });
//     return;
//   }
//   if (!postsInfo.title) {
//     res.status(400).json({ error: 'You must provide a title' });
//     return;
//   }
//   if (!postsInfo.author) {
//     res.status(400).json({ error: 'You must provide a author' });
//     return;
//   }
//   if (!postsInfo.author.authorFirstName) {
//     res.status(400).json({ error: 'You must provide a authorFirstName' });
//     return;
//   }
//   if (!postsInfo.author.authorLastName) {
//     res.status(400).json({ error: 'You must provide a authorLastName' });
//     return;
//   }
//   if (!postsInfo.genre) {
//     res.status(400).json({ error: 'You must provide a genre' });
//     return;
//   }
//   if (!postsInfo.datePublished) {
//     res.status(400).json({ error: 'You must provide a date' });
//     return;
//   }
//   if (!postsInfo.summary) {
//     res.status(400).json({ error: 'You must provide a summary' });
//     return;
//   }
//   let { ObjectId } = require('mongodb');
//   let objectID = ObjectId(req.params.id);
//   let oldPost = {};
//   try {
//     oldPost = await postsData.getPostById(objectID);
//   } catch (e) {
//     res.status(404).json({ error: 'Post not found' });
//     return;
//   }
//
//   postsInfo.comments = oldPost.comments;
//
//   try {
//     const updatedPost = await postsData.updatePost(objectID, postsInfo);
//     res.json(updatedPost);
//   } catch (e) {
//     res.status(500).json({error: e});
//   }
// });

router.patch("/:id", async (req, res) => {
  const requestBody = req.body;
  if (
    !requestBody.title &&
    !requestBody.address &&
    !requestBody.state &&
    !requestBody.city &&
    !requestBody.zipcode &&
    !requestBody.description &&
    !requestBody.tag &&
    !requestBody.email &&
    !requestBody.phone &&
    !requestBody.price
  ) {
    res.status(404).json({ error: "At least one field has to  be provided" });
  }
  let updatedObject = {};
  let { ObjectId } = require("mongodb");

  let objectID = ObjectId(req.params.id);

  try {
    const oldPost = await postsData.getPostById(objectID);
    updatedObject = oldPost;
    if (requestBody.title && requestBody.title !== oldPost.title)
      updatedObject.title = xss(requestBody.title);
    if (requestBody.address && requestBody.address !== oldPost.address){
      updatedObject.address = capitalizeTheFirstLetterOfEachWord(xss(requestBody.address));
    }
    if (requestBody.state && requestBody.state !== oldPost.state)
      updatedObject.state = xss(requestBody.state);
    if (requestBody.city && requestBody.city !== oldPost.city)
      updatedObject.city = capitalizeTheFirstLetterOfEachWord(xss(requestBody.city));
    if (requestBody.zipcode && requestBody.zipcode !== oldPost.zipcode)
      updatedObject.zipcode = xss(requestBody.zipcode);
    if (
      requestBody.description &&
      requestBody.description !== oldPost.description
    )
      updatedObject.description = xss(requestBody.description);
    if (requestBody.tag && requestBody.tag !== oldPost.tag)
      updatedObject.tag = xss(requestBody.tag);
    if (requestBody.email && requestBody.email !== oldPost.email)
      updatedObject.email = xss(requestBody.email);
    if (requestBody.phone && requestBody.phone !== oldPost.phone)
      updatedObject.phone = xss(requestBody.phone);
    if (requestBody.price && requestBody.price !== oldPost.price)
      updatedObject.price = parseInt(xss(requestBody.price));
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  try {
    const updatedPost = await postsData.updatePost(objectID, updatedObject);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) throw "You must specify an ID to delete";
  let { ObjectId } = require("mongodb");
  let postId = ObjectId(req.params.id);
  let post = {};
  try {
    post = await postsData.getPostById(postId);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  try {
    await postsData.removePost(postId);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
  for (let i in post.comments) {
    let commentId = post.comments[i].id;
    try {
      await commentsData.removeComment(commentId);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  res.json({ postId: req.params.id, deleted: true });
});

// router.post("/postName", async (req, res) => {
//   try {
//     const body = req.body;
//     const post = await postsData.getPostByname(body.name);
//     res.json(post);
//     return;
//   } catch (e) {
//     res.status(404).json({ message: "Post not found " + e });
//   }
// });

router.post("/:id", async (req, res) => {
  const requestBody = req.body;
  if (
    !requestBody.title &&
    !requestBody.address &&
    !requestBody.state &&
    !requestBody.city &&
    !requestBody.zipcode &&
    !requestBody.description &&
    !requestBody.tag &&
    !requestBody.email &&
    !requestBody.phone &&
    !requestBody.price
  ) {
    res.status(404).json({ error: "At least one field has to  be provided" });
  }
  let updatedObject = {};
  let { ObjectId } = require("mongodb");

  let objectID = ObjectId(req.params.id);

  try {
    const oldPost = await postsData.getPostById(objectID);
    updatedObject = oldPost;
    if (requestBody.title && requestBody.title !== oldPost.title)
      updatedObject.title = xss(requestBody.title);
    if (requestBody.address && requestBody.address !== oldPost.address)
      updatedObject.address = capitalizeTheFirstLetterOfEachWord(xss(requestBody.address));
    if (requestBody.state && requestBody.state !== oldPost.state)
      updatedObject.state = xss(requestBody.state);
    if (requestBody.city && requestBody.city !== oldPost.city)
      updatedObject.city = capitalizeTheFirstLetterOfEachWord(xss(requestBody.city));
    if (requestBody.zipcode && requestBody.zipcode !== oldPost.zipcode)
      updatedObject.zipcode = xss(requestBody.zipcode);
    if (
      requestBody.description &&
      requestBody.description !== oldPost.description
    )
      updatedObject.description = xss(requestBody.description);
    if (requestBody.tag && requestBody.tag !== oldPost.tag)
      updatedObject.tag = xss(requestBody.tag);
    if (requestBody.email && requestBody.email !== oldPost.email)
      updatedObject.email = xss(requestBody.email);
    if (requestBody.phone && requestBody.phone !== oldPost.phone)
      updatedObject.phone = xss(requestBody.phone);
    if (requestBody.price && requestBody.price !== oldPost.price)
      updatedObject.price = parseInt(xss(requestBody.price));
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  try {
    const updatedPost = await postsData.updatePost(objectID, updatedObject);
    res.json(updatedPost);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});



module.exports = router;
