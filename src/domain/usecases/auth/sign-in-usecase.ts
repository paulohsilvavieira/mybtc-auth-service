import { VerifyCrendentials } from '@protocolsDomain/repository/auth';
import { SignIn, SignInParams } from '@protocolsDomain/usecase/auth';

export class SignInUsecase implements SignIn {
  constructor(private readonly authRepository: VerifyCrendentials) {}
  async exec(params: SignInParams): Promise<{
    msg?: string;
    token?: string;
  }> {
    const { isValid } = await this.authRepository.verify(params);
    if (isValid) {
      return {
        token: 'validToken',
      };
    }
    return {
      msg: 'Invalid Credentials!',
    };
  }
}
