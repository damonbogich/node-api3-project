const express = require('express');


const userHubs = require('./userDb');
const postHubs = require('../posts/postDb');

const router = express.Router();

router.use(express.json());

router.post('/', validateUser, (req, res) => {
  
  userHubs.insert(req.user)
    .then(newUser => {
      res.status(200).json(newUser);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "server error adding user"})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postHubs.insert(req.post)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    res.status(500).json({err: "server error"})
  })
});

router.get('/', (req, res) => {
  userHubs.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: "server error"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const {id} = req.params;
  userHubs.getById(id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({err: "server error"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const {id} = req.params;

  userHubs.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: "server error"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const {id} = req.params;

  userHubs.remove(id)
  .then(removed => {
    res.status(200).json(removed)
  })
  .catch(err => {
    res.status(500).json({err: "server error deleting user"})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  const {id} = req.params;
  const user = req.body;
  

  userHubs.update(id, user)
  .then(updated => {
    res.status(201).json(updated)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: "server errror"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  userHubs.getById(id)
  .then(user => {
      if(!user) {
          res.status(400).json({message: "invalid user id"})
      } else {
          req.user = user;
          console.log(req.user);
          next()
      }
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({err: "server err"})
  })
};

function validateUser(req, res, next) {
  const user = req.body;

  if(!user) {
      res.status(400).json({message: "missing user data"})
  } else if(!user.name) {
      res.status(400).json({message: "missing required name field"})
  } else {
      req.user = user
      next();
  }
};

function validatePost(req, res, next) {
  const {id} = req.params
  const post = {...req.body, user_id: id};

  
      if(!post) {
          res.status(400).json({message: "missing post data"})
      } else if (!post.text) {
          res.status(400).json({message: "missing required text field"})
      } else {
          req.post = post;
          next();
      }
  
}



module.exports = router;
