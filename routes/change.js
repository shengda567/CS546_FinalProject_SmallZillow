//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.register;
const pic = require('../data/VerificationCode');
const data = require("../data");
const customerinf = data.register;
const nodemailer = require('nodemailer');

router.get("/", async (req, res) => {
  res.render("pages/changepassword");
});

router.get('/api/getCaptcha', function(req, res, next) {
  let p = 'ABCDEFGHKMNPQRSTUVWXYZ1234567890';
  var str = '';
  for (var i = 0; i < 4; i++)
  {
    str += p.charAt(Math.random() * p.length | 0);
  }
  res.cookie('captcha', str);
  let img = pic.makeCapcha(str);
  res.setHeader('Content-Type', 'image/bmp');
  res.end(img.getFileData());

})


router.post('/check', async (req, res) => {
  if(!req.session.user){
    res.status(400).json('ops, something wrong!');
  }

	//const { username, email, password, verifiy } = req.body;
    let personalinf = JSON.parse(JSON.stringify(req.body));
    var check = false;
    const userCollection = await users();
    
    try{
	const cookies = req.headers.cookie;
        var list = cookies.split("; ");
        for(var i = 0; i < list.length; i++)
	{
            var arr = list[i].split("=");
            if(arr[0] == 'captcha')
            {
                 var captcha = arr[1];
            }

        }
	if(personalinf.verifiy == captcha)
        {
            if (req.session.user) {
            let users = await customerinf.getbyone(req.session.user.userId);
            let personalinf = JSON.parse(JSON.stringify(req.body));
            
            if (personalinf.oldpassword == users.password) {
                const inputinf = {};
                inputinf.password = personalinf.newpassword;
                const change = await customerinf.update(req.session.user.userId, inputinf);
                if (change.length == 0) {
                    res.status(401).render('pages/error', { error: "We fail to updata password." });
                }
                res.redirect('/users/myaccount');
            }
                else {
                    res.status(401).render('pages/error', { error: "The old password is error." });
                }
            }
            else {
            res.render("pages/login");
            }
            
           
        }
        else
        {

            res.status(401).render('pages/error', {error: "Code is wrong."});
        }
    }catch(e){
    res.status(401).render('pages/error', {error: e});
  }

});



module.exports = router;

