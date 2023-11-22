import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createNestLogger } from './config/logger.config';
import { configureTracing } from './config/trace.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = createNestLogger();

  const app = await NestFactory.create(AppModule).then(configureTracing);
  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');
  await app.listen(port);
  const url = await app.getUrl();
  logger.log(`🚀 Application is running on ${url}`, 'ApplicationStartup');
}
bootstrap();
