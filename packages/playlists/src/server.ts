import App from './app';
import { PlaylistsRoute } from './routes/playlists.routes';

const app = new App([new PlaylistsRoute()]);

app.listen();
