import { Injectable, Logger } from '@nestjs/common';
import {
  SignInProtocol,
  SignInUsecaseInput,
  SignInUsecaseOutput,
} from 'src/auth/protocols/usecases';
import { BcryptProtocol, JwtProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';

export class SignInUsecase implements SignInProtocol {
  private readonly logger = new Logger(SignInUsecase.name);

  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
    private readonly jwt: JwtProtocol,
  ) {}
  async exec(params: SignInUsecaseInput): Promise<SignInUsecaseOutput> {
    this.logger.log({ message: 'Start processing auth' });

    const { password, authorizationId } =
      await this.authRepository.verifyAuthByEmail({
        email: params.email,
      });
    console.log(password, authorizationId);
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
      this.logger.log({ message: 'Valid Email and Password' });
      this.logger.log({ message: 'Authentication Proccess Successful!' });
      this.logger.log({ message: 'Finish processing auth' });

      return {
        token,
      };
    }

    this.logger.log({ message: 'Invalid Email or Password' });
    this.logger.log({ message: 'Authentication Proccess Error!' });
    this.logger.log({ message: 'Finish processing auth' });

    return {
      token: undefined,
    };
  }
}
