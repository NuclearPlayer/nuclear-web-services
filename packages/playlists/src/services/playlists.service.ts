import { CrudService } from '@nws/core/src/types';
import { CreatePlaylistDto } from 'dtos/playlists.dto';
import { Playlist } from 'models/playlists.model';

export class PlaylistService implements CrudService<Playlist, CreatePlaylistDto> {
  public playlists = Playlist;

  findAll(): Promise<Playlist[]> {
    throw new Error('Method not implemented.');
  }

  findOneById(id: string): Promise<Playlist | null> {
    throw new Error('Method not implemented.');
  }

  async findAllByUserId(userId: string, includePrivate?: boolean) {
    const allPlaylists = await this.playlists.findAll({ where: { author: userId } });
    return includePrivate ? allPlaylists : allPlaylists.filter((playlist) => !playlist.private);
  }

  create(data: CreatePlaylistDto): Promise<Playlist> {
    return this.playlists.create({
      ...data,
      tracks: [],
    });
  }
}
