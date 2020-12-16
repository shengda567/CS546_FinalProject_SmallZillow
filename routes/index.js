const postRoutes = require("./posts");
const userRoutes = require("./users");
const searchRoutes = require("./search");
const commentRoutes = require("./comments");
const managerRoutes = require("./managers");
const aboutusRoutes = require("./aboutus");
const managerLogRoutes = require("./managerLogin");
const findRoutes = require("./find");
const data = require("../data");
const changeRoute = require("./change");
const apiRoutes = require("./api");
const postsData = data.posts;

//const privateRoutes = require('./private');
const registerData = require("./register");
//const commentRoutes = require('./comments');

const constructorMethod = (app) => {
  app.use("/search", searchRoutes);
  app.use("/posts", postRoutes);
  app.use("/comments", commentRoutes);
  //app.use('/private', privateRoutes);
  app.use("/register", registerData);
  app.use("/change", changeRoute);
  app.use("/managers", managerRoutes);
  app.use("/managerLogin", managerLogRoutes);
  app.use("/findinf", findRoutes);
  app.use("/api", apiRoutes);
  app.use("/users", userRoutes);
  app.use("/aboutus", aboutusRoutes);
  // home page
  app.get("/", async function (req, res) {
    // main page only shows recent 3 posts.
    try {
      let posts = await postsData.getAllPosts();
      const newList = [];
      for (let i = 0; i < 3; i++) {
        let item = {
          _id: posts[posts.length - i - 1]._id.toString(),
          title: posts[posts.length - i - 1].title,
          image: posts[posts.length - i - 1].img[0],
          price: posts[posts.length - i - 1].price,
          zipcode: posts[posts.length - i - 1].zipcode,
          city: posts[posts.length - i - 1].city,
        };
        newList.push(item);
      }

      res.status(200).render("pages/mainPage", { posts: newList });
    } catch (e) {
      res.render("pages/mainPage", { errors: "No posts in the databse" });
    }
  });
  app.get("/logout", async (req, res) => {
    req.session.destroy();
    console.log("User logged out");
    res.redirect("/");
    //res.send('Logged out');
  });

  //app.use('/comments', commentRoutes);

  app.get("/newpost", async (req, res) => {
    if (req.session.user) {
      res.render("pages/newpost");
    } else {
      res.render("pages/login");
    }
  });

  app.get("/newpost/success", async (req, res) => {
    res.render("pages/newpostsuc");
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
