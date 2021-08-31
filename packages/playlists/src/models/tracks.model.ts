import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Scopes,
  Table,
  ValidationFailed,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { HttpException } from '@nws/core/src';

import { Artist } from './artists.model';
import { Playlist } from './playlists.model';

export interface TrackAttributes {
  id: string;
  name: string;
  artistId: string;
  playlistId: string;
  addedBy: string;
}

export type TrackCreationAttributes = Optional<TrackAttributes, 'id'>;

@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Scopes(() => ({
  playlist: {
    attributes: {
      exclude: ['playlistId', 'createdAt', 'updatedAt'],
    },
  },
}))
@Table({
  timestamps: true,
  tableName: 'tracks',
})
export class Track extends Model<TrackAttributes, TrackCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public name: string;

  @AllowNull(false)
  @ForeignKey(() => Artist)
  @Column({
    type: DataType.UUID,
  })
  artistId: string;

  @BelongsTo(() => Artist)
  artist: Artist;

  @AllowNull(false)
  @ForeignKey(() => Playlist)
  @Column({
    type: DataType.UUID,
  })
  playlistId: string;

  @BelongsTo(() => Playlist)
  playlist: Playlist;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  public addedBy: string;

  @ValidationFailed
  static afterValidateHook(instance: any, options: any, error: any) {
    throw new HttpException(400, error.message);
  }
}
