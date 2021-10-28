import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../http';
import logger from '../logger';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Unspecified error';

    logger.error(`StatusCode : ${status}, Message : ${message}`);
    if (status === 500) logger.error(error?.stack);
    res.status(status).json({ message, errors: error.errors });
  } catch (error) {
    next(error);
  }
};
