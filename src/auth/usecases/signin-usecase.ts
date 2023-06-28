import { BcryptProtocol, JwtProtocol } from '@auth/protocols/cryptography';
import { AuthRepoProtocol } from '@auth/protocols/repository';
import { Injectable, Logger } from '@nestjs/common';
import {
  SignInProtocol,
  SignInUsecaseInput,
  SignInUsecaseOutput,
} from 'src/auth/protocols/usecases';

@Injectable()
export class SignInUsecase implements SignInProtocol {
  private readonly logger = new Logger(SignInUsecase.name);

  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
    private readonly jwt: JwtProtocol,
  ) {}
  async exec(params: SignInUsecaseInput): Promise<SignInUsecaseOutput> {
    this.logger.log({ message: 'Start processing auth' });

    const { isValidEmail, password } =
      await this.authRepository.verifyAuthByEmail({
        email: params.email,
      });
    if (!password) {
      return {
        token: undefined,
      };
    }

    const isValidPassword = await this.bcrypt.verifyHash(
      password,
      params.password,
    );

    if (isValidEmail && isValidPassword) {
      const { token } = await this.jwt.createToken({
        email: params.email,
      });
      this.logger.log({ message: 'Valid Email and Password' });
      this.logger.log({ message: 'Authentication Proccess Successful!' });

      return {
        token,
      };
    }

    this.logger.log({ message: 'Invalid Email or Password' });
    this.logger.log({ message: 'Authentication Proccess Error!' });

    return {
      token: undefined,
    };
  }
}
