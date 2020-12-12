//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const router = express.Router();
const data = require("../data");
const customerinf = data.register;
var bodyParser = require("body-parser");
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.register;


router.get('/', async (req, res) => {
    //res.json({ route: '/users', method: req.method });

    if (req.session.user) {
        res.render("pages/editprofile");
    } else {
        res.render('pages/login');
    }
});

router.post("/edit", async (req, res) => {
    const requestBody = JSON.parse(JSON.stringify(req.body));
    const userCollection = await users();
    const userdata = await userCollection.find({}).toArray();
    const parsedData = JSON.stringify(userdata);
    const userList = JSON.parse(parsedData);
    let updatedObject = {};
    
    const oldPost = await customerinf.getbyone(req.session.user.userId);
    updatedObject.user.firstname = requestBody.firstname;
    res.json(updatedObject.user.firstname);
    if (typeof (oldPost) == "undefined") {
        res.status(401).render('pages/error', { error: "We can't find this user profile." });
    }
    try {
        
        if (requestBody.firstname && requestBody.firstname !== oldPost.user.firstname)
            updatedObject.user.firstname = requestBody.firstname;
        if (requestBody.lastname && requestBody.lastname !== oldPost.user.lastname)
            updatedObject.user.lastname = requestBody.lastname;
        if (requestBody.email && requestBody.email !== oldPost.email)
            updatedObject.email = requestBody.email;
        if (requestBody.gender && requestBody.gender !== oldPost.gender)
            updatedObject.gender = requestBody.gender;
        if (requestBody.address.city && requestBody.address.city !== oldPost.address.city)
            updatedObject.address.city = requestBody.address.city;
        if (requestBody.address.state && requestBody.address.state !== oldPost.address.state)
            updatedObject.address.state = requestBody.address.state;
        if (requestBody.BOD && requestBody.BOD !== oldPost.BOD)
            updatedObject.BOD = requestBody.BOD;
        if (requestBody.phone && requestBody.phone !== oldPost.phone)
            updatedObject.phone = requestBody.phone;
    } catch (e) {
        res.status(401).render('pages/error', { error: "Error in update profile." + e});
        return;
    }
    if (Object.keys(updatedObject).length !== 0) {
        try {
            const updatedPost = await customerinf.update(
                oldPost._id,
                updatedObject
            );
            res.redirect('/login');
        } catch (e) {
            res.status(401).render('pages/error', { error: "We fail to update the profile." });
        }
    } else {
        res.status(401).render('pages/error', { error: "No fields have been changed from their inital values, so no update has occurred" });
      
    }
});

module.exports = router;