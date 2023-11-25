import { AuthenticationError } from '@/exeptions';

export class TokenRecoverPasswordInvalidException extends AuthenticationError {
  constructor() {
    super('[MYBTC][AUTH][0004]', 'Invalid token recover password!');
  }
}
