import { CrudService } from '@nws/core/src/types';

import { HttpException } from '../../../core/src';
import { sequelize } from '../database';
import { CreatePlaylistDto, UpdatePlaylistDto } from '../dtos/playlists.dto';
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

  async findArtistIdsForTracks(tracks: CreatePlaylistDto['tracks'], author: string) {
    const result = [];
    for (const trackIndex in tracks) {
      const track = tracks[trackIndex];

      let artist = await this.artistService.findOneByName(track.artist);
      if (!Boolean(artist)) {
        artist = await this.artistService.create({
          name: track.artist,
          addedBy: author,
        });
      }

      result.push({
        artistId: (artist as Artist).id,
        name: track.name,
        addedBy: author,
      });
    }

    return result;
  }

  async createTracksForUpdate(tracks: CreatePlaylistDto['tracks'], author: string, playlistId: string) {
    const tracksData = (await this.findArtistIdsForTracks(tracks, author)).map((track) => ({
      ...track,
      playlistId,
    }));
    return this.trackService.bulkCreate(tracksData);
  }

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const tracks = await this.findArtistIdsForTracks(data.tracks, data.author);

    return await this.playlists.create(
      {
        ...data,
        tracks,
      },
      {
        include: [
          {
            model: Track.scope('playlist'),
          },
        ],
      },
    );
  }

  async update(id: string, data: UpdatePlaylistDto): Promise<Playlist> {
    const instance = await this.playlists.findByPk(id);
    if (!instance) {
      throw new HttpException(400, `Playlist with id ${id} does not exist`);
    }

    if (data.tracks) {
      await this.trackService.deleteWhere({ playlistId: id });
      const tracks = await this.createTracksForUpdate(data.tracks, data.author, id);
      instance.tracks = tracks;
    }

    instance.name = data.name ?? instance.name;
    instance.private = data.private ?? instance.private;

    await instance.save();
    await instance.reload({
      include: {
        model: Track.scope('playlist'),
      },
    });

    return instance;
  }
}
