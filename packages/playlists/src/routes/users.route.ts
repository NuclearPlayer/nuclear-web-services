import { NextFunction, Request, Response, Router } from 'express';

import { Route } from '@nws/core/src/types';

import { UuidRegex } from '../../../core/src/regex';
import { PlaylistsController } from '../controllers/playlists.controller';
import { optionalAuthMiddleware } from '../middleware/auth.middleware';

export class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public playlistsController = new PlaylistsController();

  constructor() {
    this.initializeRoutes();
  }

  makeRoute(route: string) {
    return `${this.path}${route}`;
  }

  initializeRoutes() {
    this.router.get(
      this.makeRoute(`/:id(${UuidRegex})/playlists`),
      optionalAuthMiddleware,
      this.playlistsController.getPlaylistsByUserId,
      (err: Error, req: Request, res: Response, next: NextFunction) =>
        this.playlistsController.getPlaylistsByUserId(req, res, next),
    );
  }
}
