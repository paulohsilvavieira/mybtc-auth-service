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
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],

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
