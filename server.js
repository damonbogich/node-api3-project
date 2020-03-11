const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const usersRouter = require('./users/userRouter.js');
const postsRouter = require('./posts/postRouter.js');

const server = express();

//global middleware
server.use(helmet());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", usersRouter);

//custom middleware

function logger(req, res, next) {

  console.log(` ${req.method} to ${req.url} at [${new Date().toISOString()}]`);

  next();
};

module.exports = server;
