const postRoutes = require('./posts');
const userRoutes = require('./users');
const privateRoutes = require('./private');

//const commentRoutes = require('./comments');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/posts', postRoutes);
    app.use('/private', privateRoutes);
  //app.use('/comments', commentRoutes);
  
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
