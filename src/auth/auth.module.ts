import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  RegisterAuthProtocol,
  SendTokenRecoverPasswordProtocol,
  SignInProtocol,
} from './protocols/usecases';
import {
  SendTokenRecoverPasswordUsecase,
  SignInUsecase,
  UpdatePasswordUseCase,
} from './usecases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepoProtocol } from './protocols/repository';
import { AuthenticationRepository } from './repositories';
import { BcryptProtocol, JwtProtocol } from './protocols/cryptography';
import { BcryptService } from './services/bcrypt-service';
import { RegisterAuthUsecase } from './usecases/';
import { JsonWebTokenService } from './services/jwt-service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationEntity } from '../database/entities';
import { UpdatePasswordUseCaseProtocol } from './protocols/usecases/update-password';
import { PublisherMessage } from './protocols/message-broker/publish-message';
import {
  AmqpConnection,
  RabbitMQConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerService } from './services/message-broker-service';

const useFactory = (configService: ConfigService) => {
  const rabbitConfig: RabbitMQConfig = {
    exchanges: [
      {
        name: configService.get('EXCHANGE_NAME_MAILER_SERVICE'),
        type: 'direct',
      },
    ],

    uri: configService.get('AMQP_URI_CONNECTION'),
    connectionInitOptions: { wait: true },
  };
  return rabbitConfig;
};

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory,
    }),
    TypeOrmModule.forFeature([AuthenticationEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('SECRET_JWT'),
          signOptions: { expiresIn: '300s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthRepoProtocol,
      useClass: AuthenticationRepository,
    },

    {
      provide: PublisherMessage,
      useClass: MessageBrokerService,
    },

    {
      provide: BcryptProtocol,
      useFactory: () => new BcryptService(10),
    },
    {
      provide: JwtProtocol,
      useClass: JsonWebTokenService,
    },
    {
      provide: SignInProtocol,
      useClass: SignInUsecase,
    },
    {
      provide: RegisterAuthProtocol,
      useClass: RegisterAuthUsecase,
    },
    {
      provide: UpdatePasswordUseCaseProtocol,
      useClass: UpdatePasswordUseCase,
    },
    {
      provide: SendTokenRecoverPasswordProtocol,
      useClass: SendTokenRecoverPasswordUsecase,
    },
  ],

  exports: [
    BcryptProtocol,
    SignInProtocol,
    JwtProtocol,
    RegisterAuthProtocol,
    AuthRepoProtocol,
    UpdatePasswordUseCaseProtocol,
    PublisherMessage,
    SendTokenRecoverPasswordProtocol,
  ],
})
export class AuthModule {}
