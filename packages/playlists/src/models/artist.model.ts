import { AllowNull, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { Track } from './track.model';

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
  @Column({
    type: DataType.STRING(),
  })
  public name: string;

  @HasMany(() => Track, 'artistId')
  tracks: Track[];
}
