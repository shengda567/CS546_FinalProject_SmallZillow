//Shuoyu Wang
const { request } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const ManagersData = data.managers;
const bcryptjs = require("bcryptjs");
const pic = require("../data/VerificationCode");
const xss = require("xss");

router.get("/login", async (req, res) => {
  res.render("pages/manager_login");
});

router.get("/signup", async (req, res) => {
  res.render("pages/manager_signup");
});

router.get("/forgetpassword", async (req, res) => {
  res.render("pages/manager_forgetpassword");
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

router.post("/managerforgetpassword", async (req, res) => {
  const managerInfo = req.body;
  let errors = [];

  if (!managerInfo) {
    errors.push("you must provide body");
  }

  if (!managerInfo.username) {
    errors.push("you must provide username");
  }

  if (!managerInfo.email) {
    errors.push("you must provide email");
  }

  if (!managerInfo.manager_level) {
    errors.push("you must provide manager Level");
  }

  if (!managerInfo.managerCode) {
    errors.push("you must provide manager code");
  }

  let verifyCheck = false;
  const cookies = req.headers.cookie;
  var list = cookies.split("; ");
  for (var i = 0; i < list.length; i++) {
    var arr = list[i].split("=");
    if (arr[0] == "captcha") {
      var captcha = arr[1];
    }
  }
  if (managerInfo.verifiy === captcha) {
    verifyCheck = true;
  }

  if (!verifyCheck) {
    errors.push("verify code is wrong.");
    res.status(401).render("pages/errors_managerforgetpassword", {
      errors: errors,
      hasErrors: true,
    });
    return;
  } else {
    let tempMana = {};
    tempMana = await ManagersData.getManagerByUsername(managerInfo.username);
    if (!tempMana) {
      errors.push("username does not exist");
      res.status(401).render("pages/errors_managerforgetpassword", {
        errors: errors,
        hasErrors: true,
      });
      return;
    }

    let managerVerifyBL = false;
    managerVerifyBL = await ManagersData.compareManagerCodeHelper(
      managerInfo.manager_level,
      managerInfo.managerCode
    );

    if (
      tempMana.email != managerInfo.email ||
      tempMana.manager_level != managerInfo.manager_level ||
      !managerVerifyBL
    ) {
      errors.push(
        "Sorry, could not change password. The input information wrong, please check again"
      );
    }
    if (errors.length > 0) {
      res.status(401).render("pages/errors_managerforgetpassword", {
        errors: errors,
        hasErrors: true,
      });
      return;
    } else {
      req.session.manager = {
        managerId: tempMana._id,
        username: tempMana.username,
        email: tempMana.email,
        manager_level: tempMana.manager_level,
        manager_history: tempMana.manager_history,
      };
      res.redirect("/managers/newpassword/" + req.session.manager.managerId);

      // res.redirect('/managers/newpassword/' + )
      // res.render('pages/manager_newpassword', {id: tempMana._id});
    }
  }
});

router.get("/newpassword/:id", async (req, res) => {
  let errors = [];
  if (!req.session.manager) {
    errors.push("can not change password, something wrong");
  }
  if (!req.session.manager.username) {
    errors.push("can not change password, something wrong");
  }
  if (errors.length > 0) {
    res.status(401).render("pages/errors_managerforgetpassword", {
      errors: errors,
      hasErrors: true,
    });
    return;
  }

  try {
    let managerInfo = {};
    managerInfo = await ManagersData.getManagerByUsername(
      req.session.manager.username
    );
    res.render("pages/manager_newpassword", {
      manager: managerInfo,
    });
  } catch (e) {
    res.status(401).render("pages/error", {
      error: "Could not set new password for admin account",
    });
  }
});

router.post("/", async (req, res) => {
  //username, password, email, manager_level, managerCode
  const managerInfo = req.body;
  if (!managerInfo) {
    res.status(400).json({ error: "you must provide body" });
  }
  if (!managerInfo.username) {
    res.status(400).json({ error: "you must provide username" });
  }
  if (!managerInfo.password) {
    res.status(400).json({ error: "you must provide password" });
  }
  if (!managerInfo.email) {
    res.status(400).json({ error: "you must provide email" });
  }
  if (!managerInfo.manager_level) {
    res.status(400).json({ error: "you must provide manager Level" });
  }
  if (!managerInfo.managerCode) {
    res.status(400).json({ error: "you must provide manager code" });
  }

  try {
    let tempMana = await ManagersData.getManagerByUsername(
      xss(managerInfo.username)
    );
    if (tempMana) {
      res.status(401).render("pages/error", {
        error: "Username is already exist.",
      });
    } else {
      const {
        username,
        password,
        email,
        manager_level,
        managerCode,
      } = managerInfo;
      const newManager = await ManagersData.addManager(
        xss(username),
        xss(password),
        xss(email),
        xss(manager_level),
        xss(managerCode)
      );
      //   res.json(newManager);
      res.render("pages/manager_login");
      // res.render('pages/manager');
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "you must provide manager ID" });
  }
  try {
    const manager = await ManagersData.getManagerById(req.params.id);
    res.json(manager);
    // res.render('pages/manager');
  } catch (e) {
    res.status(404).json({ message: "manager not found" });
  }
});

// username: username,
// hashedPassword: hash,
// email: email,
// manager_level: manager_level,
// manager_history: manageHistory

router.patch("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "you must provide ID" });
  }
  const requestBody = req.body;
  let updateObj = {};
  try {
    let oldManager = await ManagersData.getManagerById(req.params.id);
    if (
      requestBody.username &&
      requestBody.username !== xss(oldManager.username)
    ) {
      updateObj.username = requestBody.username;
    }
    if (xss(requestBody.password)) {
      let compareToMatch = false;
      try {
        compareToMatch = await bcryptjs.compare(
          requestBody.password,
          oldManager.password
        );
      } catch (e) {
        //no op
      }
      if (compareToMatch) {
        console.log("the new password and old one are same, this is bad");
      } else {
        console.log("the new password and old one are not same, this is good");
        updateObj.password = requestBody.password;
      }
    }
    if (requestBody.email && requestBody.email !== xss(oldManager.email)) {
      updateObj.email = requestBody.email;
    }
    if (
      requestBody.manager_level &&
      requestBody.manager_level !== xss(oldManager.manager_level)
    ) {
      updateObj.manager_level = xss(requestBody.manager_level);
    }
    if (requestBody.manager_history) {
      updateObj.manager_history = xss(requestBody.manager_history);
    }
  } catch (e) {
    res
      .status(404)
      .json({ error: `manager with id ${req.params.id} not found!` });
    return;
  }
  if (Object.keys(updateObj).length !== 0) {
    try {
      let updatedManager = await ManagersData.updateManager(
        req.params.id,
        updateObj
      );
      //   res.json(updatedManager);
      res.render("pages/manager_password_update");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({ error: `No manager have been updated` });
  }
});

