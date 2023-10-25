import { Injectable } from '@nestjs/common';

import { BcryptProtocol, JwtProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  SignInProtocol,
  SignInUsecaseInput,
  SignInUsecaseOutput,
} from '../protocols/usecases';

@Injectable()
export class SignInUsecase implements SignInProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
    private readonly jwt: JwtProtocol,
  ) {}
  async exec(params: SignInUsecaseInput): Promise<SignInUsecaseOutput> {
    const { password, authorizationId } =
      await this.authRepository.verifyAuthByEmail({
        email: params.email,
      });

    if (!password) {
      return {
        token: undefined,
      };
    }

    const { isValid: isValidPassword } = await this.bcrypt.verifyHash(
      params.password,
      password,
    );

    if (isValidPassword) {
      const { token } = await this.jwt.createToken({
        email: params.email,
        authorizationId,
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
