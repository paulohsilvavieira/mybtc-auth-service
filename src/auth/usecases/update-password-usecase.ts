import { Injectable } from '@nestjs/common';
import { BcryptProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  UpdatePasswordUseCaseInput,
  UpdatePasswordUseCaseOutput,
  UpdatePasswordUseCaseProtocol,
} from '../protocols/usecases/update-password';

@Injectable()
export class UpdatePasswordUseCase implements UpdatePasswordUseCaseProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
  ) {}

  async exec(
    params: UpdatePasswordUseCaseInput,
  ): Promise<UpdatePasswordUseCaseOutput> {
    const { authorizationId, newPassword, oldPassword } = params;

    const authInfo = await this.authRepository.findById(params.authorizationId);

    if (!authInfo) {
      return {
        success: false,
      };
    }

    const isValidOldPassword = await this.validOldPassword(
      oldPassword,
      authInfo.password,
    );

    if (isValidOldPassword) {
      const { hashText } = await this.bcrypt.encrypt(newPassword);
      const result = await this.authRepository.updatePassword({
        authorizationId: authorizationId,
        newPassword: hashText,
      });
      return result;
    }
    return {
      success: false,
    };
  }

  private async validOldPassword(plainText: string, hashedText: string) {
    const { isValid } = await this.bcrypt.verifyHash(plainText, hashedText);
    return isValid;
  }
}
