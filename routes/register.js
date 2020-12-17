//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const router = express.Router();
const data = require("../data");
const customerinf = data.register;
var bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const pic = require("../data/VerificationCode");
const xss = require("xss");
//const { default: renderEmpty } = require('antd/lib/config-provider/renderEmpty');

router.get("/", async (req, res) => {
  res.render("pages/register");
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

router.post("/", async (req, res) => {
  let personalinf = JSON.parse(JSON.stringify(req.body));
  //const personalinf = req.body;
    console.log(personalinf);
    const cookies = req.headers.cookie;
    var list = cookies.split("; ");
    for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
        if (arr[0] == "captcha") {
            var captcha = arr[1];
        }
    }
    
  if (!req.body) {
    res.status(400).render("pages/error",{ error: "You must provide body" + personalinf });
    return;
  }
  if (!personalinf.username) {
    res.status(400).render("pages/error",{ error: "You must provide post username" });
    return;
  }
  if (!personalinf.user.firstname) {
    res.status(400).render("pages/error",{ error: "You must provide post first name" });
    return;
  }
  if (!personalinf.user.lastname) {
      res.status(400).render("pages/error",{ error: "You must provide post last name" });
    return;
  }
  if (!personalinf.email) {
      res.status(400).render("pages/error",{ error: "You must provide post email" });
    return;
  }
  if (!personalinf.gender) {
      res.status(400).render("pages/error",{ error: "You must provide gender" });
    return;
  }
  if (!personalinf.address.city) {
      res.status(400).render("pages/error",{ error: "You must provide city" });
    return;
  }
  if (!personalinf.address.state) {
      res.status(400).render("pages/error",{ error: "You must provide state" });
    return;
  }
  if (!personalinf.BOD) {
      res.status(400).render("pages/error",{ error: "You must provide birthday" });
    return;
  }
  if (!personalinf.phone) {
      res.status(400).render("pages/error",{ error: "You must provide phone number" });
    return;
  }
  if (!personalinf.password) {
    res.status(400).render("pages/error",{ error: "You must provide password" });
    return;
  }
  if (personalinf.password.length < 10) {
    res.status(400).render("pages/error",{ error: "You password must has at last 10 digits" });
    return;
  }
  if (personalinf.verifiy != captcha) {
    res.status(401).render("pages/error", { error: "Code is wrong." });
    return;
  }

  try {
    const users = await customerinf.getAllUsers();
    let match = 0;
    for (let i in users) {
      if (users[i].username == personalinf.username) {
        match = 1;
      }
    }
    if (match == 0) {
      const newPost = await customerinf.createaccount(
        personalinf.username,
        {
          firstname: personalinf.user.firstname,
          lastname: personalinf.user.lastname,
        },
        personalinf.email,
        personalinf.gender,
        personalinf.address.city + ", " + personalinf.address.state,
        personalinf.BOD,
        personalinf.phone,
        personalinf.password
      );
      req.session.user = {
        userId: newPost._id.toString(),
        username: personalinf.username,
        firstName: personalinf.user.firstname,
        lastName: personalinf.user.lastname,
      };
      const output = `
    <p>You create a new account</p>
    <p>The username is ${personalinf.username} .</p>
`;


      let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,
        secure: false,
        auth: {
          user: "1648271784@qq.com",
          pass: "wyeqgnsoxracfcej",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOptions = {
        from: "1648271784@qq.com",
        to: req.body.email,
        subject: "Create a new account",
        text: "Welcome!",
        html: output,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
        console.log("Message sent");
      res.redirect("/users/login" + newPost._id.toString());
    } else {
      res.json({ message: "username already exist." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  if(!req.params.id){
    throw 'No id';
  }
  try {
    const post = await customerinf.getbyone(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json({ message: "Post not found " + e });
  }
});

router.patch("/:id", async (req, res) => {
  if(!req.params.id){
    throw 'No id';
  }
  if(!req.body){
    throw 'body wrong';
  }
  const requestBody = req.body;
  let updatedObject = {};
  try {
    const oldPost = await customerinf.getbyone(req.params.id);
    if (requestBody.user && requestBody.user !== oldPost.user)
      updatedObject.user = xss(requestBody.user);
    if (requestBody.email && requestBody.email !== oldPost.email)
      updatedObject.email = xss(requestBody.email);
    if (requestBody.gender && requestBody.gender !== oldPost.gender)
      updatedObject.gender = xss(requestBody.gender);
    if (requestBody.address && requestBody.address !== oldPost.address)
      updatedObject.address = xss(requestBody.address);
    if (requestBody.BOD && requestBody.BOD !== oldPost.BOD)
      updatedObject.BOD = xss(requestBody.BOD);
    if (requestBody.phone && requestBody.phone !== oldPost.phone)
      updatedObject.phone = xss(requestBody.phone);
    if (requestBody.password && requestBody.password !== oldPost.password)
      updatedObject.password = xss(requestBody.password);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedPost = await customerinf.update(
        req.params.id,
        updatedObject
      );
      res.json(updatedPost);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "You must Supply and ID to delete" });
    return;
  }
  try {
    await customerinf.getbyone(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  try {
    const result = await customerinf.remove(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//add the update user detail function
router.post("/userInfo/update", async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  let oldUserDetail = null;
  try {
    oldUserDetail = await customerinf.getByUserName(requestBody.username);
    if (requestBody.user && requestBody.user !== oldUserDetail.user)
      updatedObject.user = xss(requestBody.user);
    if (requestBody.email && requestBody.email !== oldUserDetail.email)
      updatedObject.email = xss(requestBody.email);
    if (requestBody.gender && requestBody.gender !== oldUserDetail.gender)
      updatedObject.gender = xss(requestBody.gender);
    if (requestBody.address && requestBody.address !== oldUserDetail.address)
      updatedObject.address = xss(requestBody.address);
    if (requestBody.BOD && requestBody.BOD !== oldUserDetail.BOD)
      updatedObject.BOD = xss(requestBody.BOD);
    if (requestBody.phone && requestBody.phone !== oldUserDetail.phone)
      updatedObject.phone = xss(requestBody.phone);
    if (requestBody.password && requestBody.password !== oldUserDetail.password)
      updatedObject.password = xss(requestBody.password);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedPost = await customerinf.update(
        oldUserDetail._id,
        updatedObject
      );
      res.json(updatedPost);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

module.exports = router;
