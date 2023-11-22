import {
  ResetPasswordUseCaseInput,
  ResetPasswordUseCaseOutput,
} from '../usecases/reset-password';

export abstract class AuthRepoProtocol {
  verifyAuthByEmail: (
    params: VerifyAuthRepoInput,
  ) => Promise<VerifyAuthRepoOutput>;

  findById: (
    authorizationId: string,
  ) => Promise<{ password: string | undefined }>;

  createAuth: (params: CreateAuthRepoInput) => Promise<CreateAuthRepoOutput>;
  updatePassword: (
    params: UpdatePasswordRepoInput,
  ) => Promise<UpdatePasswordRepoOutput>;

  saveTokenRecoverPassword: (
    params: SaveTokenRecoverPassword,
  ) => Promise<{ success: boolean }>;

  resetPassswordWithToken: (
    parans: ResetPasswordUseCaseInput,
  ) => Promise<ResetPasswordUseCaseOutput>;
}

export type VerifyAuthRepoInput = {
  email: string;
};

export type SaveTokenRecoverPassword = {
  token: string;
  email: string;
  expiration_time_token: number;
};
export type VerifyAuthRepoOutput = {
  isValidEmail: boolean;
  password: string | undefined;
  authorizationId: string | undefined;
};

export type CreateAuthRepoInput = {
  email: string;
  password: string;
};
export type CreateAuthRepoOutput = {
  success: boolean;
};

export type UpdatePasswordRepoInput = {
  newPassword: string;
  authorizationId: string;
};

export type UpdatePasswordRepoOutput = {
  success: boolean;
};
