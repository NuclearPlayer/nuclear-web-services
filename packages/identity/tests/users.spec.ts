import supertest from 'supertest';
import { UuidRegex } from '@nws/core/src/regex';

import App from '../src/app';
import { User } from '../src/models/users.model';
import { UsersRoute } from '../src/routes/users.route';
import { UserService } from '../src/services/users.service';

describe('User controller tests', () => {
  let app = new App([new UsersRoute()]);
  let userService = new UserService();

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().query('DELETE FROM Users');
  });

  it('get user (200)', async () => {
    const newUser = await userService.create({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abc',
    });

    const { body, statusCode } = await supertest(app.getServer()).get(`/users/${newUser.id}`);

    expect(statusCode).toEqual(200);

    expect(body).toEqual({
      id: newUser.id,
      username: 'test-user',
      displayName: 'test-user',
      email: 'test@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(body.password).toBeUndefined();

    const [[row]] = await app.getDb().query(`SELECT password FROM Users WHERE id='${newUser.id}'`);
    expect((row as User).password).toEqual(expect.stringContaining('$2b$10$'));
  });

  it('get user (404)', async () => {
    await supertest(app.getServer())
      .get('/users/4f81d38f-692a-40ec-840b-080ceb5cd730')
      .expect(404, { message: 'User with id 4f81d38f-692a-40ec-840b-080ceb5cd730 not found' });
  });

  it('post user', async () => {
    const { body, statusCode } = await supertest(app.getServer())
      .post('/users')
      .send({ username: 'test-user', email: 'test2@example.com', password: 'abc' });

    expect(statusCode).toEqual(201);

    expect(body).toEqual({
      id: expect.stringMatching(UuidRegex),
      username: 'test-user',
      displayName: 'test-user',
      email: 'test2@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('patch user', async () => {
    const newUser = await userService.create({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abc',
    });

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/${newUser.id}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: newUser.id,
      username: 'test-user',
      displayName: 'new display name',
      email: 'test@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('patch user (404)', async () => {
    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/4f81d38f-692a-40ec-840b-080ceb5cd730`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(404);
    expect(body).toEqual({ message: 'User with id 4f81d38f-692a-40ec-840b-080ceb5cd730 not found' });
  });
});
