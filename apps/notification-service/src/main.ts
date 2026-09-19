import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp, listenHttpApp } from '../../../libs/common/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app, 'notification-service');
  await listenHttpApp(app, 3007);
}

bootstrap().catch((error) => {
  new Logger('notification-service').error(error);
  process.exit(1);
});
