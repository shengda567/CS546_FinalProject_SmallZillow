//Shuoyu Wang
const { request } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const ManagersData = data.managers;
const bcryptjs = require("bcryptjs");

router.get("/login", async (req, res) => {
  res.render("pages/manager_login");
});

router.get("/signup", async (req, res) => {
  res.render("pages/manager_signup");
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
      managerInfo.username
    );
    if (tempMana) {
      res.json({ message: "username already exist!" });
    } else {
      const {
        username,
        password,
        email,
        manager_level,
        managerCode,
      } = managerInfo;
      const newManager = await ManagersData.addManager(
        username,
        password,
        email,
        manager_level,
        managerCode
      );
      res.json(newManager);
      // res.render('pages/manager');
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
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
  const requestBody = req.body;
  let updateObj = {};
  try {
    let oldManager = await ManagersData.getManagerById(req.params.id);
    if (requestBody.username && requestBody.username !== oldManager.username) {
      updateObj.username = requestBody.username;
    }
    if (requestBody.password) {
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
    if (requestBody.email && requestBody.email !== oldManager.email) {
      updateObj.email = requestBody.email;
    }
    if (
      requestBody.manager_level &&
      requestBody.manager_level !== oldManager.manager_level
    ) {
      updateObj.manager_level = requestBody.manager_level;
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
      res.json(updatedManager);
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
  const requestBody = req.body;
  let updateObj = {};
  try {
    let oldManager = await ManagersData.getManagerById(req.params.id);
    if (requestBody.username && requestBody.username !== oldManager.username) {
      updateObj.username = requestBody.username;
    }
    if (requestBody.password) {
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
    if (requestBody.email && requestBody.email !== oldManager.email) {
      updateObj.email = requestBody.email;
    }
    if (
      requestBody.manager_level &&
      requestBody.manager_level !== oldManager.manager_level
    ) {
      updateObj.manager_level = requestBody.manager_level;
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
      res.json(updatedManager);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({ error: `No manager have been updated` });
  }
});

module.exports = router;
