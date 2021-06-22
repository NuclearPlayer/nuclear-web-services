import { omit } from 'lodash';
import { User } from '../src/models/users.model';

export const userToJson = (user: User) => ({
  ...omit(user.toJSON(), 'password'),
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
