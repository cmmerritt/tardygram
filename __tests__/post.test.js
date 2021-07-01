import { agent } from "supertest";

describe('post routes', () => {

  it('creates a post via POST', async () => {
    const res = await agent
      .post('/api/v1/posts')
      .send({
        text: 'My embarrassing LiveJournal post circa 2003'
      });

    expect(res.body).toEqual({
      id: '1',
      userId: '1',
      text: 'My embarrassing LiveJournal post circa 2003'
    });
  });
});

