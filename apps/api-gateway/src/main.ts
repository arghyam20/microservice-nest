import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp, listenHttpApp } from '../../../libs/common/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app, 'api-gateway');
  await listenHttpApp(app, 3000);
}

bootstrap().catch((error) => {
  new Logger('api-gateway').error(error);
  process.exit(1);
});
