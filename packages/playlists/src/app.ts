import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import { Logger } from '@nws/core';
import { errorMiddleware } from '@nws/core/src/middleware';
import { Route } from '@nws/core/src/types';

import { sequelize } from './database';
import { initAuthMiddleware } from './middleware/auth.middleware';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  public constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.app.use(errorMiddleware);
  }

  private initializeMiddleware() {
    if (this.env === 'production') {
      this.app.use(morgan('combined'));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    initAuthMiddleware();
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => this.app.use('/', route.router));
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  public getDb() {
    return sequelize;
  }

  public connectToDatabase() {
    sequelize.sync({ force: false });
  }
}

export default App;
