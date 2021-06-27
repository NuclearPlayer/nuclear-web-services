import { NextFunction, Response, Request } from 'express';

import { HttpException } from '@nws/core';

import { UserService } from '../services/users.service';
import { AuthenticatedRequest, UserGroup } from '../types';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthenticatedRequest;

    if (!user) {
      return next(new HttpException(401, 'Unauthenticated'));
    }

    const groups = (await new UserService().findUserGroups(user.id))?.map((group) => group.name);
    if (!groups?.includes(UserGroup.ADMIN)) {
      return next(new HttpException(403, 'Forbidden'));
    }

    return next();
  } catch (e) {
    return next(new HttpException(403, 'Forbidden'));
  }
};
