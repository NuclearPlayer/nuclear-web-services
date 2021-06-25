import { CreatePlaylistDto } from 'dtos/playlists.dto';
import { Request, Response, NextFunction } from 'express';
import { PlaylistService } from 'services/playlists.service';

export class PlaylistsController {
  public playlistService = new PlaylistService();

  public postPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthenticatedRequest;
    const data: CreatePlaylistDto = req.body;

    try {
      const newPlaylist = await this.playlistService.create({
        ...data,
        author: user.id,
      });
    } catch (error) {
      return next(error);
    }
  };
}
