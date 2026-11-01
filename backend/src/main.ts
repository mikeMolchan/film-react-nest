import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from './app.config.provider';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

const loggers = {
  dev: DevLogger,
  json: JsonLogger,
  tskv: TskvLogger,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const loggerName = app.get(ConfigService).get<string>('LOGGER', 'dev');
  const Logger = loggers[loggerName as keyof typeof loggers] ?? DevLogger;
  app.useLogger(new Logger());

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get<AppConfig>('CONFIG');
  await app.listen(config.port);
}
bootstrap();
