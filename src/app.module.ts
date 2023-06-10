import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
