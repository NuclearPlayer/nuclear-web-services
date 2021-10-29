import supertest from 'supertest';

import App from '../src/app';
import { PlaylistsRoute } from '../src/routes/playlists.route';
import { createPlaylist, createToken, expectPlaylistWithTracks, mockGetTokenFail, mockGetTokenOK } from './utils';

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

  it('tries to create a new empty playlist with a valid token (201)', async () => {
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
      message: 'Validation error',
      errors: [{ path: 'name', message: 'name is a required field' }],
    });
  });

  it('tries to create a new playlist with invalid field values (400)', async () => {
    const token = createToken();
    const { body, statusCode } = await supertest(app.getServer())
      .post('/playlists')
      .send({
        name: 'ab',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: 'Validation error',
      errors: [
        {
          message: 'name must be at least 3 characters',
          path: 'name',
        },
      ],
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

  it('tries to create a new playlist with tracks (201)', async () => {
    const token = createToken();
    const { body, statusCode } = await createPlaylist(app, token, {
      tracks: [
        {
          artist: 'new artist',
          name: 'new track',
        },
        {
          artist: 'new artist',
          name: 'new track',
        },
        {
          artist: 'new artist',
          name: 'new track 2',
        },
        {
          artist: 'another artist',
          name: 'new track',
        },
      ],
    });

    expect(statusCode).toEqual(201);
    expectPlaylistWithTracks(body, [
      { name: 'new track' },
      { name: 'new track' },
      { name: 'new track 2' },
      { name: 'new track' },
    ]);
    expect(body.tracks[0].artistId).toEqual(body.tracks[1].artistId);
    expect(body.tracks[0].artistId).toEqual(body.tracks[2].artistId);
    expect(body.tracks[0].artistId).not.toEqual(body.tracks[3].artistId);
  });

  it('tries to put own playlist (200)', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token);

    mockGetTokenOK();
    const { body, statusCode } = await supertest(app.getServer())
      .put(`/playlists/${id}`)
      .send({
        tracks: [
          {
            name: 'test track',
            artist: 'artist-1',
          },
          {
            name: 'test track 2',
            artist: 'artist-2',
          },
        ],
      })
      .set('Authorization', `Bearer ${token}`);

    expectPlaylistWithTracks(body, [{ name: 'test track' }, { name: 'test track 2' }]);

    expect(statusCode).toEqual(200);
  });

  it('put should not modify tracks if they are not in the request', async () => {
    const token = createToken();
    const {
      body: { id },
    } = await createPlaylist(app, token, {
      tracks: [
        {
          name: 'test track',
          artist: 'artist-1',
        },
        {
          name: 'test track 2',
          artist: 'artist-2',
        },
      ],
    });

    mockGetTokenOK();
    const { body, statusCode } = await supertest(app.getServer())
      .put(`/playlists/${id}`)
      .send({ name: 'updated name', private: true })
      .set('Authorization', `Bearer ${token}`);

    expectPlaylistWithTracks(body, [{ name: 'test track' }, { name: 'test track 2' }], {
      name: 'updated name',
      private: true,
    });

    expect(statusCode).toEqual(200);
  });
});
