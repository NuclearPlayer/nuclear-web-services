import supertest from 'supertest';

import App from '../src/app';
import { PlaylistsRoute } from '../src/routes/playlists.route';
import { UsersRoute } from '../src/routes/users.route';
import { createPlaylist, createToken, mockGetTokenOK } from './utils';

jest.mock('node-fetch');

describe('Users route tests', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  const app = new App([new PlaylistsRoute(), new UsersRoute()]);

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
    jest.resetAllMocks();
    mockGetTokenOK();
  });

  it('tries to get all of a users public playlists without a token (200)', async () => {
    mockGetTokenOK();
    mockGetTokenOK();
    mockGetTokenOK();
    let token = createToken();
    await createPlaylist(app, token);
    await createPlaylist(app, token, { name: 'another playlist' });
    await createPlaylist(app, token, { name: 'yet another playlist' });
    await createPlaylist(app, token, { name: 'a private playlist', private: true });

    const { body, statusCode } = await supertest(app.getServer()).get(
      '/users/8281df2b-77b9-4005-9062-566eb9bd1503/playlists',
    );

    expect(statusCode).toEqual(200);
    expect(body).toEqual([
      expect.objectContaining({ name: 'new playlist' }),
      expect.objectContaining({ name: 'another playlist' }),
      expect.objectContaining({ name: 'yet another playlist' }),
    ]);
  });

  it('tries to get all of a users public playlists with a token (200)', async () => {
    mockGetTokenOK();
    mockGetTokenOK();
    mockGetTokenOK();
    let token = createToken();
    await createPlaylist(app, token);
    await createPlaylist(app, token, { name: 'another playlist' });
    await createPlaylist(app, token, { name: 'yet another playlist' });
    await createPlaylist(app, token, { name: 'a private playlist', private: true });

    mockGetTokenOK();
    const { body, statusCode } = await supertest(app.getServer())
      .get('/users/8281df2b-77b9-4005-9062-566eb9bd1503/playlists')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual([
      expect.objectContaining({ name: 'new playlist' }),
      expect.objectContaining({ name: 'another playlist' }),
      expect.objectContaining({ name: 'yet another playlist' }),
      expect.objectContaining({ name: 'a private playlist' }),
    ]);
  });
});
