import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp, listenHttpApp } from '../../../libs/common/src';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app, 'inventory-service');
  await listenHttpApp(app, 3004);
}

bootstrap().catch((error) => {
  new Logger('inventory-service').error(error);
  process.exit(1);
});
