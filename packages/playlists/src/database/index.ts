import { sequelize } from '@nws/core/src/database';

import { Artist } from '../models/artists.model';
import { Playlist } from '../models/playlists.model';
import { Track } from '../models/track.model';

sequelize.addModels([Artist, Track, Playlist]);

export { sequelize };
