export abstract class ResetPassordProtocol {
  exec: (
    params: ResetPasswordUseCaseInput,
  ) => Promise<ResetPasswordUseCaseOutput>;
}

export type ResetPasswordUseCaseInput = {
  email: string;
  newPassword: string;
  tokenResetPassword: string;
};
export type ResetPasswordUseCaseOutput = {
  error?: string;
  success: boolean;
};
