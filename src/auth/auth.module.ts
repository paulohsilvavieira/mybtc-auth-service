import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { InfraModule } from './infra/infra.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [CoreModule, InfraModule, PresentationModule],
})
export class AuthModule {}
