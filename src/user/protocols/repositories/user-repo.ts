export abstract class UserRepoProtocol {
  createUser: (params: CreateUserRepoInput) => Promise<CreateUserRepoOutput>;
}

export type CreateUserRepoInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type CreateUserRepoOutput = {
  success: boolean;
  error?: Error;
};
