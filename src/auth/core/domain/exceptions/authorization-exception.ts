import { AuthenticationError } from '@/exeptions';

export class BearerTokenInvalidException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0001]', 'Invalid bearer token!');
  }
}

export class AuthenticationParamsInvalidException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0002]', 'Unauthorized');
  }
}

export class AuthenticationOldPasswordException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0003]', 'Invalid old password!');
  }
}
