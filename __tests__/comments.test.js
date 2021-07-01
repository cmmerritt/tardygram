import request from 'supertest';
import setup from '../data/setup.js';
import app from '../lib/app.js';
import Comment from '../lib/models/Comment.js';
import Post from '../lib/models/Post.js';
import UserService from '../lib/services/UserService.js';
import pool from '../lib/utils/pool.js';

describe('comment routes', () => {

  let agent;
  let dogepost = {};
  let user = {};

  beforeEach(async () => {
    await setup(pool);
    agent = request.agent(app);
    user = await UserService.create({
      username: 'stonky',
      password: 'stonks',
      profilePhotoUrl: 'https://slate.com/business/2021/01/stonks-not-stocks-got-it.html'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'stonky',
        password: 'stonks'
      });
  });

  it('creates a comment via POST', async () => {
    dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    const res = await agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        post: dogepost.id,
        comment: 'so scare'
      });

    expect(res.body).toEqual({
      id: '1',
      commentBy: user.id,
      post: dogepost.id,
      comment: 'so scare'
    });
  });

  it('deletes a comment', async() => {
    const dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    const dogecomment = await Comment.insert({
      commentBy: user.id,
      post: dogepost.id,
      comment: 'so scare'
    });

    const res = await agent
      .delete(`/api/v1/comments/${dogecomment.id}`);
    
    expect(res.body).toEqual(dogecomment);
  });
});

