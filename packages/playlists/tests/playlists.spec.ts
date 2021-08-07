import supertest from 'supertest';

import App from '../src/app';
import { PlaylistsRoute } from '../src/routes/playlists.route';
import { createPlaylist, createToken, mockGetTokenFail, mockGetTokenOK } from './utils';

jest.mock('node-fetch');

describe('Playlists route tests', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  const app = new App([new PlaylistsRoute()]);

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
    jest.resetAllMocks();
    mockGetTokenOK();
  });

  it('tries to create a new empty playlist with a valid token (200)', async () => {
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
    mockGetTokenFail();
    const { body, statusCode } = await supertest(app.getServer()).post('/playlists').send({
      name: 'new playlist',
      tracks: [],
    });

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to create a new playlist without required fields (400)', async () => {
    const token = createToken();
    const { body, statusCode } = await supertest(app.getServer())
      .post('/playlists')
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: ['author is a required field', 'name is a required field'],
    });
  });

  it('tries to create a new playlist with invalid field values (400)', async () => {
    const token = createToken();
    const { body, statusCode } = await supertest(app.getServer())
      .post('/playlists')
      .send({
        name: 'ab',
        author: 123,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: ['author must be a valid UUID', 'name must be at least 3 characters'],
    });
  });

  it('tries to get a public playlist without a token (200)', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token);

    mockGetTokenFail();
    const { body, statusCode } = await supertest(app.getServer()).get(`/playlists/${id}`);

    expect(statusCode).toEqual(200);
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

  it('tries to get a private playlist without a token (403)', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    mockGetTokenFail();
    const { body, statusCode } = await supertest(app.getServer()).get(`/playlists/${id}`);

    expect(statusCode).toEqual(403);
    expect(body).toEqual({
      message: 'Forbidden',
    });
  });

  it("tries to get another user's private playlist with a token (403)", async () => {
    let token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    token = createToken('ce791a3c-5b8e-4ffb-91ad-dfc2bd747796');
    const { body, statusCode } = await supertest(app.getServer())
      .get(`/playlists/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(403);
    expect(body).toEqual({
      message: 'Forbidden',
    });
  });

  it('tries to get own private playlist with a valid token (200)', async () => {
    let token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, { private: true });

    mockGetTokenOK();
    const { body, statusCode } = await supertest(app.getServer())
      .get(`/playlists/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: expect.any(String),
      author: '8281df2b-77b9-4005-9062-566eb9bd1503',
      name: 'new playlist',
      tracks: [],
      private: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to get a nonexistent playlist (404)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).get(
      '/playlists/5a80302b-ff5e-4899-89f1-3fda85b69ae3',
    );

    expect(statusCode).toEqual(404);
    expect(body).toEqual({});
  });

  // it('tries to patch own playlist (200)', async () => {
  //   const token = createToken();
  //   const {
  //     body: { id },
  //   } = await createPlaylist(app, token);

  //   mockGetTokenOK();
  //   const { body, statusCode } = await supertest(app.getServer())
  //     .patch(`/playlists/${id}`)
  //     .send({
  //       tracks: [
  //         {
  //           name: 'test track',
  //           artistId: 'artist-id-1',
  //           playlistId: id,
  //         },
  //         {
  //           name: 'test track 2',
  //           artistId: 'artist-id-2',
  //           playlistId: id,
  //         },
  //       ],
  //     })
  //     .set('Authorization', `Bearer ${token}`);

  //   expect(statusCode).toEqual(204);
  //   expect(body).toBeUndefined();
  // });
});
