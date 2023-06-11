import { SignInParams } from '../usecases';

export abstract class IVerifyAuthRepo {
  verifyAuth: (params: SignInParams) => Promise<{ isValid: boolean }>;
}
