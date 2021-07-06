import { Router } from 'express';

import { Route } from '@nws/core';
import { validate } from '@nws/core/src/middleware';

import { ArtistsController } from '../controllers/artists.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { PostArtistRequestSchema } from '../schemas/artists.schema';

export class ArtistsRoute implements Route {
  public path = '/artists';
  public router = Router();
  public artistsController = new ArtistsController();

  constructor() {
    this.initializeRoutes();
  }

  makeRoute(route: string) {
    return `${this.path}${route}`;
  }

  initializeRoutes() {
    this.router.post(
      this.makeRoute(''),
      authMiddleware,
      validate(PostArtistRequestSchema),
      this.artistsController.postArtist,
    );
  }
}
