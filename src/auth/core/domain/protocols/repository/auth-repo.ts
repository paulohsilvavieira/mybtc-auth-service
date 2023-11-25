import { AuthenticationParams } from '../../entities/auth-info';
import { ResetPasswordUseCaseInput } from '../usecases';

export abstract class AuthRepoProtocol {
  getPasswordToCompre: (email: string) => Promise<{ password: string }>;

  getAuthorizationIdWithEmail: (
    email: string,
  ) => Promise<{ authorizationId: string }>;

  createAuthenticationInfo: (params: AuthenticationParams) => Promise<void>;

  updatePasswordAuth: (params: AuthenticationParams) => Promise<void>;

  saveTokenRecoverPassword: (
    params: SaveTokenRecoverPasswordInput,
  ) => Promise<void>;

  getExpirationTimeTokenResetPassword: (email: string) => Promise<{
    expirationTimeToken: number;
  }>;

  invalidTokenExpiration: (email: string) => Promise<void>;
}

export type VerifyAuthRepoInput = {
  email: string;
};

export type SaveTokenRecoverPasswordInput = {
  tokenRecoverPassword: string;
  email: string;
  expirationTimeToken: number;
};
export type VerifyAuthRepoOutput = {
  isValidEmail: boolean;
  password: string;
  authorizationId: string;
};
