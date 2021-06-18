import { Router } from 'express';
import { Route } from '@nws/core/src/types';
import { UuidRegex } from '@nws/core/src/regex';

import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/isAdmin.middleware';

export class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  makeRoute(route: string) {
    return `${this.path}${route}`;
  }

  initializeRoutes() {
    this.router.get(this.makeRoute(''), this.usersController.getUsers);

    this.router.get(this.makeRoute(`/:id(${UuidRegex})`), authMiddleware, this.usersController.getUserById);

    this.router.post(this.makeRoute(''), authMiddleware, isAdmin, this.usersController.postUser);

    this.router.patch(this.makeRoute(`/:id(${UuidRegex})`), authMiddleware, this.usersController.patchUser);
  }
}
