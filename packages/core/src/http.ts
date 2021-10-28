export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
