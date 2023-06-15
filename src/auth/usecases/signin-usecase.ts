import { VerifyHashProtocol } from '@auth/protocols/cryptography/bcrypt';
import { VerifyAuthRepoProtocol } from '@auth/protocols/repository';
import { Injectable } from '@nestjs/common';
import {
  SignInProtocol,
  SignInUsecaseInput,
  SignInUsecaseOutput,
} from 'src/auth/protocols/usecases';

@Injectable()
export class SignInUsecase implements SignInProtocol {
  constructor(
    private readonly authRepository: VerifyAuthRepoProtocol,
    private readonly bcrypt: VerifyHashProtocol,
  ) {}
  async exec(params: SignInUsecaseInput): Promise<SignInUsecaseOutput> {
    const { isValidEmail, password } =
      await this.authRepository.verifyAuthByEmail({
        email: params.email,
      });
    const isValidPassword = await this.bcrypt.verifyHash(
      password,
      params.password,
    );
    if (isValidEmail && isValidPassword) {
      return {
        token: 'validToken',
      };
    }
    return {
      token: undefined,
    };
  }
}
