import { CrudService } from '@nws/core/src/types';

import { CreatePlaylistDto } from '../dtos/playlists.dto';
import { Playlist } from '../models/playlists.model';

export class PlaylistService implements CrudService<Playlist, CreatePlaylistDto> {
  public playlists = Playlist;

  findAll(): Promise<Playlist[]> {
    return this.playlists.findAll({ include: ['tracks'] });
  }

  findOneById(id: string): Promise<Playlist | null> {
    return this.playlists.findByPk(id, { include: ['tracks'] });
  }

  async findAllByUserId(userId: string, includePrivate?: boolean) {
    const allPlaylists = await this.playlists.findAll({ where: { author: userId } });
    return includePrivate ? allPlaylists : allPlaylists.filter((playlist) => !playlist.private);
  }

  create(data: CreatePlaylistDto): Promise<Playlist> {
    return this.playlists.create(
      {
        ...data,
        tracks: [],
      },
      { include: ['tracks'] },
    );
  }
}
