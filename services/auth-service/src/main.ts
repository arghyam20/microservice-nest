import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: { groupId: 'auth-service-group' },
    },
  });
  await app.listen();
  console.log('Auth Service is listening');
}
bootstrap();
