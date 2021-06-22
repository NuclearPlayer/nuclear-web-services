import { omit } from 'lodash';
import { User } from '../src/models/users.model';
import { GroupService } from '../src/services/groups.service';
import { UserService } from '../src/services/users.service';

export const userToJson = (user: User) => ({
  ...omit(user.toJSON(), 'password'),
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const createNewUser = (userService: UserService, data?: Partial<User>) =>
  userService.create({
    username: 'test-user',
    email: 'test@example.com',
    password: 'abc',
    ...data,
  });

export const createGroup = (groupService: GroupService, group?: string) =>
  groupService.create({
    name: group ?? 'admin',
  });
