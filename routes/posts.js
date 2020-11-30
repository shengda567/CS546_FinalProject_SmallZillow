const express = require("express");
const router = express.Router();
const data = require("../data");
const postsData = data.posts;
const commentsData = data.comments;

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

router.get("/:id", async (req, res) => {
  try {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    let post = await postsData.getPostById(objectID);
    let comments = [];
    for (let i in post.comments) {
      let comment = await commentsData.getCommentById(post.comments[i].id);
      comments.push(comment);
    }
    res.render("pages/singlePost", { post: post, comments: comments });
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }
});

router.get("/", async (req, res) => {
  console.log("hello")
  try {
    let posts = await postsData.getAllPosts();
    const newList = [];
    console.log(posts);
    for (let i in posts) {
      let item = {
        _id: posts[i]._id.toString(),
        title: posts[i].title,
        image: posts[i].img,
        price: posts[i].price,
        address: posts[i].address

      };
      newList.push(item);
    }

    res.render("pages/posts", { posts: newList });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {


  let postInfo = JSON.parse(JSON.stringify(req.body));


  if (!postInfo) {
    res.status(400).json({ error: "You must provide data to create a post" });
    return;
  }
  if (!postInfo.title) {
    res.status(400).json({ error: "You must provide a title" });
    return;
  }
  if (!postInfo.address) {
    res.status(400).json({ error: "You must provide a address" });
    return;
  }
  if (!postInfo.state) {
    res.status(400).json({ error: "You must provide a state" });
    return;
  }
  if (!postInfo.city) {
    res.status(400).json({ error: "You must provide a city" });
    return;
  }
  if (!postInfo.zipcode) {
    res.status(400).json({ error: "You must provide a zipcode" });
    return;
  }
  if (!postInfo.img) {
    res.status(400).json({ error: "You must provide a image" });
    return;
  }
  if (!postInfo.description) {
    res.status(400).json({ error: "You must provide a description" });
    return;
  }
  if (!postInfo.Time) {
    res.status(400).json({ error: "You must provide a date" });
    return;
  }
  if (!postInfo.tag) {
    res.status(400).json({ error: "You must provide a tag" });
    return;
  }
  if (!postInfo.phone) {
    res.status(400).json({ error: "You must provide a phone" });
    return;
  }
  if (!postInfo.prices) {
    res.status(400).json({ error: "You must provide a price" });
    return;
  }
  if (!postInfo.email) {
    res.status(400).json({ error: "You must provide a email" });
    return;
  }
  let img_data = postInfo.img[0];

  // save the image to /public/img
  var fs = require('fs');
  var base64Data = img_data.base64;
  var base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  var buf = Buffer.from(base64, 'base64');
  let dir = 'public/img/' + img_data.name;
  fs.writeFile(dir, buf, function(err){
    console.log(err);
  });

  const {ObjectId} = require('mongodb');
  let userId = ObjectId("5fb62a7f60fd91ca36339a9c");

  try {

    let newPost = await postsData.addPost(
      userId,
      postInfo.title,
      postInfo.address,
      postInfo.state,
      postInfo.city,
      postInfo.zipcode,
      dir,
      postInfo.description,
      postInfo.Time,
      postInfo.tag,
      postInfo.phone,
      postInfo.prices,
      postInfo.email,
      []);
    let newId = newPost._id.toString();

    res.redirect("posts/");
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
//
// router.patch('/:id', async (req, res) => {
//   const requestBody = req.body;
//   if (!requestBody.title && requestBody.author && requestBody.genre && requestBody.datePublished && requestBody.summary){
//     res.status(404).json({ error: 'At least one field has to  be provided' });
//   }
//   let updatedObject = {};
//   let { ObjectId } = require('mongodb');
//   let objectID = ObjectId(req.params.id);
//   try {
//     const oldPost = await postsData.getPostById(objectID);
//     updatedObject = oldPost;
//     if (requestBody.title && requestBody.title !== oldPost.title)
//       updatedObject.title = requestBody.title;
//     if (requestBody.author && requestBody.author.authorFirstName && requestBody.author.authorLastName && (requestBody.author.authorFirstName !== oldPost.author.authorFirstName || requestBody.author.authorLastName !== oldPost.author.authorLastName))
//       updatedObject.author = requestBody.author;
//     if (requestBody.genre && requestBody.genre !== oldPost.genre)
//       updatedObject.genre = requestBody.genre;
//     if (requestBody.datePublished && requestBody.datePublished !== oldPost.datePublished)
//       updatedObject.datePublished = requestBody.datePublished;
//     if (requestBody.summary && requestBody.summary !== oldPost.summary)
//         updatedObject.summary = requestBody.summary;
//   } catch (e) {
//     res.status(404).json({ error: 'Post not found' });
//     return;
//   }
//
//   try {
//     const updatedPost = await postsData.updatePost(objectID, updatedObject);
//     res.json(updatedPost);
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// });

router.delete("/:id", async (req, res) => {
  if (!req.params.id) throw "You must specify an ID to delete";
  let { ObjectId } = require("mongodb");
  let postId = ObjectId(req.params.id);
  let post = {};
  try {
    post = await postData.getPostById(postId);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  try {
    await postData.removePost(objectID);
  } catch (e) {
    res.status(500).json({ error: e });
  }
  for (let i in post.comments) {
    let commentId = post.comments[i];
    try {
      await commentsData.getReviewById(commentId);
    } catch (e) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    try {
      await commentsData.removeReview(commentId);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  res.json({ postId: req.params.id, deleted: true });
});

module.exports = router;
