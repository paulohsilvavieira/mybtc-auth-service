import { Logger } from '@nestjs/common';
import { UserRepoProtocol } from '../protocols/repositories';
import {
  CreateUserProtocol,
  CreateUserUsecaseInput,
  CreateUserUsecaseOutput,
} from '../protocols/usecases';

export class CreateUserUseCase implements CreateUserProtocol {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(private readonly userRepository: UserRepoProtocol) {}
  async exec(input: CreateUserUsecaseInput): Promise<CreateUserUsecaseOutput> {
    const result = await this.userRepository.createUser(input);
    return result;
  }
}
