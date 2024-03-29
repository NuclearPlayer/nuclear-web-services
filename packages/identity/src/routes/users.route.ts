import { Router } from 'express';

import { UuidRegex } from '@nws/core/src/regex';
import { Route } from '@nws/core/src/types';

import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/isAdmin.middleware';
import { isSameUser } from '../middleware/isSameUser.middleware';

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
    this.router.get(this.makeRoute(''), authMiddleware, isAdmin, this.usersController.getUsers);
    this.router.get(this.makeRoute(`/:id(${UuidRegex})`), authMiddleware, isSameUser, this.usersController.getUserById);
    this.router.post(this.makeRoute(''), authMiddleware, isAdmin, this.usersController.postUser);
    this.router.patch(this.makeRoute(`/:id(${UuidRegex})`), authMiddleware, isSameUser, this.usersController.patchUser);
  }
}
