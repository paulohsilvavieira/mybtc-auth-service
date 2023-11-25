import { Injectable } from '@nestjs/common';
import { RegisterAuthProtocol } from '@/auth/core/domain/protocols/usecases';
import { BcryptProtocol } from '@/auth/core/domain/protocols/cryptography';
import { AuthRepoProtocol } from '@/auth/core/domain/protocols/repository';
import { AuthenticationParams } from '../../domain/entities/auth-info';

@Injectable()
export class RegisterAuthUsecase implements RegisterAuthProtocol {
  constructor(
    private readonly authRepository: AuthRepoProtocol,
    private readonly bcryptService: BcryptProtocol,
  ) {}
  async execute(params: AuthenticationParams): Promise<{ message: string }> {
    const { hashText: hashedPassword } = await this.bcryptService.encrypt(
      params.password,
    );

    await this.authRepository.createAuthenticationInfo({
      email: params.email,
      password: hashedPassword,
    });

    return {
      message: 'Authentication created!',
    };
  }
}
