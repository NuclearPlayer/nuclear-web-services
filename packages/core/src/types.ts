import { Router } from 'express';

export type Environment = 'development' | 'test' | 'production';

export interface Route {
  path?: string;
  router: Router;
}
