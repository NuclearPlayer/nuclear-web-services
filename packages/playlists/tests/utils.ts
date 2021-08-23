import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import supertest from 'supertest';

import { CreatePlaylistDto } from '../src/dtos/playlists.dto';
import { Playlist } from '../src/models/playlists.model';

export const DEFAULT_USER_ID = '8281df2b-77b9-4005-9062-566eb9bd1503';

export const createToken = (id?: string) => jwt.sign({ id: id ?? DEFAULT_USER_ID }, process.env.JWT_SECRET as string);

export const createPlaylist = async (app: any, token: string, data?: Partial<CreatePlaylistDto>) =>
  supertest(app.getServer())
    .post('/playlists')
    .send({
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
      id: DEFAULT_USER_ID,
      username: 'test-user',
    }),
  });

export const mockGetTokenFail = () =>
  // @ts-ignore
  fetch.mockResolvedValueOnce({
    statusCode: 401,
    json: jest.fn().mockResolvedValue({}),
  });

export const expectPlaylistWithTracks = (body: object, tracks: { name: string }[], options?: Partial<Playlist>) =>
  expect(body).toEqual({
    id: expect.any(String),
    author: DEFAULT_USER_ID,
    name: 'new playlist',
    tracks: tracks.map((track) => ({
      id: expect.any(String),
      artistId: expect.any(String),
      addedBy: DEFAULT_USER_ID,
      ...track,
    })),
    private: false,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    ...options,
  });
