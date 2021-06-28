import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@nws/core';

import { AuthenticatedRequest } from '../types';

export const isSameUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;

    if (!user) {
      return next(new HttpException(401, 'Unauthenticated'));
    }

    if (user.id !== id) {
      return next(new HttpException(403, 'Forbidden'));
    }

    return next();
  } catch (e) {
    return next(new HttpException(403, 'Forbidden'));
  }
};
