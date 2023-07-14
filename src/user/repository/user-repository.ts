import { UserEntity } from '../../database/entities/UserEntity';
import {
  CreateUserRepoInput,
  CreateUserRepoOutput,
  UserRepoProtocol,
} from '../protocols/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements UserRepoProtocol {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userTypeOrmRepository: Repository<UserEntity>,
  ) {}
  async createUser(params: CreateUserRepoInput): Promise<CreateUserRepoOutput> {
    const { authenticationId, lastName, firstName, phoneNumber } = params;
    const saveUserResult = await this.userTypeOrmRepository.update(
      {
        authenticationId,
      },
      {
        firstName,
        lastName,
        phoneNumber,
      },
    );
    if (saveUserResult.affected > 0) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: 'Error on Save User Info',
    };
  }
}
