const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const { Blog } = require('../models/Blog');
const { Comment } = require('../models/Comment.js');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const data = await Blog.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const data = await Blog.getById(req.params.id);
      await data.addComments();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .post('/:id/comments', [authenticate], async (req, res, next) => {
    try {
      const comment = await Comment.insert({
        blogId: req.params.id,
        userId: req.user.id,
        detail: req.body,
      });
      res.json(comment);
    } catch (e) {
      next(e);
    }
  });
