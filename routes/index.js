const postRoutes = require("./posts");
const userRoutes = require("./users");
const searchRoutes = require("./search");

//const privateRoutes = require('./private');
const registerData = require("./register");
//const commentRoutes = require('./comments');

const constructorMethod = (app) => {
  app.get("/", function (req, res) {
    res.render("pages/mainPage");
  });
  app.use("/search", searchRoutes);
  app.use("/posts", postRoutes);
  //app.use('/private', privateRoutes);
  app.use("/register", registerData);
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
