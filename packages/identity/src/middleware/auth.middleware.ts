import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { HttpException } from '@nws/core';

import { AuthenticatedRequest, JWTData } from '../types';
import { JWT_SECRET } from '../consts';
import { UserService } from '../services/users.service';

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    if (token) {
      const secret = JWT_SECRET;
      const { id } = jwt.verify(token, secret) as JWTData;
      const findUser = await new UserService().findOneById(id);
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Invalid authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (e) {
    next(new HttpException(401, 'Token expired'));
  }
};
