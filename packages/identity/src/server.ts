import { UsersRoute } from 'routes/users.route';
import App from './app';

const app = new App([new UsersRoute()]);

app.connectToDatabase();
app.listen();
