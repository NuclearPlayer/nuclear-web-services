import { Router } from 'express';
import { Route } from '@nws/core/src/types';
import { AuthController } from '../controllers/auth.controller';
import { signInMiddleware, signUpMiddleware } from '../middleware/auth.middleware';

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
    this.router.post(this.makeRoute('/signup'), signUpMiddleware, this.authController.signUp);

    this.router.post(this.makeRoute('/signin'), signInMiddleware, this.authController.signIn);
  }
}
