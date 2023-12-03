import { AuthenticationError } from '@/exeptions';

export class AuthenticationParamsInvalidException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0001]', 'Invalid email or password');
  }
}

export class AuthenticationOldPasswordException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0002]', 'Invalid old password!');
  }
}
