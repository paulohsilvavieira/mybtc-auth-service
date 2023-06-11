import { IVerifyAuthRepo } from '@auth/protocols/repository';
import { Injectable } from '@nestjs/common';
import { SignIn, SignInParams } from 'src/auth/protocols/usecases';

@Injectable()
export class SignInUsecase implements SignIn {
  constructor(private readonly authRepository: IVerifyAuthRepo) {}
  async exec(params: SignInParams): Promise<{
    msg?: string;
    token?: string;
  }> {
    const { isValid } = await this.authRepository.verifyAuth(params);
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
