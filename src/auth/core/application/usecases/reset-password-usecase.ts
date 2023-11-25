import { TokenRecoverPasswordInvalidException } from '../../domain/exceptions/recover-password-exception';
import { JwtProtocol } from '../../domain/protocols/cryptography';
import { AuthRepoProtocol } from '../../domain/protocols/repository';
import {
  ResetPasswordProtocol,
  ResetPasswordUseCaseInput,
} from '../../domain/protocols/usecases';

export class ResetPasswordUseCase implements ResetPasswordProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly jwtService: JwtProtocol,
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

    await this.authRepository.updatePasswordAuth({
      password: params.newPassword,
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
    const token = await this.jwtService.verifyToken(
      params.tokenRecoverPassword,
    );
    if (token.isValid || expirationTimeToken > Date.now()) return true;

    return false;
  }
}
