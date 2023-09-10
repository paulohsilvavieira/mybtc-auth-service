import {
  VerifyAuthRepoInput,
  VerifyAuthRepoOutput,
  CreateAuthRepoInput,
  CreateAuthRepoOutput,
  AuthRepoProtocol,
  UpdatePasswordRepoInput,
  UpdatePasswordRepoOutput,
} from '../protocols/repository';
import { AuthenticationEntity } from '../../database/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationRepository implements AuthRepoProtocol {
  private readonly logger = new Logger(AuthenticationRepository.name);

  constructor(
    @InjectRepository(AuthenticationEntity)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}
  async findById(authorizationId: string): Promise<{ password: string }> {
    const auth = await this.authTypeOrmRepository.findOneBy({
      id: authorizationId,
    });
    return {
      password: auth !== null ? auth.password : undefined,
    };
  }

  async updatePassword(
    params: UpdatePasswordRepoInput,
  ): Promise<UpdatePasswordRepoOutput> {
    this.logger.log({
      message: 'Start process to update password',
    });

    const result = await this.authTypeOrmRepository.update(
      {
        id: params.authorizationId,
      },
      {
        password: params.newPassword,
      },
    );
    return {
      success: result.affected > 0,
    };
  }
  async createAuth(params: CreateAuthRepoInput): Promise<CreateAuthRepoOutput> {
    this.logger.log({
      message: 'Start process to save Authentication info on Database',
    });

    const entityToSave = this.authTypeOrmRepository.create({
      email: params.email,
      password: params.password,
    });

    const saved = await this.authTypeOrmRepository.insert(entityToSave);
    if (saved === undefined) {
      this.logger.log({
        message: 'Error saving authentication information',
      });
    } else {
      this.logger.log({
        message: 'Authentication data successfully saved',
      });
    }
    return {
      success: saved !== undefined,
    };
  }

  async verifyAuthByEmail(
    params: VerifyAuthRepoInput,
  ): Promise<VerifyAuthRepoOutput> {
    const auth = await this.authTypeOrmRepository.findOneBy({
      email: params.email,
    });
    return {
      isValidEmail: auth !== null,
      password: auth !== null ? auth.password : undefined,
      authorizationId: auth !== null ? auth.id : undefined,
    };
  }
}
