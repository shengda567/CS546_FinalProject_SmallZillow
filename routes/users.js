//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const data = require("../data");
// const mongoCollections = require('../config/mongoCollections');
const usersData = data.register;
const postsData = data.posts;
const xss = require("xss");

const pic = require("../data/VerificationCode");

router.get("/login", async (req, res) => {
  //res.json({ route: '/users', method: req.method });

  res.render("pages/login");
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
    let saves = [];
    for (let j in users.save) {
      let signleSave = await postsData.getPostById(users.save[j]);
      saves.push({
        saveTitle: signleSave.title,
        save_id: signleSave._id.toString(),
      });
      //console.log(saves);
    }
    res.render("pages/user", { user: users, posts: posts, saves: saves });
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
            res.redirect("/");
            //res.redirect("/login/" + req.session.user.userId);
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
router.get("/myaccount", async (req, res) => {
  if (req.session.user) {
    let users = await usersData.getbyone(req.session.user.userId);
    let posts = [];
    for (let i in users.post) {
      let singlePost = await postsData.getPostById(users.post[i]);
      posts.push({ title: singlePost.title, id: singlePost._id });
    }
    let saves = [];
    for (let j in users.save) {
      let signleSave = await postsData.getPostById(users.save[j]);
      saves.push({
        saveTitle: signleSave.title,
        save_id: signleSave._id.toString(),
      });
      console.log(saves);
    }
    return res.render("pages/user", {
      user: users,
      posts: posts,
      saves: saves,
    });
  } else {
    res.render("pages/login");
  }
});

router.post("/add/:id", async (req, res) => {
  if (req.session.user) {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    try {
      await usersData.addsaveforuser(req.session.user.userId, objectID);
      res.json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  } else {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.post("/remove/:id", async (req, res) => {
  if (req.session.user) {
    let { ObjectId } = require("mongodb");
    let objectID = ObjectId(req.params.id);
    try {
      await usersData.removesavefromuser(req.session.user.userId, objectID);
      res.json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  } else {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
