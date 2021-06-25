import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { UuidRegex } from '@nws/core/src/regex';

import App from '../src/app';
import { User } from '../src/models/users.model';
import { UsersRoute } from '../src/routes/users.route';
import { UserService } from '../src/services/users.service';
import { GroupService } from '../src/services/groups.service';
import { createGroup, createNewUser, userToJson } from './utils';

describe('Users route tests', () => {
  process.env.JWT_SECRET = 'jwtsecret';
  let app = new App([new UsersRoute()]);
  let userService = new UserService();
  let groupService = new GroupService();

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
  });

  it('tries to get all users without a token (401)', async () => {
    await createNewUser(userService);

    const { body, statusCode } = await supertest(app.getServer()).get(`/users`);

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to get all users as non-admin (403)', async () => {
    const newUser = await createNewUser(userService);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer()).get(`/users`).set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(403);
    expect(body).toEqual({ message: 'Forbidden' });
  });

  it('tries to get all users as admin (200)', async () => {
    const newUser = await createNewUser(userService);
    const newUser2 = await createNewUser(userService, {
      username: 'test-user-2',
      email: 'test2@example.com',
    });
    const newGroup = await createGroup(groupService);
    await userService.addToGroup(newUser.id, newGroup.name);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer()).get(`/users`).set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual([userToJson(newUser), userToJson(newUser2)]);
  });

  it('tries to get nonexistent user (404)', async () => {
    await supertest(app.getServer())
      .get('/users/4f81d38f-692a-40ec-840b-080ceb5cd730')
      .expect(404, { message: 'User with id 4f81d38f-692a-40ec-840b-080ceb5cd730 not found' });
  });

  it('tries to get a user for a valid token for its own user (200)', async () => {
    const newUser = await createNewUser(userService);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer())
      .get(`/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(200);
    expect(body).toEqual(userToJson(newUser));
  });

  it('tries to get a user for an invalid token for an existing user (401)', async () => {
    const newUser = await createNewUser(userService);
    const token = jwt.sign({ id: newUser.id }, 'invalid secret');

    const { body, statusCode } = await supertest(app.getServer())
      .get(`/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to get a user for a token for a nonexistent user (401)', async () => {
    const token = jwt.sign({ id: 'abc' }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer())
      .get('/users/4f81d38f-692a-40ec-840b-080ceb5cd730')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toEqual(401);
    expect(body).toEqual({});
  });

  it('tries to post user as admin (200)', async () => {
    const newUser = await createNewUser(userService);
    const newGroup = await createGroup(groupService);
    await userService.addToGroup(newUser.id, newGroup.name);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
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
    expect(body.password).toBeUndefined();
    const [[row]] = await app.getDb().query(`SELECT password FROM Users WHERE id='${newUser.id}'`);
    expect((row as User).password).toEqual(expect.stringContaining('$2b$10$'));
  });

  it('tries to patch the same user (200)', async () => {
    const newUser = await createNewUser(userService);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

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
    const newUser = await createNewUser(userService);
    const newUser2 = await createNewUser(userService, {
      username: 'test-user-2',
      email: 'test2@example.com',
    });

    const token = jwt.sign({ id: newUser2.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(403);
    expect(body).toEqual({ message: 'Forbidden' });
  });

  it('tries to patch nonexistent user (403)', async () => {
    const newUser = await createNewUser(userService);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    const { body, statusCode } = await supertest(app.getServer())
      .patch(`/users/4f81d38f-692a-40ec-840b-080ceb5cd730`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'new display name' });
    expect(statusCode).toEqual(403);
    expect(body).toEqual({ message: 'Forbidden' });
  });
});

describe('Users service tests', () => {
  let app = new App([new UsersRoute()]);
  let userService = new UserService();
  let groupService = new GroupService();

  beforeAll(() => {
    app.connectToDatabase();
  });

  beforeEach(async () => {
    await app.getDb().sync({ force: true });
  });

  it('adds a group to a user', async () => {
    const newUser = await createNewUser(userService);
    const newGroup = await createGroup(groupService);

    await userService.addToGroup(newUser.id, newGroup.name);

    const groups = await userService.findUserGroups(newUser.id);

    expect(groups).toEqual([expect.objectContaining({ name: 'admin' })]);
  });
});
