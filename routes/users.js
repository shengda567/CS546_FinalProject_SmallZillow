//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

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

router.post('/login', async (req, res) => {

	const { username, password } = req.body;
    var check = false;

    try{

        for(var i in users)
        {
            if(users[i].username == username)
            {
                check = true;
                var match = false;
                match = bcrypt.compareSync(password, users[i].hashedPassword);
                if(match){

                    res.redirect('/private');
                }
                else {
                    res.status(401).render('pages/error', {error: "Either username or password are error."});
                }
            }
        }
        if(check == false)
        {
            res.status(401).render('pages/error', {error: "Username is not exist."});
        }
    }catch(e){
    res.status(401).render('pages/error', {error: e});
  }

});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
  //res.send('Logged out');
});

module.exports = router;
