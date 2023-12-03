import { Injectable } from '@nestjs/common';
import { TokenRecoverPasswordInvalidException } from '../../domain/exceptions/recover-password-exception';
import { Bcrypt } from '../../domain/protocols/cryptography';
import { AuthRepoProtocol } from '../../domain/protocols/repository';
import {
  ResetPasswordProtocol,
  ResetPasswordUseCaseInput,
} from '../../domain/protocols/usecases';

@Injectable()
export class ResetPasswordUseCase implements ResetPasswordProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcryptService: Bcrypt,
  ) {}
  async execute(
    params: ResetPasswordUseCaseInput,
  ): Promise<{ message: string }> {
    const isValidtokenRecoverPassword = await this.validateTokenRecoverPassword(
      {
        email: params.email,
        tokenRecoverPassword: params.tokenRecoverPassword,
      },
    );

    if (!isValidtokenRecoverPassword)
      throw new TokenRecoverPasswordInvalidException();

    const { hashText } = await this.bcryptService.encrypt(params.newPassword);

    await this.authRepository.updatePasswordAuth({
      password: hashText,
      email: params.email,
    });

    await this.authRepository.invalidTokenExpiration(params.email);

    return {
      message: 'Password reset successfully',
    };
  }

  private async validateTokenRecoverPassword(params: {
    email: string;
    tokenRecoverPassword: string;
  }) {
    const { expirationTimeToken } =
      await this.authRepository.getExpirationTimeTokenResetPassword(
        params.email,
      );
    const token = await this.bcryptService.verifyHash(
      params.tokenRecoverPassword,
      expirationTimeToken.toString(),
    );
    if (token.isValid || expirationTimeToken > Date.now()) return true;

    return false;
  }
}
