export abstract class VerifyAuthRepoProtocol {
  verifyAuthByEmail: (
    params: VerifyAuthRepoInput,
  ) => Promise<VerifyAuthRepoOutput>;
}

export type VerifyAuthRepoInput = {
  email: string;
};
export type VerifyAuthRepoOutput = {
  isValidEmail: boolean;
  password: string | undefined;
};
