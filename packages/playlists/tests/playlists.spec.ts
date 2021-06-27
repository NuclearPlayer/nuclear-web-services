import fetch from 'node-fetch';
import supertest from 'supertest';

import App from '../src/app';
import { PlaylistsRoute } from '../src/routes/playlists.route';
import { createPlaylist, createToken } from './utils';

jest.mock('node-fetch');

describe('Playlists route tests', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  const app = new App([new PlaylistsRoute()]);

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        id: '8281df2b-77b9-4005-9062-566eb9bd1503',
        username: 'test-user',
      }),
    });
  });

  it('tries to create a new playlist with a valid token (200)', async () => {
    const token = createToken();
    const { body, statusCode } = await createPlaylist(app, token);

    expect(statusCode).toEqual(201);
    expect(body).toEqual({
      id: expect.any(String),
      author: '8281df2b-77b9-4005-9062-566eb9bd1503',
      name: 'new playlist',
      tracks: [],
      private: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to create a new playlist without a valid token (401)', async () => {
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      statusCode: 401,
      json: jest.fn().mockResolvedValue({}),
    });
    const { body, statusCode } = await supertest(app.getServer()).post('/playlists').send({
      name: 'new playlist',
      tracks: [],
    });

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to get a public playlist without a token (200)', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token);

    //@ts-ignore
    fetch.mockResolvedValueOnce({
      statusCode: 401,
      json: jest.fn().mockResolvedValue({}),
    });
    const { body, statusCode } = await supertest(app.getServer()).get(`/playlists/${id}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: expect.any(String),
      author: '8281df2b-77b9-4005-9062-566eb9bd1503',
      name: 'new playlist',
      tracks: [],
      private: false,
    });
  });

  it('tries to get a private playlist without a token (401)', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    const { body, statusCode } = await supertest(app.getServer()).get(`playlists/${id}`);

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it("tries to get another user's private playlist with a token (403)", async () => {
    let token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    token = createToken('ce791a3c-5b8e-4ffb-91ad-dfc2bd747796');
    const { body, statusCode } = await supertest(app.getServer())
      .get(`playlists/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(403);
    expect(body).toEqual({});
  });

  it('tries to get own private playlist with a valid token (200)', async () => {
    let token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    const { body, statusCode } = await supertest(app.getServer())
      .get(`playlists/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: expect.any(String),
      author: '8281df2b-77b9-4005-9062-566eb9bd1503',
      name: 'new playlist',
      tracks: [],
      private: true,
    });
  });

  it('tries to get a nonexistent playlist (404)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).get('playlists/5a80302b-ff5e-4899-89f1-3fda85b69ae3');

    expect(statusCode).toEqual(404);
    expect(body).toEqual({});
  });

  it("tries to get all of a user's public playlists without a token (200)", async () => {
    let token = createToken();
    await createPlaylist(app, token);
    await createPlaylist(app, token, { name: 'another playlist' });
    await createPlaylist(app, token, { name: 'yet another playlist' });
    await createPlaylist(app, token, { name: 'a private playlist', private: true });

    const { body, statusCode } = await supertest(app.getServer()).get(
      'users/8281df2b-77b9-4005-9062-566eb9bd1503/playlists',
    );

    expect(statusCode).toEqual(200);
    expect(body).toEqual([
      expect.objectContaining({ name: 'new playlist' }),
      expect.objectContaining({ name: 'another playlist' }),
      expect.objectContaining({ name: 'yet another playlist' }),
    ]);
  });
});
