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
  newPassword: string;
  authorizationId: string;
};

export type UpdatePasswordRepoOutput = {
  success: boolean;
};
