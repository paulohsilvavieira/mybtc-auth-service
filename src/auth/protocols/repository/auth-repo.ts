export abstract class AuthRepoProtocol {
  verifyAuthByEmail: (
    params: VerifyAuthRepoInput,
  ) => Promise<VerifyAuthRepoOutput>;

  createAuth: (params: CreateAuthRepoInput) => Promise<CreateAuthRepoOutput>;
  updatePassword: (
    params: UpdatePasswordRepoInput,
  ) => Promise<UpdatePasswordRepoOutput>;
}

export type VerifyAuthRepoInput = {
  email: string;
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
  oldPassword: string;
  newPassword: string;
  authorizationId: string;
};

export type UpdatePasswordRepoOutput = {
  success: boolean;
};
