import { AllowNull, Column, DataType, HasMany, Model, Table, Unique, ValidationFailed } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { HttpException } from '@nws/core';

import { Track } from './tracks.model';

export interface ArtistAttributes {
  id: string;
  name: string;
  tracks: Track[];
}

export type ArtistCreationAttributes = Optional<ArtistAttributes, 'id' | 'tracks'>;

@Table({
  timestamps: true,
  tableName: 'artists',
})
export class Artist extends Model<ArtistAttributes, ArtistCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(),
  })
  public name: string;

  @HasMany(() => Track)
  tracks: Track[];

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
