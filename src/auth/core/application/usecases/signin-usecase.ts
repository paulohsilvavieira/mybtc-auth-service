import { Injectable } from '@nestjs/common';

import {
  BcryptProtocol,
  JwtProtocol,
} from '../../domain/protocols/cryptography';
import { AuthRepoProtocol } from '../../domain/protocols/repository';
import { SignInProtocol } from '../../domain/protocols/usecases';
import { AuthenticationParams } from '../../domain/entities/auth-info';
import { AuthenticationParamsInvalidException } from '../../domain/exceptions';

@Injectable()
export class SignInUsecase implements SignInProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcryptService: BcryptProtocol,
    private readonly jwtService: JwtProtocol,
  ) {}
  async execute(params: AuthenticationParams): Promise<{ token: string }> {
    const { password } = await this.authRepository.getPasswordToCompre(
      params.email,
    );
    const { isValid: isAuthInfoCorrect } = await this.bcryptService.verifyHash(
      params.password,
      password,
    );

    if (!isAuthInfoCorrect) {
      throw new AuthenticationParamsInvalidException();
    }

    const { authorizationId } =
      await this.authRepository.getAuthorizationIdWithEmail(params.email);

    const { token } = await this.jwtService.createToken({
      email: params.email,
      authorizationId,
    });
    return {
      token,
    };
  }
}
