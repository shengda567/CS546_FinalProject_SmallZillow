//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const pic = require('../data/VerificationCode');

router.get('/', async (req, res) => {
  //res.json({ route: '/users', method: req.method });

  if (req.session.user) {
    res.redirect('/private');
  }else{
    res.render('pages/login');
  }
});

router.post('/', async (req, res) => {
  res.json({ route: '/users', method: req.method });
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

router.post('/login', async (req, res) => {

	const { username, password, verifiy } = req.body;
    var check = false;

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
	if(verifiy == captcha)
        {
           
            for(var i in users)
            {
                if(users[i].username == username)
                {
                    check = true;
                    var match = false;
                    match = bcrypt.compareSync(password, users[i].hashedPassword);
                    if(match){
                        req.session.user = { userId: users[i]._id, username: users[i].username, firstName: users[i].firstName, lastName: users[i].lastName, Profession: users[i].Profession, Bio: users[i].Bio };
                        res.redirect('/private');
                    }
                    else {
                        res.status(401).render('handlebars/error', {error: "Either username or password are error."});
                    }
                }
            }
            if(check == false)
            {
                res.status(401).render('handlebars/error', {error: "Username is not exist."});
            }   
        
        }
        else
        {
            
            res.status(401).render('handlebars/error', {error: "Code is wrong."});
        }
    }catch(e){
    res.status(401).render('handlebars/error', {error: e});
  }
	
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
  //res.send('Logged out');
});

module.exports = router;
