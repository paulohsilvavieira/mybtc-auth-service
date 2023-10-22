import { JwtProtocol } from '../protocols/cryptography';
import {
  ResetPassordProtocol,
  ResetPasswordUseCaseInput,
  ResetPasswordUseCaseOutput,
} from '../protocols/usecases';

export class ResetPasswordUseCase implements ResetPassordProtocol {
  constructor(
    private readonly authRepository: any,
    private readonly jwtService: JwtProtocol,
  ) {}
  async exec(
    params: ResetPasswordUseCaseInput,
  ): Promise<ResetPasswordUseCaseOutput> {
    const token = await this.jwtService.verifyToken(params.tokenResetPassword);

    if (!token.isValid) {
      return {
        error: 'Token reset password invalid',
        success: false,
      };
    }
    const result = await this.authRepository.resetPassword(params);
    if (!result.success) {
      return {
        success: false,
        error: 'error on reset password, verify params!',
      };
    }

    return {
      success: true,
    };
  }
}
