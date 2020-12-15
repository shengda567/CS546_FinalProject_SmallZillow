const express = require("express");
const app = express();
const configRoutes = require("./routes");
const session = require("express-session");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const cookieParase = require("cookie-parser");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },

  partialsDir: ["views/partials/"],
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.engine("handlebars", handlebarsInstance.engine);
app.use(cookieParase());
app.set("view engine", "handlebars");

handlebarsInstance.handlebars.registerHelper({
  grouped_each: function (every, context, options) {
    var out = "",
      subcontext = [],
      i;
    if (context && context.length > 0) {
      for (i = 0; i < context.length; i++) {
        if (i > 0 && i % every === 0) {
          out += options.fn(subcontext);
          subcontext = [];
        }
        subcontext.push(context[i]);
      }
      out += options.fn(subcontext);
    }
    return out;
  },
  post_notEmpty: function (list) {
    if (list.length != 0) {
      return true;
    } else {
      return false;
    }
  },
});

app.use(
  session({
    name: "AwesomeWebApp",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    //cookie: { maxAge: 60000 },
  })
);
app.use(async (req, res, next) => {
  if (req.session.user) {
    res.locals.userLoggedIn = true;
  } else {
    res.locals.userLoggedIn = false;
  }

  if (req.session.manager) {
    res.locals.managerLoggedIn = true;
  } else {
    res.locals.managerLoggedIn = false;
  }
  next();
});
app.use("/private", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

// app.use("/login/check", (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect("/private");
//   } else {
//     //here I',m just manually setting the req.method to post since it's usually coming from a form
//     //res.render('pages/login');
//     req.method = "POST";
//     next();
//   }
// });

app.use("/manager/login", (req, res, next) => {
  if (req.session.manager) {
    return res.redirect("/manager/private");
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    res.render("pages/manager_login");
    //req.method = 'POST';
    //next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
