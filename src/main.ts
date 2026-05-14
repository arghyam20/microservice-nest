import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Microservice Nest API')
    .setDescription('A comprehensive NestJS microservice with TypeORM, JWT authentication, Kafka integration, and file upload capabilities.')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('roles', 'Role management')
    .addTag('categories', 'Category management')
    .addTag('restaurants', 'Restaurant management')
    .addTag('menu-items', 'Restaurant menu management')
    .addTag('cart', 'Shopping cart')
    .addTag('orders', 'Food orders')
    .addTag('payments', 'Order payments')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const configService = app.get(ConfigService);

  const enableKafka = configService.get<boolean>('kafka.enabled', true);

  if (enableKafka) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>('kafka.clientId', 'microservice-nest'),
          brokers: configService.get<string[]>('kafka.brokers', ['localhost:9092']),
        },
        consumer: {
          groupId: configService.get<string>('kafka.groupId', 'microservice-group'),
        },
      },
    });

    try {
      await app.startAllMicroservices();
      console.log('Microservice is listening on Kafka');
    } catch (err) {
      console.warn('Kafka microservice failed to start. Continuing without Kafka.', err);
    }
  }

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000/v1');
  console.log('API Documentation available at: http://localhost:3000/api');
}

bootstrap();
