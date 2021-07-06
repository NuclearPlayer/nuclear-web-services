import { Router } from 'express';

import { validate } from '@nws/core/src/middleware';
import { Route } from '@nws/core/src/types';

import { AuthController } from '../controllers/auth.controller';
import { signInMiddleware, signUpMiddleware } from '../middleware/auth.middleware';
import { SignUpRequestSchema } from '../schemas/auth.schema';

export class AuthRoute implements Route {
  public path = '';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  makeRoute(route: string) {
    return `${this.path}${route}`;
  }

  initializeRoutes() {
    this.router.post(
      this.makeRoute('/signup'),
      validate(SignUpRequestSchema),
      signUpMiddleware,
      this.authController.signUp,
    );

    this.router.post(this.makeRoute('/signin'), signInMiddleware, this.authController.signIn);
  }
}