router.patch("/:mId/:registerId", async (req, res) => {
  if (!req.params.mId) {
    res
      .status(400)
      .json({ error: "You must Supply a manager ID to delete register" });
    return;
  }
  if (!req.params.registerId) {
    res.status(400).json({ error: "You must Supply a register ID to delete" });
    return;
  }
  try {
    let manager = await ManagersData.deleteRegister(
      req.params.mId,
      req.params.registerId
    );
    res.json(manager);
  } catch (e) {
    throw e;
  }
  //Default function
});

router.patch("/:mId/:userId/:postId", async (req, res) => {
  if (!req.params.mId) {
    res
      .status(400)
      .json({ error: "You must Supply a manager ID to delete register" });
    return;
  }
  if (!req.params.userId) {
    res
      .status(400)
      .json({ error: `You must Supply a user ID to delete user's post` });
    return;
  }
  if (!req.params.postId) {
    res.status(400).json({ error: `You must Supply a post ID to delete` });
    return;
  }
  //Default function
});

router.patch("/:mId/:userId/:commentId", async (req, res) => {
  if (!req.params.mId) {
    res
      .status(400)
      .json({ error: "You must Supply a manager ID to delete register" });
    return;
  }
  if (!req.params.userId) {
    res
      .status(400)
      .json({ error: `You must Supply a user ID to delete user's comment` });
    return;
  }
  if (!req.params.commentId) {
    res.status(400).json({ error: `You must Supply a comment ID to delete` });
    return;
  }
  //Default function
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "you must supply an ID to delete manager" });
    return;
  }
  try {
    await ManagersData.getManagerById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "manager not found" });
    return;
  }
  try {
    const result = await ManagersData.removeManager(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json("you must provide id");
  }
  const requestBody = req.body;
  let updateObj = {};
  try {
    let oldManager = await ManagersData.getManagerById(req.params.id);
    if (
      requestBody.username &&
      requestBody.username !== xss(oldManager.username)
    ) {
      updateObj.username = requestBody.username;
    }
    if (xss(requestBody.password)) {
      let compareToMatch = false;
      try {
        compareToMatch = await bcryptjs.compare(
          requestBody.password,
          oldManager.password
        );
      } catch (e) {
        //no op
      }
      if (compareToMatch) {
        console.log("the new password and old one are same, this is bad");
      } else {
        console.log("the new password and old one are not same, this is good");
        updateObj.password = requestBody.password;
      }
    }
    if (requestBody.email && requestBody.email !== xss(oldManager.email)) {
      updateObj.email = requestBody.email;
    }
    if (
      requestBody.manager_level &&
      requestBody.manager_level !== xss(oldManager.manager_level)
    ) {
      updateObj.manager_level = xss(requestBody.manager_level);
    }
    if (requestBody.manager_history) {
      updateObj.manager_history = requestBody.manager_history;
    }
  } catch (e) {
    res
      .status(404)
      .json({ error: `manager with id ${req.params.id} not found!` });
    return;
  }
  if (Object.keys(updateObj).length !== 0) {
    try {
      let updatedManager = await ManagersData.updateManager(
        req.params.id,
        updateObj
      );
      //   res.json(updatedManager);
      res.render("pages/manager_password_update");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({ error: `No manager have been updated` });
  }
});

module.exports = router;
