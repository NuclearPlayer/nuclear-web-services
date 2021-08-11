import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  ValidationFailed,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { HttpException } from '@nws/core/src';

import { Artist } from './artists.model';

export interface TrackAttributes {
  id: string;
  name: string;
  artistId: string;
  addedBy: string;
}

export type TrackCreationAttributes = Optional<TrackAttributes, 'id'>;

@Table({
  timestamps: true,
  tableName: 'tracks',
})
export class Track extends Model<TrackAttributes, TrackCreationAttributes> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
    unique: 'artist_track_name',
  })
  public name: string;

  @AllowNull(false)
  @ForeignKey(() => Artist)
  @Column({
    type: DataType.UUIDV4,
    unique: 'artist_track_name',
  })
  artistId: string;

  @BelongsTo(() => Artist)
  artist: Artist;

  @AllowNull(false)
  @Column({
    type: DataType.UUIDV4,
  })
  public addedBy: string;

  @ValidationFailed
  static afterValidateHook(instance: any, options: any, error: any) {
    throw new HttpException(400, error.message);
  }
}
