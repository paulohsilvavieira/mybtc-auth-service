import { Injectable } from '@nestjs/common';
import { Bcrypt } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import {
  UpdatePasswordInput,
  UpdatePasswordProtocol,
} from '@/auth/core/domain/protocols/usecases/update-password';
import { AuthenticationOldPasswordException } from '@/auth/core/domain/exceptions';

@Injectable()
export class UpdatePasswordUseCase implements UpdatePasswordProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcryptService: Bcrypt,
  ) {}

  async execute(params: UpdatePasswordInput): Promise<{ message: string }> {
    const { newPassword, oldPassword, email } = params;

    const isOldPasswordValid = await this.validateOldPassword({
      email,
      oldPassword,
    });
    if (!isOldPasswordValid) throw new AuthenticationOldPasswordException();

    const { hashText } = await this.bcryptService.encrypt(newPassword);

    await this.authRepository.updatePasswordAuth({
      email: params.email,
      password: hashText,
    });

    return {
      message: 'Password Updated',
    };
  }

  private async validateOldPassword(params: {
    email: string;
    oldPassword: string;
  }) {
    const { password } = await this.authRepository.getPasswordToCompre(
      params.email,
    );
    const { isValid } = await this.bcryptService.verifyHash(
      params.oldPassword,
      password,
    );

    return isValid;
  }
}
