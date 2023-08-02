import { Logger } from '@nestjs/common';
import { UserRepoProtocol } from '../protocols/repositories';
import {
  SaveDocumentsUserProtocol,
  SaveDocumentsUserUsecaseInput,
  SaveDocumentsUserUsecaseOutput,
} from '../protocols/usecases';

export class SaveDocumentsUserUseCase implements SaveDocumentsUserProtocol {
  private readonly logger = new Logger(SaveDocumentsUserUseCase.name);

  constructor(private readonly userRepository: UserRepoProtocol) {}
  async exec(
    input: SaveDocumentsUserUsecaseInput,
  ): Promise<SaveDocumentsUserUsecaseOutput> {
    const result = await this.userRepository.saveDocuments(input);
    return result;
  }
}
