import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth.js';
import Post from '../models/Post.js';

export default Router()
  .post('/api/v1/posts', ensureAuth, (req, res, next) => {
    Post.insert({ ...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/api/v1/posts', async(req, res, next) => {
    Post.findPosts()
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/api/v1/posts/:id', async(req, res, next) => {
    Post.findPostById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })
  .patch('/api/v1/posts/:id', ensureAuth, (req, res, next) => {
    Post.patch(req.body, req.params.id)
      .then(post => res.send(post))
      .catch(next);
  });
