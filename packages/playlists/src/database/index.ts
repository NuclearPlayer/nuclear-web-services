import { sequelize } from '@nws/core/src/database';

import { Artist } from '../models/artists.model';
import { Playlist } from '../models/playlists.model';
import { Track } from '../models/tracks.model';
import { TrackPlaylist } from '../models/tracks_playlists.model';

sequelize.addModels([Artist, Track, Playlist, TrackPlaylist]);

export { sequelize };
