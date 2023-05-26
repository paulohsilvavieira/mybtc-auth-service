import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          username: configService.get('PG_USERNAME'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DATABASE'),
          host: configService.get('PG_HOST'),
          entities: [__dirname + '/entities/index.{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
