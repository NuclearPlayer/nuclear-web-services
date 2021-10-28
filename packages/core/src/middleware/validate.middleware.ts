import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { HttpException } from '../http';

export const validate = (schema: Yup.AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (error) {
    next(
      new HttpException(
        400,
        'Validation failed',
        Object.fromEntries(
          (error as Yup.ValidationError).inner.map((innerError) => [innerError.path, innerError.message]),
        ),
      ),
    );
  }
};
