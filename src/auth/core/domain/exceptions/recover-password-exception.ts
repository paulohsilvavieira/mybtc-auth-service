import { AuthenticationError } from '@/exeptions';

export class TokenRecoverPasswordInvalidException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0003]', 'Invalid token recover password!');
  }
}
