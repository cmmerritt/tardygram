import request from 'supertest';
import app from '../lib/app.js';
import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';

describe('post routes', () => {

  let agent;
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

  it('creates a post via POST', async () => {
    const res = await agent
      .post('/api/v1/posts')
      .send({
        userId: user.id,
        photoUrl: 'stonkphoto',
        caption: 'My embarrassing LiveJournal post circa 2003',
        tags: ['wow', 'stonk', 'stronk']
      });

    expect(res.body).toEqual({
      id: '1',
      userId: '1',
      photoUrl: 'stonkphoto',
      caption: 'My embarrassing LiveJournal post circa 2003',
      tags: ['wow', 'stonk', 'stronk']
    });
  });

  it('responds with a list of all posts', async () => {
    const dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    const thestonkpost = await Post.insert({
      id: '1',
      userId: '1',
      photoUrl: 'stonkphoto',
      caption: 'My embarrassing LiveJournal post circa 2003',
      tags: ['wow', 'stonk', 'stronk']
    });

    const res = await request(app)
      .get('/api/v1/posts');
        
    expect(res.body).toEqual([dogepost, thestonkpost]);
  });

  it('gets a post by id', async() => {
    const dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    const res = await request(app)
      .get(`/api/v1/posts/${dogepost.id}`);
    expect(res.body).toEqual(dogepost);
  });

  it('updates a post via PATCH', async() => {
    const dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    dogepost.caption = 'wow, very doge';

    const res = await agent
      .patch(`/api/v1/posts/${dogepost.id}`)
      .send({ caption: 'wow, very doge' });

    expect(res.body).toEqual(dogepost);
  });

  it('deletes a post', async() => {
    const dogepost = await Post.insert({
      userId: user.id,
      photoUrl: 'doge',
      caption: 'wow, much doge',
      tags: ['doge', 'wow']
    });

    const res = await agent
      .delete(`/api/v1/posts/${dogepost.id}`);
      // .send(dogepost);
    
    expect(res.body).toEqual(dogepost);
  });
});

