import { sequelize } from '@nws/core/src/database';

import { Group } from '../models/groups.model';
import { User } from '../models/users.model';

sequelize.addModels([User, Group]);

export { sequelize };
