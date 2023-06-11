export interface SignInParams {
  email: string;
  password: string;
}
export abstract class SignIn {
  exec: (params: SignInParams) => Promise<{
    token?: string;
    msg?: string;
  }>;
}
