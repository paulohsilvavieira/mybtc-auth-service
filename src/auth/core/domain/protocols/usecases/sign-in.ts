import { AuthenticationParams } from '../../entities/auth-info';

export abstract class SignInProtocol {
  execute: (params: AuthenticationParams) => Promise<{ token: string }>;
}
