import { HttpException } from '@nws/core';
import { NextFunction, Response } from 'express';

import { UserService } from '../services/users.service';
import { AuthenticatedRequest, UserGroup } from '../types';

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    if (!user) {
      return next(new HttpException(403, 'Unauthenticated'));
    }

    const groups = (await new UserService().findUserGroups(user.id))?.map((group) => group.name);
    if (!groups?.includes(UserGroup.ADMIN)) {
      return next(new HttpException(401, 'Unauthorized'));
    }
  } catch (e) {
    next(new HttpException(401, 'Unauthorized'));
  }
};
