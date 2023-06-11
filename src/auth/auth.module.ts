import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignIn } from './protocols/usecases';
import { SignInUsecase } from './usecases';
import { AuthenticationEntity } from '@entities/AuthenticationEntity';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { IVerifyAuthRepo } from './protocols/repository';
import { AuthenticationRepository } from './repositories';
import { DataSource, Repository } from 'typeorm';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthenticationRepository,
      useFactory: (dataSource: DataSource) => {
        return new AuthenticationRepository(
          dataSource.getRepository(AuthenticationEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: IVerifyAuthRepo,
      useClass: AuthenticationRepository,
    },
    {
      provide: SignIn,
      useClass: SignInUsecase,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([
      AuthenticationEntity,
      Repository<AuthenticationEntity>,
    ]),
  ],
})
export class AuthModule {}
