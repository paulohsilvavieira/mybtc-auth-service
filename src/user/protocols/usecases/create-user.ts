export interface CreateUserUsecaseInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
export interface CreateUserUsecaseOutput {
  success: boolean;
  error?: string;
}

export abstract class CreateUserProtocol {
  exec: (input: CreateUserUsecaseInput) => Promise<CreateUserUsecaseOutput>;
}
