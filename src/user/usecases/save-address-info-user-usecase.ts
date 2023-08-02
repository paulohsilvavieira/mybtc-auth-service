import { Logger } from '@nestjs/common';
import { UserRepoProtocol } from '../protocols/repositories';
import {
  SaveAddressUserProtocol,
  SaveAddressUserUsecaseInput,
  SaveAddressUserUsecaseOutput,
} from '../protocols/usecases';

export class SaveAddressUserUseCase implements SaveAddressUserProtocol {
  private readonly logger = new Logger(SaveAddressUserUseCase.name);

  constructor(private readonly userRepository: UserRepoProtocol) {}
  async exec(
    input: SaveAddressUserUsecaseInput,
  ): Promise<SaveAddressUserUsecaseOutput> {
    const result = await this.userRepository.saveAddressUser(input);
    return result;
  }
}
