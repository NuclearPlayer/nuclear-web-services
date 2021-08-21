import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Playlist } from './playlists.model';
import { Track } from './tracks.model';

@Table({
  tableName: 'tracks_playlists',
})
export class TrackPlaylist extends Model<TrackPlaylist> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @ForeignKey(() => Track)
  @Column({ field: 'trackId', type: DataType.UUIDV4 })
  trackId: string;

  @ForeignKey(() => Playlist)
  @Column({ field: 'playlistId', type: DataType.UUIDV4 })
  playlistId: string;
}
