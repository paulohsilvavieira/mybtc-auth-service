export abstract class UpdatePasswordProtocol {
  execute: (params: UpdatePasswordInput) => Promise<{ message: string }>;
}

export type UpdatePasswordInput = {
  oldPassword: string;
  newPassword: string;
  email: string;
};
