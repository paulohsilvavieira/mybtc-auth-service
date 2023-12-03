import { DefaultError } from './default.error';

export class AuthenticationError extends DefaultError {
  constructor(code: string, message: string) {
    super(code, message);
  }
}
