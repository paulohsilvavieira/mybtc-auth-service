export abstract class UpdatePasswordUseCaseProtocol {
  exec: (
    params: UpdatePasswordUseCaseInput,
  ) => Promise<UpdatePasswordUseCaseOutput>;
}

export type UpdatePasswordUseCaseInput = {
  oldPassword: string;
  newPassword: string;
  authorizationId: string;
};

export type UpdatePasswordUseCaseOutput = {
  success: boolean;
};
