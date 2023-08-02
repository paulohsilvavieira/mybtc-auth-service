import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities';
import { UserRepoProtocol } from './protocols/repositories';
import { UserRepository } from './repository/user-repository';
import {
  CreateUserProtocol,
  SaveAddressUserProtocol,
  SaveDocumentsUserProtocol,
} from './protocols/usecases';
import { CreateUserUseCase } from './usecases/create-user-usecase';
import { SaveAddressUserUseCase } from './usecases/save-address-info-user-usecase';
import { SaveDocumentsUserUseCase } from './usecases/save-documents-user-usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepoProtocol,
      useClass: UserRepository,
    },

    {
      provide: CreateUserProtocol,
      useClass: CreateUserUseCase,
    },
    {
      provide: SaveAddressUserProtocol,
      useClass: SaveAddressUserUseCase,
    },
    {
      provide: SaveDocumentsUserProtocol,
      useClass: SaveDocumentsUserUseCase,
    },
  ],

  exports: [
    SaveDocumentsUserProtocol,
    SaveAddressUserProtocol,
    CreateUserProtocol,
    UserRepoProtocol,
  ],
})
export class UserModule {}
