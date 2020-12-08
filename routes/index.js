const postRoutes = require("./posts");
const userRoutes = require("./users");
const searchRoutes = require("./search");
const commentRoutes = require("./comments");
const managerRoutes = require("./managers");
const findRoutes = require("./find");
const data = require("../data");
const apiRoutes = require("./api");
const postsData = data.posts;

//const privateRoutes = require('./private');
const registerData = require("./register");
//const commentRoutes = require('./comments');

const constructorMethod = (app) => {
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
      res.render("pages/mainPage", { posts: newList });
    } catch (e) {
      res.render("pages/mainPage", { errors: "No posts in the databse" });
    }
  });
  app.use("/search", searchRoutes);
  app.use("/posts", postRoutes);
  app.use("/comments", commentRoutes);
  //app.use('/private', privateRoutes);
  app.use("/register", registerData);

  app.use("/managers", managerRoutes);
  app.use("/login", userRoutes);
  app.use("/find", findRoutes);
  app.use("/api", apiRoutes);

  //app.use('/comments', commentRoutes);

  app.get("/newpost", async (req, res) => {
    res.render("pages/newpost");
  });

  app.get("/newpost/success", async (req, res) => {
    res.render("pages/newpostsuc");
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
