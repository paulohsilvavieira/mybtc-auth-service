import { UserEntity } from '../../database/entities/UserEntity';
import {
  CreateUserRepoInput,
  CreateUserRepoOutput,
  SaveAddressInfoRepoInput,
  SaveAddressInfoRepoOutput,
  SaveUserDocumentsInfoRepoInput,
  SaveUserDocumentsInfoRepoOutput,
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

  async saveAddressUser(
    params: SaveAddressInfoRepoInput,
  ): Promise<SaveAddressInfoRepoOutput> {
    const { authenticationId, address, proofAddress, state, country } = params;
    const saveUserResult = await this.userTypeOrmRepository.update(
      {
        authenticationId,
      },
      {
        address,
        proofAddress,
        state,
        country,
      },
    );
    if (saveUserResult.affected > 0) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: 'Error on Save Address User Info',
    };
  }
  async saveDocuments(
    params: SaveUserDocumentsInfoRepoInput,
  ): Promise<SaveUserDocumentsInfoRepoOutput> {
    const {
      authenticationId,
      document,
      typeDocument,
      proofDocumentBack,
      proofDocumentFront,
    } = params;
    const saveUserResult = await this.userTypeOrmRepository.update(
      {
        authenticationId,
      },
      {
        document,
        typeDocument,
        proofDocumentFront,
        proofDocumentBack,
      },
    );
    if (saveUserResult.affected > 0) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: 'Error on Save Documents User Info',
    };
  }
}
