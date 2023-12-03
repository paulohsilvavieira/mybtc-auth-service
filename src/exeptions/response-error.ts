import { DefaultError } from './default.error';

export class ResponseError {
  readonly errors: DefaultError[];
  constructor(...error: DefaultError[]) {
    this.errors = error;
  }
}
