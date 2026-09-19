import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp, listenHttpApp } from '../../../libs/common/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app, 'booking-service');
  await listenHttpApp(app, 3005);
}

bootstrap().catch((error) => {
  new Logger('booking-service').error(error);
  process.exit(1);
});
