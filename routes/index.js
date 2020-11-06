const postRoutes = require('./posts');
//const commentRoutes = require('./comments');

const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  //app.use('/comments', commentRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
