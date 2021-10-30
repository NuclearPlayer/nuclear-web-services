import supertest from 'supertest';

import App from '../src/app';
import { ArtistsRoute } from '../src/routes/artists.route';
import { createArtist, createToken, mockGetTokenOK } from './utils';

jest.mock('node-fetch');
describe('Artists route - `POST', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  const app = new App([new ArtistsRoute()]);

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
    jest.resetAllMocks();
    mockGetTokenOK();
  });

  it('tries to create a new artist with a valid token (201)', async () => {
    const token = createToken();
    const { body, statusCode } = await createArtist(app, token);

    expect(statusCode).toEqual(201);
    expect(body).toEqual({
      id: expect.any(String),
      name: 'new artist',
      addedBy: '8281df2b-77b9-4005-9062-566eb9bd1503',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to create a new artist without a valid token (401)', async () => {
    const { body, statusCode } = await createArtist(app);

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to create a new artist without required parameter (400)', async () => {
    const token = createToken();
    const { body, statusCode } = await supertest(app.getServer())
      .post('/artists')
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: 'Validation error',
      errors: [
        {
          message: 'name is a required field',
          path: 'name',
        },
      ],
    });
  });

  it('tries to create a new artist with the same token twice (200)', async () => {
    const token = createToken();
    await createArtist(app, token);
    mockGetTokenOK();
    const { body, statusCode } = await createArtist(app, token);

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: expect.any(String),
      name: 'new artist',
      addedBy: '8281df2b-77b9-4005-9062-566eb9bd1503',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});

describe('Artists route - GET', () => {});
