import { Router } from 'express';

import { Route } from '@nws/core';

import { validatorMiddleware } from '../../../core/src/middleware';
import { ArtistsController } from '../controllers/artists.controller';
import { PostArtistRequestDto } from '../dtos/artists.dto';
import { authMiddleware } from '../middleware/auth.middleware';

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
      validatorMiddleware(PostArtistRequestDto),
      this.artistsController.postArtist,
    );
  }
}
