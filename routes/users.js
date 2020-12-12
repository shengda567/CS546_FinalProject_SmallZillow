//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
const usersData = data.register;
const postsData = data.posts;

const pic = require("../data/VerificationCode");

router.get("/", async (req, res) => {
  //res.json({ route: '/users', method: req.method });

  if (req.session.user) {
    res.redirect("/login/" + req.session.user.userId);
  } else {
    res.render("pages/login");
  }
});
router.get("/:id", async (req, res) => {
  //res.json({ route: '/users', method: req.method });
  if (req.session.user) {
    let users = await usersData.getbyone(req.session.user.userId);
    let posts = [];
    for (let i in users.post) {
      let singlePost = await postsData.getPostById(users.post[i]);
      posts.push({ title: singlePost.title, id: singlePost._id });
    }
    res.render("pages/user", { user: users, posts: posts });
  } else {
    res.render("pages/login");
  }
});

router.get("/userSinglePost/:id", async (req, res) => {
  if (req.session.user) {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    let singlePost = await postsData.getPostById(objectID);
    singlePost._id = singlePost._id.toString();
    res.render("pages/userSinglePost", { post: singlePost });
  } else {
    res.render("pages/login");
  }
});

router.get("/api/getCaptcha", function (req, res, next) {
  let p = "ABCDEFGHKMNPQRSTUVWXYZ1234567890";
  var str = "";
  for (var i = 0; i < 4; i++) {
    str += p.charAt((Math.random() * p.length) | 0);
  }
  res.cookie("captcha", str);
  let img = pic.makeCapcha(str);
  res.setHeader("Content-Type", "image/bmp");
  res.end(img.getFileData());
});

router.post("/check", async (req, res) => {
  const { username, password, verifiy } = req.body;
  var check = false;
  let userdata = [];
  try {
    userdata = await usersData.getAllUsers();
  } catch (e) {
    console.log(e);
  }
  const parsedData = JSON.stringify(userdata);
  const userList = JSON.parse(parsedData);
  try {
    const cookies = req.headers.cookie;
    var list = cookies.split("; ");
    for (var i = 0; i < list.length; i++) {
      var arr = list[i].split("=");
      if (arr[0] == "captcha") {
        var captcha = arr[1];
      }
    }
    if (verifiy == captcha) {
      for (var i in userList) {
        if (userList[i].username == username) {
          check = true;
          var match = false;
          match = bcrypt.compareSync(password, userList[i].hashpassword);
          if (match) {
            req.session.user = {
              userId: userList[i]._id,
              username: userList[i].username,
              firstName: userList[i].firstName,
              lastName: userList[i].lastName,
            };
            res.redirect("/login/" + req.session.user.userId);
          } else {
            res.status(401).render("pages/error", {
              error: "Either username or password are error.",
            });
          }
        }
      }
      if (check == false) {
        res
          .status(401)
          .render("pages/error", { error: "Username is not exist." });
      }
    } else {
      res.status(401).render("pages/error", { error: "Code is wrong." });
    }
  } catch (e) {
    res.status(401).render("pages/error", { error: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.render("pages/logout");
  //res.send('Logged out');
});

module.exports = router;
