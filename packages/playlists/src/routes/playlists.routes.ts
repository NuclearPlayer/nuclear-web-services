import { Router } from 'express';

import { Route } from '@nws/core/src/types';

import { PlaylistsController } from '../controllers/playlists.controller';
import { authMiddleware } from '../middleware/auth.middleware';

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
  }
}
