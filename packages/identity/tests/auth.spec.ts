import supertest from 'supertest';

import App from '../src/app';
import { AuthRoute } from '../src/routes/auth.route';
import { UserService } from '../src/services/users.service';

describe('Auth controller tests', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  let userService = new UserService();
  let app = new App([new AuthRoute()]);

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().query('DELETE FROM Users');
  });

  it('tries to sign up (201)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).post('/signup').send({
      username: 'test-user',
      email: 'test@example.com',
      password: 'asdQWE123',
    });

    expect(statusCode).toEqual(201);
    expect(body).toEqual({
      id: expect.any(String),
      username: 'test-user',
      displayName: 'test-user',
      email: 'test@example.com',
      accountState: 'UNCONFIRMED',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to sign up with invalid field values (400)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).post('/signup').send({
      username: 'te',
      email: 'invalid email',
      password: 'abc',
    });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: [
        'username must be at least 4 characters',
        'email must be a valid email',
        'password must be at least 6 characters',
      ],
    });
  });

  it('tries to sign up with invalid username values (400)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).post('/signup').send({
      username: 'admin',
      email: 'email@example.com',
      password: 'abcDEF123',
    });

    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      message: ['this username is reserved'],
    });
  });

  it('tries to sign in after signing up (200)', async () => {
    await supertest(app.getServer()).post('/signup').send({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abcDEF123',
    });

    const { body, statusCode } = await supertest(app.getServer()).post('/signin').send({
      username: 'test-user',
      password: 'abcDEF123',
    });

    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      expiresIn: 3600,
      token: expect.any(String),
      user: {
        id: expect.any(String),
        username: 'test-user',
        displayName: 'test-user',
        email: 'test@example.com',
        accountState: 'UNCONFIRMED',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('tries to sign in with invalid credentials (401)', async () => {
    const { body, statusCode } = await supertest(app.getServer()).post('/signin').send({
      username: 'test-user',
      password: 'abc',
    });

    expect(statusCode).toEqual(401);
    expect(body).toEqual({ message: 'Incorrect username or password' });
  });
});
