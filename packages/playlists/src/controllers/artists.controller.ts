import { Request, Response, NextFunction } from 'express';

import { CreateArtistDto } from '../dtos/artists.dto';
import { ArtistService } from '../services/artists.service';
import { AuthenticatedRequest } from '../types';

export class ArtistsController {
  public artistService = new ArtistService();

  public postArtist = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as AuthenticatedRequest;
    const data: CreateArtistDto = req.body;

    try {
      const foundArtist = await this.artistService.findOneByName(data.name);
      if (foundArtist) {
        return res.status(200).json(foundArtist);
      } else {
        const newArtist = await this.artistService.create({
          ...data,
          addedBy: user.id,
        });
        return res.status(201).json(newArtist);
      }
    } catch (error) {
      return next(error);
    }
  };
}
