import { Service } from '@nws/core/src/types';
import jwt from 'jsonwebtoken';

import { User } from '../models/users.model';
import { UserService } from './users.service';
import { JWT_SECRET } from '../consts';
import { omit } from 'lodash';

export class AuthService implements Service {
  public users = User;
  public userService = new UserService();

  createToken(user: User) {
    const dataStoredInToken = { id: user.id };
    const secret: string = JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      user: omit(user, 'password'),
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}
