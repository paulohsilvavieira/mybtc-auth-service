export interface CreateUserUsecaseInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
export interface CreateUserUsecaseOutput {
  success: boolean;
  error?: Error;
}

export abstract class CreateUserProtocol {
  exec: (input: CreateUserUsecaseInput) => Promise<CreateUserUsecaseOutput>;
}
