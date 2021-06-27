import { Request, Response, NextFunction } from 'express';

import { CreatePlaylistDto } from '../dtos/playlists.dto';
import { PlaylistService } from '../services/playlists.service';
import { AuthenticatedRequest } from '../types';

export class PlaylistsController {
  public playlistService = new PlaylistService();

  public postPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as AuthenticatedRequest;
    const data: CreatePlaylistDto = req.body;

    try {
      const newPlaylist = await this.playlistService.create({
        ...data,
        author: user.id,
      });

      res.status(201).json(newPlaylist);
    } catch (error) {
      return next(error);
    }
  };
}
