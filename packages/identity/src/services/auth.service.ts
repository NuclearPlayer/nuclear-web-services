import { HttpException } from '@nws/core';
import { Service } from '@nws/core/src/types';
import { Op } from 'sequelize/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/users.model';
import { UserService } from './users.service';
import { JWT_SECRET } from '../consts';
import { omit } from 'lodash';

export class AuthService implements Service {
  public users = User;
  public userService = new UserService();

  public async signIn(user: User) {
    const findUser = await this.users.findOne({
      where: { [Op.or]: [{ email: user.email }, { username: user.username }] },
      attributes: { include: ['password'] },
    });

    if (!findUser) {
      throw new HttpException(400, 'Invalid credentials');
    }

    const isPasswordMatching: boolean = await bcrypt.compare(user.password, findUser.password);
    if (!isPasswordMatching) {
      throw new HttpException(400, 'Invalid credentials');
    }

    return this.createToken(findUser);
  }

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
