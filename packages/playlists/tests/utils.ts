import jwt from 'jsonwebtoken';
import supertest from 'supertest';

export const createToken = (id?: string) =>
  jwt.sign({ id: id ?? '8281df2b-77b9-4005-9062-566eb9bd1503' }, process.env.JWT_SECRET as string);

export const createPlaylist = async (app: any, token: string, data?: object) =>
  await supertest(app.getServer())
    .post('/playlists')
    .send({
      name: 'new playlist',
      tracks: [],
      ...data,
    })
    .set('Authorization', `Bearer ${token}`);
