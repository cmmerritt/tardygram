import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request, { agent } from 'supertest';
import app from '../lib/app.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'stonky',
        password: 'stonks',
        profilePhotoUrl: 'https://slate.com/business/2021/01/stonks-not-stocks-got-it.html'
      });

    expect(res.body).toEqual({
      id: '1',
      username: 'stonky',
      profilePhotoUrl: 'https://slate.com/business/2021/01/stonks-not-stocks-got-it.html'
    });
  });
  it('login a user via POST', async() => {
    const res = await agent
      .post('/api/v1/auth/login')
      .send({ 
        username: 'stonky',
        password: 'stonks'
      });
    
    expect(res.body).toEqual({
      id: '1',
      username: 'stonky'
    });
  });
});
