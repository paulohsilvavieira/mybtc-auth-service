import { BcryptProtocol } from '@auth/protocols/cryptography';
import { AuthRepoProtocol } from '@auth/protocols/repository';
import { Injectable } from '@nestjs/common';
import {
  RegisterAuthProtocol,
  RegisterAuthUsecaseInput,
  RegisterAuthUsecaseOutput,
} from 'src/auth/protocols/usecases';

@Injectable()
export class RegisterAuthUsecase implements RegisterAuthProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcrypt: BcryptProtocol,
  ) {}
  async exec(
    params: RegisterAuthUsecaseInput,
  ): Promise<RegisterAuthUsecaseOutput> {
    const { hashText } = await this.bcrypt.encrypt(params.password);

    const { success } = await this.authRepository.createAuth({
      email: params.email,
      password: hashText,
    });

    return {
      success,
    };
  }
}
