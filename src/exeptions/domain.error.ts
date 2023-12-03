import { DefaultError } from './default.error';

export class DomainError extends DefaultError {
  constructor(code: string, message: string) {
    super(code, message);
  }
}
