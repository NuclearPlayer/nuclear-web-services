import { CrudService } from '@nws/core';

import { CreateTrackDto } from '../dtos/tracks.dto';
import { Artist } from '../models/artists.model';
import { Track } from '../models/tracks.model';
import { ArtistService } from './artists.service';

export class TrackService implements CrudService<Track, CreateTrackDto> {
  public tracks = Track;
  public artistService = new ArtistService();

  findAll(): Promise<Track[]> {
    throw new Error('Method not implemented.');
  }

  findOneById(id: string): Promise<Track | null> {
    return this.tracks.findByPk(id);
  }

  async findOneByArtistAndName(artist: string, name: string): Promise<Track | null> {
    const foundArtist = await this.artistService.findOneByName(artist);
    if (!Boolean(foundArtist)) {
      return null;
    }
    return this.tracks.findOne({
      where: {
        artistId: foundArtist?.id,
        name,
      },
      include: [Artist],
    });
  }

  create(data: CreateTrackDto): Promise<Track> {
    return this.tracks.create(data);
  }
}
