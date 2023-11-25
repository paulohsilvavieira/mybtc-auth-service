import { AuthenticationParams } from '../../entities/auth-info';

export abstract class RegisterAuthProtocol {
  execute: (params: AuthenticationParams) => Promise<{
    message: string;
  }>;
}
