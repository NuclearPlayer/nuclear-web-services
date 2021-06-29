import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../http';

export const validatorMiddleware =
  (schema: ClassType<object>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await transformAndValidate(schema, req.body, {
        validator: {
          validationError: {
            target: false,
          },
        },
      });
      return next();
    } catch (error) {
      next(new HttpException(400, error));
    }
  };
