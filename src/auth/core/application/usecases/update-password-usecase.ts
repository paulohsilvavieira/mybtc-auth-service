import { Injectable } from '@nestjs/common';
import { BcryptProtocol } from '../../domain/protocols/cryptography';
import { AuthRepoProtocol } from '../../domain/protocols/repository';
import {
  UpdatePasswordInput,
  UpdatePasswordProtocol,
} from '../../domain/protocols/usecases/update-password';
import { AuthenticationParams } from '../../domain/entities/auth-info';
import {
  AuthenticationOldPasswordException,
  AuthenticationParamsInvalidException,
} from '../../domain/exceptions';

@Injectable()
export class UpdatePasswordUseCase implements UpdatePasswordProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcryptService: BcryptProtocol,
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
