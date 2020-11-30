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

router.get("/", async (req, res) => {
  res.render("pages/findpassword");
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

	//const { username, email, password, verifiy } = req.body;
    let personalinf = JSON.parse(JSON.stringify(req.body));
    var check = false;
    const userCollection = await users();
    const userdata = await userCollection.find({}).toArray();
    const parsedData = JSON.stringify(userdata);
    const userList = JSON.parse(parsedData);
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
           
            for(var i in userList)
            {
                if(userList[i].username == personalinf.username)
                {
                    
                    if(userList[i].email == personalinf.email)
                    {
                        const inputinf = {};
                        inputinf.password = personalinf.password;
                        
                        const change = await customerinf.update(userList[i]._id, inputinf);
                       
                        if(change.length == 0)
                        {
                            res.status(401).render('pages/error', {error: "We fail to updata password."});
                        }
                        res.redirect('/login');
                    }
                    else {
                        res.status(401).render('pages/error', {error: "Either username or Email are error."});
                    }
                }
            }
            if(check == false)
            {
                res.status(401).render('pages/error', {error: "Username is not exist."});
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