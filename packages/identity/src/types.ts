import { Request } from 'express';
import { User } from './models/users.model';

export type JWTData = {
  id: string;
};

export enum UserGroup {
  ADMIN = 'admin',
  USER = 'user',
}

export type AuthenticatedRequest = Request & {
  user?: User;
};
