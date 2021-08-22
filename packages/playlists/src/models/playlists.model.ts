import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  ValidationFailed,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { HttpException } from '@nws/core';

import { CreateTrackDto } from '../dtos/tracks.dto';
import { Track } from './tracks.model';

export interface PlaylistAttributes {
  id: string;
  author: string;
  name: string;
  private: boolean;
}

export type PlaylistCreationAttributes = Optional<PlaylistAttributes, 'id' | 'private'> & {
  tracks?: Track[] | Omit<CreateTrackDto, 'playlistId'>[];
};

@Table({
  timestamps: true,
  tableName: 'playlists',
})
export class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  public author: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public name: string;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  public private: boolean;

  @HasMany(() => Track)
  tracks: Track[];

  @ValidationFailed
  static afterValidateHook(instance: any, options: any, error: any) {
    throw new HttpException(400, error.message);
  }
}
