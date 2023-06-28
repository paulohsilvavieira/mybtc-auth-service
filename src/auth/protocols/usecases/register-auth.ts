export interface RegisterAuthUsecaseInput {
  email: string;
  password: string;
}
export interface RegisterAuthUsecaseOutput {
  success: boolean;
}
export abstract class RegisterAuthProtocol {
  exec: (
    params: RegisterAuthUsecaseInput,
  ) => Promise<RegisterAuthUsecaseOutput>;
}
