import App from './app';
import { ArtistsRoute } from './routes/artists.route';
import { PlaylistsRoute } from './routes/playlists.route';

const app = new App([new PlaylistsRoute(), new ArtistsRoute()]);

app.listen();
