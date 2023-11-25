export abstract class ResetPasswordProtocol {
  execute: (params: ResetPasswordUseCaseInput) => Promise<{
    message: string;
  }>;
}

export type ResetPasswordUseCaseInput = {
  email: string;
  newPassword: string;
  tokenRecoverPassword: string;
};
