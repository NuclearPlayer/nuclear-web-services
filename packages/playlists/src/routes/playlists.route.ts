import { NextFunction, Request, Response, Router } from 'express';

import { Route } from '@nws/core';
import { UuidRegex } from '@nws/core/src/regex';

import { PlaylistsController } from '../controllers/playlists.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

export class PlaylistsRoute implements Route {
  public path = '/playlists';
  public router = Router();
  public playlistsController = new PlaylistsController();

  constructor() {
    this.initializeRoutes();
  }

  makeRoute(route: string) {
    return `${this.path}${route}`;
  }

  initializeRoutes() {
    this.router.post(this.makeRoute(''), authMiddleware, this.playlistsController.postPlaylist);
    this.router.get(
      this.makeRoute(`/:id(${UuidRegex})`),
      optionalAuthMiddleware,
      this.playlistsController.getPlaylist,
      (err: Error, req: Request, res: Response, next: NextFunction) =>
        this.playlistsController.getPlaylist(req, res, next),
    );
  }
}
