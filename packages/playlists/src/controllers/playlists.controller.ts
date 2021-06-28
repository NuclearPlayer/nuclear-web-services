import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../../../core/src';
import { CreatePlaylistDto } from '../dtos/playlists.dto';
import { PlaylistService } from '../services/playlists.service';
import { AuthenticatedRequest } from '../types';

export class PlaylistsController {
  public playlistService = new PlaylistService();

  public getPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const { user, params } = req as AuthenticatedRequest;
    const { id } = params;

    try {
      const playlist = await this.playlistService.findOneById(id);

      if (!playlist) {
        res.send(404);
      }

      if (playlist?.private && (!user || user.id !== playlist.author)) {
        throw new HttpException(403, 'Forbidden');
      }

      res.status(200).json(playlist);
    } catch (error) {
      return next(error);
    }
  };

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
