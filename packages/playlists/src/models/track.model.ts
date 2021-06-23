import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { Artist } from './artist.model';
import { Playlist } from './playlists.model';

export interface TrackAttributes {
  id: string;
  name: string;
  artistId: string;
  playlistId: string;
}

export type TrackCreationAttributes = Optional<TrackAttributes, 'id'>;

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
    type: DataType.STRING(),
  })
  public artistId: string;

  @BelongsTo(() => Artist, 'artistId')
  artist: Artist;

  @AllowNull(false)
  @ForeignKey(() => Playlist)
  @Column({
    type: DataType.STRING(),
  })
  public playlistId: string;

  @BelongsTo(() => Playlist, 'playlistId')
  playlist: Playlist;
}
