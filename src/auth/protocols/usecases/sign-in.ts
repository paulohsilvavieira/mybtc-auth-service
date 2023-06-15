export interface SignInUsecaseInput {
  email: string;
  password: string;
}
export interface SignInUsecaseOutput {
  token: string;
}
export abstract class SignInProtocol {
  exec: (params: SignInUsecaseInput) => Promise<SignInUsecaseOutput>;
}
