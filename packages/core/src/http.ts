import { ValidationError } from 'yup';

export type PickedValidationError =
  | Pick<ValidationError, 'message' | 'path'>
  | {
      message: ValidationError['message'];
      path: null;
    };

export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors?: PickedValidationError[];

  constructor(status: number, message: string, errors?: PickedValidationError[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
