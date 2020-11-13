//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require('express');
const router = express.Router();
const data = require('../data');
const customerinf = data.register;
var bodyParser = require('body-parser');

router.post('/', async (req, res) => {
  const personalinf = req.body;
  if (!req.body) {
    res.status(400).json({ error: 'You must provide body' + personalinf});
    return;
  }
  if (!personalinf.username) {
    res.status(400).json({ error: 'You must provide post username' });
    return;
  }
  if (!personalinf.user.firstname) {
    res.status(400).json({ error: 'You must provide post first name' });
    return;
  }
  if (!personalinf.user.lastname) {
    res.status(400).json({ error: 'You must provide post last name' });
    return;
  }
  if (!personalinf.email) {
    res.status(400).json({ error: 'You must provide post email' });
    return;
  }
  if (!personalinf.gender) {
    res.status(400).json({ error: 'You must provide gender' });
    return;
  }
  if (!personalinf.address.city) {
    res.status(400).json({ error: 'You must provide city' });
    return;
  }
  if (!personalinf.address.state) {
    res.status(400).json({ error: 'You must provide state' });
    return;
  }
  if (!personalinf.BOD) {
    res.status(400).json({ error: 'You must provide birthday' });
    return;
  }
  if (!personalinf.phone) {
    res.status(400).json({ error: 'You must provide phone number' });
    return;
  }
  if (!personalinf.password) {
    res.status(400).json({ error: 'You must provide password' });
    return;
  }
  if (personalinf.password.length < 10) {
    res.status(400).json({ error: 'You password must has at last 10 digits' });
    return;
  }

  try {
    const { username, user, email, gender, address, BOD, phone, password } = personalinf;
    const newPost = await customerinf.createaccount( username, user, email, gender, address, BOD, phone, password);
    res.json(newPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await customerinf.getbyone(req.params.id);
    res.json(post);
  } catch (e) {
    
    res.status(404).json({ message: 'Post not found ' + e });
  }
});

router.patch('/:id', async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  try {
    const oldPost = await customerinf.getbyone(req.params.id);
    if (requestBody.user && requestBody.user !== oldPost.user)
      updatedObject.user = requestBody.user;
    if (requestBody.email && requestBody.email !== oldPost.email)
      updatedObject.email = requestBody.email;
    if (requestBody.gender && requestBody.gender !== oldPost.gender)
      updatedObject.gender = requestBody.gender;
    if (requestBody.address && requestBody.address !== oldPost.address)
      updatedObject.address = requestBody.address;
    if (requestBody.BOD && requestBody.BOD !== oldPost.BOD)
      updatedObject.BOD = requestBody.BOD;
    if (requestBody.phone && requestBody.phone !== oldPost.phone)
      updatedObject.phone = requestBody.phone;
    if (requestBody.password && requestBody.password !== oldPost.password)
      updatedObject.password = requestBody.password;
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
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
    res
      .status(400)
      .json({
        error:
          'No fields have been changed from their inital values, so no update has occurred'
      });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply and ID to delete' });
    return;
  }
  try {
    await customerinf.getbyone(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  try {
    const result = await customerinf.remove(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


module.exports = router;