import { Module } from '@nestjs/common';
import { AuthRepoProtocol } from '../core/domain/protocols/repository';
import { AuthenticationRepository } from './database/repositories';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationEntity } from './database/entities';
import {
  BcryptProtocol,
  JwtProtocol,
} from '../core/domain/protocols/cryptography';
import { PublishMessage } from '../core/domain/protocols/message-broker/publish-message';
import { BcryptService } from './services/bcrypt-service';
import { JsonWebTokenService } from './services/jwt-service';
import { MessageBrokerService } from './services/message-broker-service';

const useFactoryForRabbitMQ = (configService: ConfigService) => {
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          username: configService.get('PG_USERNAME'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DATABASE'),
          host: configService.get('PG_HOST'),
          port: configService.get('PG_PORT'),
          entities: [__dirname + '/database/entities/index{.ts,.js}'],
          synchronize: false,
          logging: true,
        };
      },
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: useFactoryForRabbitMQ,
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
  providers: [
    {
      provide: AuthRepoProtocol,
      useClass: AuthenticationRepository,
    },

    {
      provide: PublishMessage,
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
  ],
  exports: [BcryptProtocol, PublishMessage, AuthRepoProtocol, JwtProtocol],
})
export class InfraModule {}
