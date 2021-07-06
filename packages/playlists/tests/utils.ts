import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import supertest from 'supertest';

export const createToken = (id?: string) =>
  jwt.sign({ id: id ?? '8281df2b-77b9-4005-9062-566eb9bd1503' }, process.env.JWT_SECRET as string);

export const createPlaylist = async (app: any, token: string, data?: object) =>
  supertest(app.getServer())
    .post('/playlists')
    .send({
      author: '8281df2b-77b9-4005-9062-566eb9bd1503',
      name: 'new playlist',
      tracks: [],
      ...data,
    })
    .set('Authorization', `Bearer ${token}`);

export const createArtist = async (app: any, token?: string, data?: object) => {
  const test = supertest(app.getServer())
    .post('/artists')
    .send({
      name: 'new artist',
      ...data,
    });
  if (token) {
    test.set('Authorization', `Bearer ${token}`);
  }

  return test;
};

export const mockGetTokenOK = () =>
  // @ts-ignore
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      id: '8281df2b-77b9-4005-9062-566eb9bd1503',
      username: 'test-user',
    }),
  });

export const mockGetTokenFail = () =>
  // @ts-ignore
  fetch.mockResolvedValueOnce({
    statusCode: 401,
    json: jest.fn().mockResolvedValue({}),
  });
