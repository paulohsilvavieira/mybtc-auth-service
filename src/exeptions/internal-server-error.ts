import { DefaultError } from './default.error';

export class InternalServerError extends DefaultError {
  constructor() {
    const message = 'An internal server error occurred, please try again.';
    const code = 'AUTH_ERROR_X';
    super(code, message);
  }
}
