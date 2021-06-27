import jwt from 'jsonwebtoken';
import { omit } from 'lodash';

import { Service } from '@nws/core/src/types';

import { User } from '../models/users.model';
import { UserService } from './users.service';

export class AuthService implements Service {
  public users = User;
  public userService = new UserService();

  createToken(user: User) {
    const dataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET as string;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      user: omit(user, 'password'),
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}
