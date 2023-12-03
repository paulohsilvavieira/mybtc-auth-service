import {
  AuthRepoProtocol,
  SaveTokenRecoverPasswordInput,
} from '../../../core/domain/protocols/repository';
import { AuthenticationEntity } from '../entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationParams } from '@/auth/core/domain/entities/auth-info';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationRepository implements AuthRepoProtocol {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}
  async verifyExistsEmail(email: string): Promise<boolean> {
    const auth = await this.authTypeOrmRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    return auth !== null;
  }
  async getExpirationTimeTokenResetPassword(
    email: string,
  ): Promise<{ expirationTimeToken: number }> {
    const { expirationTimeToken } = await this.authTypeOrmRepository.findOne({
      where: {
        email,
      },
      select: {
        expirationTimeToken: true,
      },
    });
    return {
      expirationTimeToken,
    };
  }

  async invalidTokenExpiration(email: string): Promise<void> {
    await this.authTypeOrmRepository.update(
      {
        email,
      },
      {
        expirationTimeToken: Date.now() - 100000,
      },
    );
  }

  async getPasswordToCompre(email: string): Promise<{ password: string }> {
    const result = await this.authTypeOrmRepository.findOne({
      where: { email },
      select: {
        password: true,
      },
    });
    return {
      password: result ? result.password : null,
    };
  }

  async getAuthorizationIdWithEmail(
    email: string,
  ): Promise<{ authorizationId: string }> {
    const result = await this.authTypeOrmRepository.findOne({
      where: { email },
      select: { id: true },
    });
    return {
      authorizationId: result ? result.id : null,
    };
  }

  async createAuthenticationInfo(params: AuthenticationParams): Promise<void> {
    await this.authTypeOrmRepository.insert({
      id: randomUUID(),
      ...params,
    });
  }

  async updatePasswordAuth(params: AuthenticationParams): Promise<void> {
    await this.authTypeOrmRepository.update(
      { email: params.email },
      {
        password: params.password,
      },
    );
  }

  async saveTokenRecoverPassword(
    params: SaveTokenRecoverPasswordInput,
  ): Promise<void> {
    await this.authTypeOrmRepository.update(
      { email: params.email },
      {
        tokenRecoverPassword: params.tokenRecoverPassword,
        expirationTimeToken: params.expirationTimeToken,
      },
    );
  }
}
