import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createNestLogger } from './auth/infra/config/logger.config';
import { configureTracing } from './auth/infra/config/trace.config';
import { ConfigService } from '@nestjs/config';
import { ExceptionInterceptor } from './exception.interceptor';
import { CustomValidationPipe } from './auth/presentation/pipes/custom-validation-pipe';

async function bootstrap() {
  const logger = createNestLogger();

  const app = await NestFactory.create(AppModule).then(configureTracing);
  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');
  app.useGlobalInterceptors(new ExceptionInterceptor());
  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(port);
  const url = await app.getUrl();
  logger.log(`🚀 Application is running on ${url}`, 'ApplicationStartup');
}
bootstrap();
