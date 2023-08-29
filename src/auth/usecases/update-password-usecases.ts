import { BcryptProtocol } from '../protocols/cryptography';
import { AuthRepoProtocol } from '../protocols/repository';
import {
  UpdatePasswordUseCaseInput,
  UpdatePasswordUseCaseOutput,
  UpdatePasswordUseCaseProtocol,
} from '../protocols/usecases/update-password';

export class UpdatePasswordUseCase implements UpdatePasswordUseCaseProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly encrypter: BcryptProtocol,
  ) {}

  async exec(
    params: UpdatePasswordUseCaseInput,
  ): Promise<UpdatePasswordUseCaseOutput> {
    const result = await this.authRepository.updatePassword({
      authorizationId: params.authorizationId,
      oldPassword: (await this.encrypter.encrypt(params.oldPassword)).hashText,
      newPassword: (await this.encrypter.encrypt(params.newPassword)).hashText,
    });
    return result;
  }
}
