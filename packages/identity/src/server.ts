import App from './app';
import { AuthRoute } from './routes/auth.route';
import { UsersRoute } from './routes/users.route';

const app = new App([new AuthRoute(), new UsersRoute()]);

app.connectToDatabase();
app.listen();
