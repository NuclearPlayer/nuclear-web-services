import { Request, Response, NextFunction } from 'express';
import pick from 'lodash/pick';

import { HttpException } from '../../../core/src';
import { CreatePlaylistDto, UpdatePlaylistDto } from '../dtos/playlists.dto';
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

  public getPlaylistsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const { user, params } = req as AuthenticatedRequest;
    const { id } = params;

    try {
      const playlists = await this.playlistService.findAllByUserId(id, user?.id === id);

      res.status(200).json(playlists);
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

      res.status(201).json({
        ...pick(newPlaylist, 'id', 'author', 'name', 'private', 'createdAt', 'updatedAt'),
        tracks: newPlaylist.tracks.map((track) => pick(track, 'id', 'artistId', 'name', 'addedBy')),
      });
    } catch (error) {
      return next(error);
    }
  };

  public putPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const { user, params } = req as AuthenticatedRequest;
    const data: UpdatePlaylistDto = req.body;
    const { id } = params;

    try {
      const updatedPlaylist = await this.playlistService.update(id, {
        ...data,
        author: user.id,
      });

      res.status(200).json(updatedPlaylist);
    } catch (error) {
      return next(error);
    }
  };
}
