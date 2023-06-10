import { SignInParams } from '../../usecase/auth/sign-in';

export abstract class VerifyCrendentials {
  verify: (params: SignInParams) => Promise<{ isValid: boolean }>;
}
