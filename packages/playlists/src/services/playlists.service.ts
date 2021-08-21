import { CrudService } from '@nws/core/src/types';

import { HttpException } from '../../../core/src';
import { sequelize } from '../database';
import { CreatePlaylistDto, UpdatePlaylistDto } from '../dtos/playlists.dto';
import { Artist } from '../models/artists.model';
import { Playlist } from '../models/playlists.model';
import { Track } from '../models/tracks.model';
import { TrackPlaylist } from '../models/tracks_playlists.model';
import { ArtistService } from './artists.service';
import { TrackService } from './tracks.service';

export class PlaylistService implements CrudService<Playlist, CreatePlaylistDto> {
  public playlists = Playlist;
  public trackPlaylist = TrackPlaylist;
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

  async processTracks(tracks: { name: string; artist: string }[], author: string): Promise<Track[]> {
    const result = [];

    for (const trackIndex in tracks) {
      const track = tracks[trackIndex];
      let foundTrack = await this.trackService.findOneByArtistAndName(track.artist, track.name);

      if (foundTrack !== null) {
        result.push(foundTrack);
        continue;
      }

      let artist = await this.artistService.findOneByName(track.artist);
      if (!Boolean(artist)) {
        artist = await this.artistService.create({
          name: track.artist,
          addedBy: author,
        });
      }

      result.push(
        await this.trackService.create({
          artistId: (artist as Artist).id,
          name: track.name,
          addedBy: author,
        }),
      );
    }

    return result as Track[];
  }

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const tracks = await this.processTracks(data.tracks, data.author);

    return this.playlists.create(
      {
        ...data,
        tracks,
      },
      {
        include: [Track],
      },
    );
  }

  async update(id: string, data: UpdatePlaylistDto): Promise<Playlist> {
    const instance = await this.playlists.findByPk(id);
    if (!instance) {
      throw new HttpException(400, `Playlist with id ${id} does not exist`);
    }

    const tracks = data.tracks ? await this.processTracks(data.tracks, data.author) : undefined;

    instance.name = data.name ?? instance.name;
    instance.private = data.private ?? instance.private;

    if (tracks) {
      this.trackPlaylist.destroy({ where: { playlistId: id } });
      await this.trackPlaylist.bulkCreate(
        tracks.map((track) => ({
          trackId: track.id,
          playlistId: id,
        })) as TrackPlaylist[],
      );
    }

    await instance.save();
    await instance.reload({ include: [{ model: Track, through: { attributes: [] } }] });

    return instance;
  }
}
