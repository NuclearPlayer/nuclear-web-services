import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import * as Yup from 'yup';

import { Logger } from '..';
import { HttpException } from '../http';

export const validate = (schema: Yup.AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (error) {
    Logger.error(error);
    next(
      new HttpException(
        400,
        'Validation error',
        (error as Yup.ValidationError).inner.map((err) => pick(err, ['message', 'path'])),
      ),
    );
  }
};
