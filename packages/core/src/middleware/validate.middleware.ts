import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { HttpException } from '../http';

type ValidationError = {
  errors: string;
};

export const validate = (schema: Yup.AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (error) {
    next(new HttpException(400, (error as ValidationError).errors));
  }
};
