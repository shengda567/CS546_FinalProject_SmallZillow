const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const cookieParase = require('cookie-parser');


app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParase());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AwesomeWebApp',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 }
  })
);
app.use('/private', (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) {
    return res.redirect('/');
  } else {
    next();
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/private');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    res.render('pages/login');
    //req.method = 'POST';
    next();
  }
});

app.use('/manager/login', (req, res, next) => {
  if (req.session.manager) {
    return res.redirect('/manager/private');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    res.render('pages/manager_login');
    //req.method = 'POST';
    //next();
  }
});


configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
