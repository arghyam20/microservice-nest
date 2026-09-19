import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp, listenHttpApp } from '../../../libs/common/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app, 'vendor-service');
  await listenHttpApp(app, 3002);
}

bootstrap().catch((error) => {
  new Logger('vendor-service').error(error);
  process.exit(1);
});
