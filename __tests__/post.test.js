import request from 'supertest';
import app from '../lib/app.js';
import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import UserService from '../lib/services/UserService.js';

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
      userId: user.id,
      photoUrl: 'stonkphoto',
      caption: 'My embarrassing LiveJournal post circa 2003',
      tags: ['wow', 'stonk', 'stronk']
    });
  });
});

