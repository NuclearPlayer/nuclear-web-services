import { CrudService } from '@nws/core/src/types';

import { CreatePlaylistDto } from '../dtos/playlists.dto';
import { Artist } from '../models/artists.model';
import { Playlist } from '../models/playlists.model';
import { Track } from '../models/tracks.model';
import { ArtistService } from './artists.service';
import { TrackService } from './tracks.service';

export class PlaylistService implements CrudService<Playlist, CreatePlaylistDto> {
  public playlists = Playlist;
  public artistService = new ArtistService();
  public trackService = new TrackService();

  findAll(): Promise<Playlist[]> {
    return this.playlists.findAll({ include: [Track] });
  }

  findOneById(id: string): Promise<Playlist | null> {
    return this.playlists.findByPk(id, { include: [Track] });
  }

  async findAllByUserId(userId: string, includePrivate?: boolean) {
    const allPlaylists = await this.playlists.findAll({ where: { author: userId } });
    return includePrivate ? allPlaylists : allPlaylists.filter((playlist) => !playlist.private);
  }

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const tracks = [];

    for (const trackIndex in data.tracks) {
      const track = data.tracks[trackIndex];
      let foundTrack = await this.trackService.findOneByArtistAndName(track.artist, track.name);

      if (foundTrack !== null) {
        tracks.push(foundTrack);
        continue;
      }

      let artist = await this.artistService.findOneByName(track.artist);
      if (!Boolean(artist)) {
        artist = await this.artistService.create({
          name: track.artist,
          addedBy: data.author,
        });
      }

      tracks.push({
        artistId: (artist as Artist).id,
        name: track.name,
        addedBy: data.author,
      });
    }

    return this.playlists.create(
      {
        ...data,
        tracks: tracks as Track[],
      },
      {
        include: [Track],
      },
    );
  }
}
