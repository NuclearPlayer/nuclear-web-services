import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { UuidRegex } from '@nws/core/src/regex';

import App from '../src/app';
import { User } from '../src/models/users.model';
import { UsersRoute } from '../src/routes/users.route';
import { UserService } from '../src/services/users.service';
import { JWT_SECRET } from '../src/consts';

describe('User controller tests', () => {
  let app = new App([new UsersRoute()]);
  let userService = new UserService();

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().query('DELETE FROM Users');
  });

  it('tries to get a user (200)', async () => {
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
      accountState: 'UNCONFIRMED',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(body.password).toBeUndefined();

    const [[row]] = await app.getDb().query(`SELECT password FROM Users WHERE id='${newUser.id}'`);
    expect((row as User).password).toEqual(expect.stringContaining('$2b$10$'));
  });

  it('tries to get nonexistent user (404)', async () => {
    await supertest(app.getServer())
      .get('/users/4f81d38f-692a-40ec-840b-080ceb5cd730')
      .expect(404, { message: 'User with id 4f81d38f-692a-40ec-840b-080ceb5cd730 not found' });
  });

  it('tries to post user (200)', async () => {
    const { body, statusCode } = await supertest(app.getServer())
      .post('/users')
      .send({ username: 'test-user', email: 'test2@example.com', password: 'abc' });

    expect(statusCode).toEqual(201);

    expect(body).toEqual({
      id: expect.stringMatching(UuidRegex),
      username: 'test-user',
      displayName: 'test-user',
      email: 'test2@example.com',
      accountState: 'UNCONFIRMED',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to patch the same user (200)', async () => {
    const newUser = await userService.create({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abc',
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET);

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      id: newUser.id,
      username: 'test-user',
      displayName: 'new display name',
      email: 'test@example.com',
      accountState: 'UNCONFIRMED',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('tries to patch another user (403)', async () => {
    const newUser = await userService.create({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abc',
    });

    const newUser2 = await userService.create({
      username: 'test-user-2',
      email: 'test2@example.com',
      password: 'abc',
    });

    const token = jwt.sign({ id: newUser2.id }, JWT_SECRET);

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(403);
    expect(body).toEqual({ message: 'This resource is inaccessible for the current user' });
  });

  it('tries to patch nonexistent user (403)', async () => {
    const newUser = await userService.create({
      username: 'test-user',
      email: 'test@example.com',
      password: 'abc',
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET);

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/4f81d38f-692a-40ec-840b-080ceb5cd730`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(403);
    expect(body).toEqual({ message: 'This resource is inaccessible for the current user' });
  });
});
