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

  // resetPassswordWithToken: (
  //   parans: ResetPasswordUseCaseInput,
  // ) => Promise<ResetPasswordUseCaseOutput>;
  // async saveTokenRecoverPassword(
  //   params: SaveTokenRecoverPassword,
  // ): Promise<{ success: boolean }> {
  //   const auth = await this.authTypeOrmRepository.update(
  //     {
  //       email: params.email,
  //     },
  //     {
  //       tokenRecoverPassword: params.token,
  //     },
  //   );
  //   return {
  //     success: auth.affected > 0,
  //   };
  // }
  // async findById(authorizationId: string): Promise<{ password: string }> {
  //   const auth = await this.authTypeOrmRepository.findOneBy({
  //     id: authorizationId,
  //   });
  //   return {
  //     password: auth !== null ? auth.password : undefined,
  //   };
  // }

  // async updatePassword(
  //   params: UpdatePasswordRepoInput,
  // ): Promise<UpdatePasswordRepoOutput> {
  //   this.logger.log({
  //     message: 'Start process to update password',
  //   });

  //   const result = await this.authTypeOrmRepository.update(
  //     {
  //       id: params.authorizationId,
  //     },
  //     {
  //       password: params.newPassword,
  //     },
  //   );
  //   return {
  //     success: result.affected > 0,
  //   };
  // }
  // async createAuth(params: CreateAuthRepoInput): Promise<CreateAuthRepoOutput> {
  //   const entityToSave = this.authTypeOrmRepository.create({
  //     email: params.email,
  //     password: params.password,
  //   });

  //   const saved = await this.authTypeOrmRepository.insert(entityToSave);
  //   if (saved === undefined) {
  //     this.logger.log({
  //       message: 'Error saving authentication information',
  //     });
  //   } else {
  //     this.logger.log({
  //       message: 'Authentication data successfully saved',
  //     });
  //   }
  //   return {
  //     success: saved !== undefined,
  //   };
  // }

  // async verifyAuthByEmail(
  //   params: VerifyAuthRepoInput,
  // ): Promise<VerifyAuthRepoOutput> {
  //   const auth = await this.authTypeOrmRepository.findOneBy({
  //     email: params.email,
  //   });
  //   return {
  //     isValidEmail: auth !== null,
  //     password: auth !== null ? auth.password : undefined,
  //     authorizationId: auth !== null ? auth.id : undefined,
  //   };
  // }
}
