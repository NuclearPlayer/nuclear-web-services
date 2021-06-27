import App from './app';
import { PlaylistsRoute } from './routes/playlists.route';

const app = new App([new PlaylistsRoute()]);

app.listen();
