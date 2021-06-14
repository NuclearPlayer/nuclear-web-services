import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import hpp from 'hpp';
import morgan from 'morgan';
import { Logger } from '@nws/core';

import { Route } from './types';
class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  public constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddleware();
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
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }
}

export default App;
