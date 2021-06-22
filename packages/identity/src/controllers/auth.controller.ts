import { HttpException } from '@nws/core';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json(req.user);
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as AuthenticatedRequest;

    if (user) {
      const token = this.authService.createToken(user);
      res.status(200).json(token);
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  };
}
