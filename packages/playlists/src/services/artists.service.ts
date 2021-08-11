import { CrudService } from '../../../core/src/types';
import { CreateArtistDto } from '../dtos/artists.dto';
import { Artist } from '../models/artists.model';

export class ArtistService implements CrudService<Artist, CreateArtistDto> {
  public artists = Artist;

  findAll(): Promise<Artist[]> {
    throw new Error('Method not implemented.');
  }

  async create(data: CreateArtistDto) {
    const [artist] = await this.artists.findOrCreate({
      where: {
        name: data.name,
      },
      defaults: data,
    });
    return artist;
  }

  findOneById(id: string): Promise<Artist | null> {
    return this.artists.findByPk(id);
  }

  findOneByName(name: string): Promise<Artist | null> {
    return this.artists.findOne({ where: { name } });
  }
}
