import { CrudService } from '../../../core/src/types';
import { CreateArtistDto } from '../dtos/artists.dto';
import { Artist } from '../models/artists.model';
import { Playlist } from '../models/playlists.model';

export class ArtistService implements CrudService<Artist, CreateArtistDto> {
  public artists = Artist;

  findAll(): Promise<Artist[]> {
    throw new Error('Method not implemented.');
  }

  create(data: CreateArtistDto) {
    return this.artists.create(data);
  }

  findOneById(id: string): Promise<Artist | null> {
    return this.artists.findByPk(id);
  }

  findOneByName(name: string): Promise<Artist | null> {
    return this.artists.findOne({ where: { name } });
  }
}
