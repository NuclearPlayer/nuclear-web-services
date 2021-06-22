import { Router } from 'express';

export type Environment = 'development' | 'test' | 'production';

export interface Route {
  path?: string;
  router: Router;

  makeRoute(route: string): void;
  initializeRoutes(): void;
}

export interface Service {}

export interface CrudService<T, CreateDto> extends Service {
  findAll(): Promise<T[]>;
  findOneById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update?(id: string, data: CreateDto): Promise<T | null>;
  delete?(id: string): Promise<T>;
}
