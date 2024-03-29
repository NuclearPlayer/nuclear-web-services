import 'pg';
import { Sequelize } from 'sequelize-typescript';

import { Logger } from '..';
import { Environment } from '../types';
import { config } from './config';

const env: Environment = (process.env.NODE_ENV || 'development') as Environment;
let sequelize: Sequelize;

if (env === 'production') {
  sequelize = new Sequelize(config[env].database as string, {
    dialect: config[env].dialect as any,
    protocol: config[env].protocol,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  });
} else {
  sequelize = new Sequelize({
    dialect: config[env].dialect as any,
    storage: config[env].database as string,
    logging: env !== 'test',
  });
}

sequelize
  .authenticate()
  .then(() => {
    Logger.info('🟢 The database is connected.');
  })
  .catch((error: Error) => {
    Logger.info(`🔴 Unable to connect to the database: ${error}.`);
  });

export { sequelize };
