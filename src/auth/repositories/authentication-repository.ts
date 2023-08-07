import {
  VerifyAuthRepoInput,
  VerifyAuthRepoOutput,
  CreateAuthRepoInput,
  CreateAuthRepoOutput,
  AuthRepoProtocol,
} from '../protocols/repository';
import { AuthenticationEntity } from '../../database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationRepository implements AuthRepoProtocol {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private readonly authTypeOrmRepository: Repository<AuthenticationEntity>,
  ) {}
  async createAuth(params: CreateAuthRepoInput): Promise<CreateAuthRepoOutput> {
    const entityToSave = this.authTypeOrmRepository.create({
      email: params.email,
      password: params.password,
    });

    const saved = await this.authTypeOrmRepository.insert(entityToSave);
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
