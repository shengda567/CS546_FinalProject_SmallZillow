//Shuoyu Wang

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const data = require("../data");
const managersData = data.managers;
const registersData = data.register;
const pic = require("../data/VerificationCode");

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

  router.post("/checkManager", async (req, res) => {

    const { username, password, verifiy } = req.body;
    let usernameCheck = false;
    let passwordCheck = false;
    let verifyCheck = false;


    const cookies = req.headers.cookie;
    var list = cookies.split("; ");
    for (var i = 0; i < list.length; i++) {
      var arr = list[i].split("=");
      if (arr[0] == "captcha") {
        var captcha = arr[1];
      }
    }
    if (verifiy == captcha) {
        verifyCheck = true;
    }

    if(verifyCheck){
        try{
            let manager = await managersData.getManagerByUsername(username);
            if(manager){
                usernameCheck = true;
            }else{
                res.status(401).render("pages/error", {
                    error: "Username is not exist.",
                  });
            }

            passwordCheck = bcrypt.compareSync(password, manager.hashedPassword);
            if(passwordCheck){
                req.session.manager = {
                    managerId: manager._id,
                    username: manager.username,
                    email: manager.email,
                    manager_level: manager.manager_level,
                    manager_history: manager.manager_history
                }
                res.redirect("/managerLogin/" + req.session.manager.managerId);
            }else{
                res.status(401).render("pages/error", {
                    error: "Either username or password are error.",
                  });
            }

        }catch(e){
            console.log(e);
        }
    }else{
        res.status(401).render("pages/error", { error: "verify code is wrong." });
    }
  });


  router.get("/:id", async (req, res) => {
    if (req.session.manager) {
        let managerInfo = await managersData.getManagerByUsername(req.session.manager.username);
        let allRegisters = await registersData.getAllUsers();
        let registerLists = [];
        for(let i of allRegisters){
            registerLists.push({id: i._id, username: i.username });
        }
        res.render("pages/managercenter", {manager: managerInfo, currentRegister: registerLists})
    } else {
      res.render("pages/manager_login");
    }
  });




module.exports = router;