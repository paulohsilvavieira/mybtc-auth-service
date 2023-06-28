import { BcryptProtocol } from '@auth/protocols/cryptography';
import { AuthRepoProtocol } from '@auth/protocols/repository';
import { Injectable, Logger } from '@nestjs/common';
import {
  RegisterAuthProtocol,
  RegisterAuthUsecaseInput,
  RegisterAuthUsecaseOutput,
} from 'src/auth/protocols/usecases';

@Injectable()
export class RegisterAuthUsecase implements RegisterAuthProtocol {
  private readonly logger = new Logger(RegisterAuthUsecase.name);

  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
  ) {}
  async exec(
    params: RegisterAuthUsecaseInput,
  ): Promise<RegisterAuthUsecaseOutput> {
    try {
      this.logger.log({
        message: 'Authentication data registration process Started',
      });

      const { hashText } = await this.bcrypt.encrypt(params.password);

      this.logger.log({
        message: 'Start process to save Authentication info on Database',
      });

      const { success } = await this.authRepository.createAuth({
        email: params.email,
        password: hashText,
      });

      if (!success) {
        this.logger.log({
          message: 'Error saving authentication information',
        });
      }
      this.logger.log({
        message: 'Authentication data successfully saved',
      });

      this.logger.log({
        message: 'Completed authentication data registration process',
      });
      return {
        success,
      };
    } catch (error) {
      this.logger.error(error.message);
      return {
        success: false,
      };
    }
  }
}
