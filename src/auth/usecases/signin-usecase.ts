import { BcryptProtocol, JwtProtocol } from '@auth/protocols/cryptography';
import { AuthRepoProtocol } from '@auth/protocols/repository';
import { Injectable } from '@nestjs/common';
import {
  SignInProtocol,
  SignInUsecaseInput,
  SignInUsecaseOutput,
} from 'src/auth/protocols/usecases';

@Injectable()
export class SignInUsecase implements SignInProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
    private readonly jwt: JwtProtocol,
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
      const { token } = await this.jwt.createToken({
        email: params.email,
      });
      return {
        token,
      };
    }
    return {
      token: undefined,
    };
  }
}
